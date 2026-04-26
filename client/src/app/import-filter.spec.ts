import { describe, expect, it } from 'vitest';
import { DeckCard } from './models/deck-card';
import { createSelectedCardIds, filterSelectedCards } from './import-filter';

describe('import filter', () => {
  it('selects all parsed cards by default', () => {
    const cards = [card(1, '一'), card(2, 'これ')];

    const selectedIds = createSelectedCardIds(cards);

    expect(selectedIds.has(1)).toBe(true);
    expect(selectedIds.has(2)).toBe(true);
  });

  it('returns only cards left checked by the user', () => {
    const cards = [card(1, '一'), card(2, 'これ')];
    const selectedIds = new Set<number>([2]);

    const selectedCards = filterSelectedCards(cards, selectedIds);

    expect(selectedCards.map(selectedCard => selectedCard.expression)).toEqual(['これ']);
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
