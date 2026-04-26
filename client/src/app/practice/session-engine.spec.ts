import { describe, expect, it } from 'vitest';
import { normalizeRomajiAnswer } from '../services/kana-normalizer.service';
import { DeckCard } from '../models/deck-card';
import {
  advancePracticeSession,
  createPracticeSession,
  submitPracticeAnswer
} from './session-engine';

describe('practice session engine', () => {
  it('accepts romaji converted to hiragana', () => {
    let session = createPracticeSession([card(1, 'today', '\u304d\u3087\u3046')]);

    session = submitPracticeAnswer(session, normalizeRomajiAnswer('KYOU'));

    expect(session.correctCount).toBe(1);
    expect(session.incorrectCards).toEqual([]);
    expect(session.lastResult?.isCorrect).toBe(true);
  });

  it('tracks wrong words and advances only after next', () => {
    let session = createPracticeSession([card(1, 'today', '\u304d\u3087\u3046')]);

    session = submitPracticeAnswer(session, normalizeRomajiAnswer('ashita'));

    expect(session.correctCount).toBe(0);
    expect(session.incorrectCards.map(missedCard => missedCard.expression)).toEqual(['today']);
    expect(session.lastResult?.expectedHiragana).toBe('\u304d\u3087\u3046');
    expect(session.isComplete).toBe(false);

    session = advancePracticeSession(session);

    expect(session.isComplete).toBe(true);
  });

  it('keeps final score and wrong words from submitted answers', () => {
    let session = createPracticeSession([
      card(1, 'one', '\u3044\u3061'),
      card(2, 'two', '\u306b')
    ]);

    session = advancePracticeSession(submitPracticeAnswer(session, '\u3044\u3061'));
    session = advancePracticeSession(submitPracticeAnswer(session, '\u3055\u3093'));

    expect(session.correctCount).toBe(1);
    expect(session.incorrectCards.map(missedCard => missedCard.expression)).toEqual(['two']);
    expect(session.submittedCount).toBe(2);
    expect(session.cards.length).toBe(2);
  });

  it('accepts adjective stems that omit the final hiragana i', () => {
    let session = createPracticeSession([
      card(1, 'big', '\u304a\u304a\u304d\u3044', 'Adjective')
    ]);

    session = submitPracticeAnswer(session, '\u304a\u304a\u304d');

    expect(session.correctCount).toBe(1);
    expect(session.incorrectCards).toEqual([]);
  });

  it('does not accept final i omission for non-adjectives', () => {
    let session = createPracticeSession([
      card(1, 'hate', '\u304d\u3089\u3044', 'Adjectival Noun')
    ]);

    session = submitPracticeAnswer(session, '\u304d\u3089');

    expect(session.correctCount).toBe(0);
    expect(session.incorrectCards.map(missedCard => missedCard.expression)).toEqual(['hate']);
  });
});

function card(
  id: number,
  expression: string,
  readingHiragana: string,
  partOfSpeech = ''
): DeckCard {
  return {
    id,
    expression,
    exampleSentence: '',
    translation: '',
    readingHiragana,
    partOfSpeech,
    furiganaSentence: '',
    translatedSentence: '',
    hasKanji: true
  };
}
