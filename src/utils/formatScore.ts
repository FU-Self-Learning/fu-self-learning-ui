/**
 * Safely formats a score value to a fixed number of decimal places
 * @param score - The score value (can be number, string, or null/undefined)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted score string or '0' if invalid
 */
export const formatScore = (
  score: number | string | null | undefined,
  decimals: number = 1,
): string => {
  if (score === null || score === undefined) {
    return '0';
  }

  const numScore = typeof score === 'string' ? parseFloat(score) : score;

  if (isNaN(numScore)) {
    return '0';
  }

  return numScore.toFixed(decimals);
};
