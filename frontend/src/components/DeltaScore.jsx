import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function DeltaScore({ safeTokens, hackedTokens }) {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!safeTokens && !hackedTokens) return;
    const timer = setTimeout(() => {
      fetch('/api/query/deltascore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ safe_text: safeTokens || "", hacked_text: hackedTokens || "" })
      })
      .then(r => r.json())
      .then(data => setScore(data.score))
      .catch(() => setScore(0));
    }, 1000); // Debounce
    return () => clearTimeout(timer);
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
