import { DeckCard } from '../models/deck-card';

export interface AnswerResult {
  readonly isCorrect: boolean;
  readonly submittedHiragana: string;
  readonly expectedHiragana: string;
}

export interface PracticeSessionState {
  readonly cards: readonly DeckCard[];
  readonly currentIndex: number;
  readonly correctCount: number;
  readonly incorrectCards: readonly DeckCard[];
  readonly submittedCount: number;
  readonly lastResult: AnswerResult | null;
  readonly isComplete: boolean;
}

/**
 * Creates a fresh practice session from selected preview cards.
 * Example: createPracticeSession(cards).currentIndex is 0.
 */
export function createPracticeSession(cards: readonly DeckCard[]): PracticeSessionState {
  return {
    cards,
    currentIndex: 0,
    correctCount: 0,
    incorrectCards: [],
    submittedCount: 0,
    lastResult: null,
    isComplete: cards.length === 0
  };
}

/**
 * Returns the card currently waiting for an answer.
 * Example: getCurrentPracticeCard(session)?.expression displays the prompt.
 */
export function getCurrentPracticeCard(session: PracticeSessionState): DeckCard | null {
  if (session.isComplete)
  {
    return null;
  }

  return session.cards[session.currentIndex] ?? null;
}

/**
 * Scores the current card without advancing to the next one.
 * Example: submitPracticeAnswer(session, 'きょう') records the attempt.
 */
export function submitPracticeAnswer(
  session: PracticeSessionState,
  submittedHiragana: string | readonly string[]
): PracticeSessionState {
  const currentCard = getCurrentPracticeCard(session);
  if (currentCard === null || session.lastResult !== null) {
    return session;
  }

  const result = createAnswerResult(currentCard, submittedHiragana);
  return applyAnswerResult(session, result, currentCard);
}

/**
 * Advances after a submitted answer or completes the session.
 * Example: advancePracticeSession(gradedSession).currentIndex is 1.
 */
export function advancePracticeSession(session: PracticeSessionState): PracticeSessionState {
  if (session.lastResult === null) {
    return session;
  }

  const nextIndex = session.currentIndex + 1;
  return {
    ...session,
    currentIndex: nextIndex,
    lastResult: null,
    isComplete: nextIndex >= session.cards.length
  };
}

function createAnswerResult(
  card: DeckCard,
  submittedHiragana: string | readonly string[]
): AnswerResult {
  const submittedAnswers = toSubmittedAnswerList(submittedHiragana);
  return {
    isCorrect: submittedAnswers.some(answer => isAcceptedCardAnswer(card, answer)),
    submittedHiragana: submittedAnswers[0] ?? '',
    expectedHiragana: card.readingHiragana
  };
}

function toSubmittedAnswerList(submittedHiragana: string | readonly string[]): readonly string[] {
  if (typeof submittedHiragana === 'string') {
    return [submittedHiragana];
  }

  return submittedHiragana;
}

function isAcceptedCardAnswer(card: DeckCard, submittedHiragana: string): boolean {
  if (submittedHiragana === card.readingHiragana) {
    return true;
  }

  return isAdjectiveStemAnswer(card, submittedHiragana);
}

function isAdjectiveStemAnswer(card: DeckCard, submittedHiragana: string): boolean {
  return card.partOfSpeech === 'Adjective'
    && `${submittedHiragana}い` === card.readingHiragana;
}

function applyAnswerResult(
  session: PracticeSessionState,
  result: AnswerResult,
  currentCard: DeckCard
): PracticeSessionState {
  const incorrectCards = result.isCorrect
    ? session.incorrectCards
    : [...session.incorrectCards, currentCard];

  return {
    ...session,
    correctCount: session.correctCount + (result.isCorrect ? 1 : 0),
    incorrectCards,
    submittedCount: session.submittedCount + 1,
    lastResult: result
  };
}
