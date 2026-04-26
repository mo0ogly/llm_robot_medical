/**
 * Simple word-level diff utility for comparing baseline vs evolved payloads.
 * Returns an array of {text, type} where type is 'same', 'added', or 'removed'.
 * Uses longest common subsequence (LCS) approach on word tokens.
 */
export function computeWordDiff(textA, textB) {
  if (!textA && !textB) return [];
  if (!textA) return [{ text: textB, type: 'added' }];
  if (!textB) return [{ text: textA, type: 'removed' }];

  var wordsA = textA.split(/(\s+)/);
  var wordsB = textB.split(/(\s+)/);

  // Simple LCS-based diff
  var m = wordsA.length;
  var n = wordsB.length;

  // Build LCS table
  var dp = [];
  var i, j;
  for (i = 0; i <= m; i++) {
    dp[i] = [];
    for (j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else if (wordsA[i - 1] === wordsB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to get diff
  var result = [];
  i = m;
  j = n;
  var stack = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      stack.push({ text: wordsA[i - 1], type: 'same' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ text: wordsB[j - 1], type: 'added' });
      j--;
    } else {
      stack.push({ text: wordsA[i - 1], type: 'removed' });
      i--;
    }
  }

  // Reverse and merge consecutive same-type entries
  stack.reverse();
  var merged = [];
  for (var k = 0; k < stack.length; k++) {
    if (merged.length > 0 && merged[merged.length - 1].type === stack[k].type) {
      merged[merged.length - 1].text += stack[k].text;
    } else {
      merged.push({ text: stack[k].text, type: stack[k].type });
    }
  }

  return merged;
}
