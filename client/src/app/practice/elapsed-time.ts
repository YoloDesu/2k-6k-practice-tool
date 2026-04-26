/**
 * Calculates whole elapsed seconds between two millisecond timestamps.
 * Example: calculateElapsedSeconds(1000, 4500) returns 3.
 */
export function calculateElapsedSeconds(startedAtMs: number, endedAtMs: number): number {
  if (endedAtMs < startedAtMs) {
    throw new Error(`endedAtMs was ${endedAtMs}; expected a value greater than or equal to ${startedAtMs}.`);
  }

  return Math.floor((endedAtMs - startedAtMs) / 1000);
}

/**
 * Formats a duration for the final session summary.
 * Example: formatElapsedSeconds(125) returns '02:05'.
 */
export function formatElapsedSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${padTimePart(minutes)}:${padTimePart(seconds)}`;
}

function padTimePart(value: number): string {
  return value.toString().padStart(2, '0');
}
