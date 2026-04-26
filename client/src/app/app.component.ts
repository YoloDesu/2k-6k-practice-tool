import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeckCard, DeckPreview } from './models/deck-card';
import { DeckPreviewApiService } from './services/deck-preview-api.service';
import { KanaNormalizerService } from './services/kana-normalizer.service';
import { createPracticeCards, createSelectedCardIds } from './import-filter';
import {
  PracticeSessionState,
  advancePracticeSession,
  createPracticeSession,
  getCurrentPracticeCard,
  submitPracticeAnswer
} from './practice/session-engine';
import { calculateElapsedSeconds, formatElapsedSeconds } from './practice/elapsed-time';

type PracticePhase = 'upload' | 'preview' | 'practice' | 'complete';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly deckPreviewApi = inject(DeckPreviewApiService);
  private readonly kanaNormalizer = inject(KanaNormalizerService);
  @ViewChild('answerInput') private answerInput?: ElementRef<HTMLInputElement>;
  @ViewChild('deckFileInput') private deckFileInput?: ElementRef<HTMLInputElement>;
  private practiceStartedAtMs = 0;
  private stopwatchId: ReturnType<typeof setInterval> | null = null;

  protected answerText = '';
  protected elapsedSeconds = 0;
  protected errorMessage = '';
  protected importFile: File | null = null;
  protected isImporting = false;
  protected phase: PracticePhase = 'upload';
  protected preview: DeckPreview | null = null;
  protected selectedCardIds = new Set<number>();
  protected session = createPracticeSession([]);
  protected randomizeCards = false;
  protected showPhrases = true;
  protected showTranslation = true;

  protected get currentCard(): DeckCard | null {
    return getCurrentPracticeCard(this.session);
  }

  protected get selectedCount(): number {
    return this.selectedCardIds.size;
  }

  protected get totalCount(): number {
    return this.session.cards.length;
  }

  protected get finalElapsedTime(): string {
    return formatElapsedSeconds(this.elapsedSeconds);
  }

  protected get allCardsSelected(): boolean {
    return this.preview !== null && this.selectedCount === this.preview.cards.length;
  }

  protected get canImportDeck(): boolean {
    return this.importFile !== null && !this.isImporting;
  }

  @HostListener('document:keydown.enter', ['$event'])
  protected handleEnterKey(event: Event): void {
    if (this.phase !== 'practice') {
      return;
    }

    event.preventDefault();
    this.advancePracticeFromEnter();
  }

  ngOnDestroy(): void {
    this.stopStopwatch();
  }

  protected openFilePicker(): void {
    this.clearFileInput();
    this.importFile = null;
    this.errorMessage = '';
    this.deckFileInput?.nativeElement.click();
  }

  protected chooseFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file === null) {
      return;
    }

    this.importFile = file;
    this.errorMessage = '';
  }

  protected importDeck(): void {
    if (this.importFile === null) {
      this.errorMessage = 'Choose an Anki .txt export before importing.';
      return;
    }

    this.readDeckPreview(this.importFile);
  }

  protected isCardSelected(card: DeckCard): boolean {
    return this.selectedCardIds.has(card.id);
  }

  protected toggleCard(card: DeckCard, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.setCardSelected(card.id, checkbox.checked);
  }

  protected toggleAllCards(): void {
    if (this.preview === null) {
      return;
    }

    this.selectedCardIds = this.allCardsSelected
      ? new Set<number>()
      : createSelectedCardIds(this.preview.cards);
  }

  protected startPractice(): void {
    const cards = createPracticeCards(this.preview?.cards ?? [], this.selectedCardIds, this.randomizeCards);
    this.session = createPracticeSession(cards);
    this.answerText = '';
    this.phase = this.session.isComplete ? 'complete' : 'practice';
    this.startStopwatchIfNeeded();
    this.focusAnswerInput();
  }

  protected submitAnswer(): void {
    if (this.answerText.trim().length === 0) {
      return;
    }

    const normalizedAnswers = this.kanaNormalizer.normalizeRomajiAnswerVariants(this.answerText);
    this.session = submitPracticeAnswer(this.session, normalizedAnswers);
  }

  protected nextCard(): void {
    this.session = advancePracticeSession(this.session);
    this.answerText = '';
    this.phase = this.session.isComplete ? 'complete' : 'practice';
    this.finishStopwatchIfComplete();
    this.focusAnswerInput();
  }

  protected returnToSelection(): void {
    this.answerText = '';
    this.session = createPracticeSession([]);
    this.phase = 'preview';
    this.resetStopwatch();
  }

  protected restartPractice(): void {
    const cards = createPracticeCards(this.preview?.cards ?? this.session.cards, this.selectedCardIds, this.randomizeCards);
    this.session = createPracticeSession(cards);
    this.answerText = '';
    this.phase = this.session.isComplete ? 'complete' : 'practice';
    this.startStopwatchIfNeeded();
  }

  protected resetImport(): void {
    this.answerText = '';
    this.importFile = null;
    this.preview = null;
    this.selectedCardIds = new Set<number>();
    this.session = createPracticeSession([]);
    this.randomizeCards = false;
    this.showPhrases = true;
    this.showTranslation = true;
    this.phase = 'upload';
    this.clearFileInput();
    this.resetStopwatch();
  }

  private readDeckPreview(file: File): void {
    this.errorMessage = '';
    this.isImporting = true;
    this.preview = null;
    this.selectedCardIds = new Set<number>();
    this.deckPreviewApi.previewDeck(file).subscribe({
      next: preview => this.acceptDeckPreview(preview),
      error: () => this.rejectDeckPreview(),
    });
  }

  private acceptDeckPreview(preview: DeckPreview): void {
    this.preview = preview;
    this.selectedCardIds = createSelectedCardIds(preview.cards);
    this.isImporting = false;
    this.phase = 'preview';
    this.changeDetector.detectChanges();
  }

  private rejectDeckPreview(): void {
    this.errorMessage = 'The deck could not be imported. Confirm the API is running and the file is UTF-8 text.';
    this.isImporting = false;
    this.changeDetector.detectChanges();
  }

  private setCardSelected(cardId: number, isSelected: boolean): void {
    if (isSelected) {
      this.selectedCardIds.add(cardId);
      return;
    }

    this.selectedCardIds.delete(cardId);
  }

  private advancePracticeFromEnter(): void {
    if (this.session.lastResult !== null) {
      this.nextCard();
      return;
    }

    this.submitAnswer();
  }

  private clearFileInput(): void {
    if (this.deckFileInput === undefined) {
      return;
    }

    this.deckFileInput.nativeElement.value = '';
  }

  private focusAnswerInput(): void {
    if (this.session.isComplete) {
      return;
    }

    setTimeout(() => this.answerInput?.nativeElement.focus(), 0);
  }

  private startStopwatchIfNeeded(): void {
    if (this.session.isComplete) {
      this.resetStopwatch();
      return;
    }

    this.startStopwatch();
  }

  private startStopwatch(): void {
    this.stopStopwatch();
    this.practiceStartedAtMs = Date.now();
    this.elapsedSeconds = 0;
    this.stopwatchId = setInterval(() => this.updateElapsedSeconds(), 1000);
  }

  private updateElapsedSeconds(): void {
    this.elapsedSeconds = calculateElapsedSeconds(this.practiceStartedAtMs, Date.now());
  }

  private finishStopwatchIfComplete(): void {
    if (!this.session.isComplete) {
      return;
    }

    this.updateElapsedSeconds();
    this.stopStopwatch();
  }

  private resetStopwatch(): void {
    this.stopStopwatch();
    this.practiceStartedAtMs = 0;
    this.elapsedSeconds = 0;
  }

  private stopStopwatch(): void {
    if (this.stopwatchId === null) {
      return;
    }

    clearInterval(this.stopwatchId);
    this.stopwatchId = null;
  }
}
