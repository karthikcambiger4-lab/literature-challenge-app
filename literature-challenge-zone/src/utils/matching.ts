export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an|of|and)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function isGuessCorrect(guess: string, acceptedAnswers: string[]): boolean {
  const normGuess = normalizeAnswer(guess);
  if (!normGuess || normGuess.length < 2) return false;

  for (const candidate of acceptedAnswers) {
    const normCand = normalizeAnswer(candidate);
    if (!normCand) continue;
    if (normGuess === normCand) return true;

    // Allow partial match if guess is a full word/name inside candidate (e.g. "Poe" for "Edgar Allan Poe")
    if (normGuess.length >= 4 && normCand.split(' ').includes(normGuess)) {
      return true;
    }

    // Allow small spelling variations using Levenshtein distance
    const maxEdits = normCand.length >= 10 ? 2 : normCand.length >= 5 ? 1 : 0;
    if (maxEdits > 0 && levenshtein(normGuess, normCand) <= maxEdits) {
      return true;
    }
  }

  return false;
}
