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
    let session = createPracticeSession([card(1, '今日', 'きょう')]);

    session = submitPracticeAnswer(session, normalizeRomajiAnswer('KYOU'));

    expect(session.correctCount).toBe(1);
    expect(session.lastResult?.isCorrect).toBe(true);
  });

  it('reveals wrong answers and advances only after next', () => {
    let session = createPracticeSession([card(1, '今日', 'きょう')]);

    session = submitPracticeAnswer(session, normalizeRomajiAnswer('ashita'));

    expect(session.correctCount).toBe(0);
    expect(session.lastResult?.expectedHiragana).toBe('きょう');
    expect(session.isComplete).toBe(false);

    session = advancePracticeSession(session);

    expect(session.isComplete).toBe(true);
  });

  it('keeps final score from submitted answers', () => {
    let session = createPracticeSession([card(1, '一', 'いち'), card(2, '二', 'に')]);

    session = advancePracticeSession(submitPracticeAnswer(session, 'いち'));
    session = advancePracticeSession(submitPracticeAnswer(session, 'さん'));

    expect(session.correctCount).toBe(1);
    expect(session.submittedCount).toBe(2);
    expect(session.cards.length).toBe(2);
  });
});

function card(id: number, expression: string, readingHiragana: string): DeckCard {
  return {
    id,
    expression,
    exampleSentence: '',
    translation: '',
    readingHiragana,
    partOfSpeech: '',
    furiganaSentence: '',
    translatedSentence: '',
    hasKanji: true
  };
}
