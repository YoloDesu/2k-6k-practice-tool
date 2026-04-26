import { describe, expect, it } from 'vitest';
import { calculateElapsedSeconds, formatElapsedSeconds } from './elapsed-time';

describe('elapsed time', () => {
  it('calculates whole elapsed seconds', () => {
    expect(calculateElapsedSeconds(1000, 4500)).toBe(3);
  });

  it('formats stopwatch time as minutes and seconds', () => {
    expect(formatElapsedSeconds(125)).toBe('02:05');
  });

  it('rejects backwards timestamps with the offending value', () => {
    expect(() => calculateElapsedSeconds(5000, 1000)).toThrow('endedAtMs was 1000');
  });
});
