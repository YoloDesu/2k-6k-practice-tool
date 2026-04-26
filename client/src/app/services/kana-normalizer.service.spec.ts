import { describe, expect, it } from 'vitest';
import { normalizeRomajiAnswerVariants } from './kana-normalizer.service';

describe('kana normalizer', () => {
  it('keeps the direct hiragana conversion', () => {
    expect(normalizeRomajiAnswerVariants('KYOU')).toContain('\u304d\u3087\u3046');
  });

  it('adds a moraic n variant before yoon syllables', () => {
    expect(normalizeRomajiAnswerVariants('kinyoubi')).toContain('\u304d\u3093\u3088\u3046\u3073');
  });

  it('does not rewrite initial ny syllables', () => {
    expect(normalizeRomajiAnswerVariants('nyuugaku')).toEqual(['\u306b\u3085\u3046\u304c\u304f']);
  });
});
