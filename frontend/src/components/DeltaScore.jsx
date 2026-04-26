import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function levenshteinWords(a, b) {
  const aWords = a.split(/\s+/).filter(Boolean).slice(-100);
  const bWords = b.split(/\s+/).filter(Boolean).slice(-100);
  const m = aWords.length, n = bWords.length;
  if (m === 0 && n === 0) return 0;
  if (m === 0 || n === 0) return 1;

  const dp = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = aWords[i - 1] === bWords[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n] / Math.max(m, n);
}

export default function DeltaScore({ safeTokens, hackedTokens }) {
  const { t } = useTranslation();

  const score = useMemo(() => {
    if (!safeTokens && !hackedTokens) return 0;
    return Math.round(levenshteinWords(safeTokens || "", hackedTokens || "") * 100);
  }, [safeTokens, hackedTokens]);

  const color = score < 30 ? "bg-green-500" : score < 60 ? "bg-yellow-500" : "bg-red-500";
  const textColor = score < 30 ? "text-green-400" : score < 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-slate-900 border-y border-slate-700 shrink-0">
      <span className={'font-mono text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ' + textColor}>
        {t("compare.divergence")}: {score}%
      </span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded overflow-hidden">
        <div className={'h-full ' + color + ' transition-all duration-300'} style={{ width: score + '%' }} />
      </div>
    </div>
  );
}
