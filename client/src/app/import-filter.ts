import { DeckCard } from './models/deck-card';

/**
 * Selects every parsed preview card before the user edits the filter.
 * Example: createSelectedCardIds(cards).has(cards[0].id) is true.
 */
export function createSelectedCardIds(cards: readonly DeckCard[]): Set<number> {
  return new Set(cards.map(card => card.id));
}

/**
 * Returns the selected cards in their original deck order.
 * Example: filterSelectedCards(cards, selectedIds) creates the practice deck.
 */
export function filterSelectedCards(
  cards: readonly DeckCard[],
  selectedIds: ReadonlySet<number>
): DeckCard[] {
  return cards.filter(card => selectedIds.has(card.id));
}
