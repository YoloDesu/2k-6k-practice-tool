export interface DeckCard {
  readonly id: number;
  readonly expression: string;
  readonly exampleSentence: string;
  readonly translation: string;
  readonly readingHiragana: string;
  readonly partOfSpeech: string;
  readonly furiganaSentence: string;
  readonly translatedSentence: string;
  readonly hasKanji: boolean;
}

export interface DeckPreview {
  readonly cards: readonly DeckCard[];
  readonly rejectedRows: readonly RejectedDeckRow[];
}

export interface RejectedDeckRow {
  readonly lineNumber: number;
  readonly offendingValue: string;
  readonly expectedShape: string;
}
