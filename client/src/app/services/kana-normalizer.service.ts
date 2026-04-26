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

  /**
   * Converts typed romaji into acceptable hiragana interpretations.
   * Example: normalizeRomajiAnswerVariants('kinyoubi') includes 'きんようび'.
   */
  normalizeRomajiAnswerVariants(input: string): readonly string[] {
    return normalizeRomajiAnswerVariants(input);
  }
}

export function normalizeRomajiAnswer(input: string): string {
  return toHiragana(input.trim().toLowerCase());
}

export function normalizeRomajiAnswerVariants(input: string): readonly string[] {
  const romajiAnswer = input.trim().toLowerCase();
  const romajiVariants = [romajiAnswer, addMoraicNBeforeYoon(romajiAnswer)];
  const hiraganaVariants = romajiVariants.map(variant => toHiragana(variant));

  return Array.from(new Set(hiraganaVariants));
}

function addMoraicNBeforeYoon(romajiAnswer: string): string {
  return romajiAnswer.replace(/([aeiou])n(?=y[aeiou])/g, "$1n'");
}
