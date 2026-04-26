import { describe, expect, it } from 'vitest';
import { DeckCard } from './models/deck-card';
import { createPracticeCards, createSelectedCardIds, filterSelectedCards } from './import-filter';

describe('import filter', () => {
  it('selects all parsed cards by default', () => {
    const cards = [card(1, 'one'), card(2, 'two')];

    const selectedIds = createSelectedCardIds(cards);

    expect(selectedIds.has(1)).toBe(true);
    expect(selectedIds.has(2)).toBe(true);
  });

  it('returns only cards left checked by the user', () => {
    const cards = [card(1, 'one'), card(2, 'two')];
    const selectedIds = new Set<number>([2]);

    const selectedCards = filterSelectedCards(cards, selectedIds);

    expect(selectedCards.map(selectedCard => selectedCard.expression)).toEqual(['two']);
  });

  it('keeps selected cards ordered when randomization is off', () => {
    const cards = [card(1, 'one'), card(2, 'two'), card(3, 'three')];

    const practiceCards = createPracticeCards(cards, new Set<number>([1, 3]), false);

    expect(practiceCards.map(practiceCard => practiceCard.expression)).toEqual(['one', 'three']);
  });

  it('randomizes selected cards with the provided random source', () => {
    const cards = [card(1, 'one'), card(2, 'two'), card(3, 'three')];
    const randomValues = [0, 0];

    const practiceCards = createPracticeCards(
      cards,
      createSelectedCardIds(cards),
      true,
      () => randomValues.shift() ?? 0
    );

    expect(practiceCards.map(practiceCard => practiceCard.expression)).toEqual(['two', 'three', 'one']);
  });

  it('rejects invalid random values with the offending value', () => {
    const cards = [card(1, 'one'), card(2, 'two')];

    expect(() => createPracticeCards(cards, createSelectedCardIds(cards), true, () => 1))
      .toThrow('randomValue was 1');
  });
});

function card(id: number, expression: string): DeckCard {
  return {
    id,
    expression,
    exampleSentence: '',
    translation: '',
    readingHiragana: '',
    partOfSpeech: '',
    furiganaSentence: '',
    translatedSentence: '',
    hasKanji: false
  };
}
