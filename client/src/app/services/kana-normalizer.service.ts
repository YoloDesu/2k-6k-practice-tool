import { Injectable } from '@angular/core';
import { toHiragana } from 'wanakana';

@Injectable({ providedIn: 'root' })
export class KanaNormalizerService {
  /**
   * Converts typed romaji into hiragana for answer comparison.
   * Example: normalizeRomajiAnswer('KYOU') returns 'きょう'.
   */
  normalizeRomajiAnswer(input: string): string {
    return normalizeRomajiAnswer(input);
  }
}

export function normalizeRomajiAnswer(input: string): string {
  return toHiragana(input.trim().toLowerCase());
}
