import { DeckCard } from './models/deck-card';

export type RandomValueSource = () => number;

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

/**
 * Creates the practice deck in either selected order or randomized order.
 * Example: createPracticeCards(cards, selectedIds, true) shuffles selected cards.
 */
export function createPracticeCards(
  cards: readonly DeckCard[],
  selectedIds: ReadonlySet<number>,
  shouldRandomize: boolean,
  randomValueSource: RandomValueSource = Math.random
): DeckCard[] {
  const practiceCards = filterSelectedCards(cards, selectedIds);
  if (!shouldRandomize) {
    return practiceCards;
  }

  return randomizePracticeCards(practiceCards, randomValueSource);
}

function randomizePracticeCards(
  practiceCards: DeckCard[],
  randomValueSource: RandomValueSource
): DeckCard[] {
  for (let index = practiceCards.length - 1; index > 0; index--) {
    const randomValue = randomValueSource();
    validateRandomValue(randomValue);
    const swapIndex = Math.floor(randomValue * (index + 1));
    const currentCard = practiceCards[index];
    practiceCards[index] = practiceCards[swapIndex];
    practiceCards[swapIndex] = currentCard;
  }

  return practiceCards;
}

function validateRandomValue(randomValue: number): void {
  if (randomValue >= 0 && randomValue < 1) {
    return;
  }

  throw new Error(`randomValue was ${randomValue}; expected 0 <= value < 1.`);
}
