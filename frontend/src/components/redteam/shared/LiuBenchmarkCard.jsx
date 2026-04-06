// LiuBenchmarkCard — Liu et al. (USENIX 2024) benchmark comparison card
import { useTranslation } from 'react-i18next';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

function rateColor(val) {
  if (val < 0.1) return 'text-emerald-400';
  if (val <= 0.4) return 'text-amber-400';
  return 'text-rose-400';
}

function pct(val) {
  if (val == null) return '—';
  return (val * 100).toFixed(1) + '%';
}

export default function LiuBenchmarkCard() {
  var { t } = useTranslation();
  var { data: refData, loading: loadRef } = useFetchWithCache('/api/redteam/defense/liu-benchmark');
  var { data: aegisData, loading: loadAegis } = useFetchWithCache('/api/redteam/defense/liu-benchmark/aegis');
  var loading = loadRef || loadAegis;

  if (loading) {
    return (
      <div className="border border-neutral-700/50 rounded-lg p-3 bg-neutral-900/50 mb-4">
        <span className="text-[10px] text-neutral-500 animate-pulse">Loading Liu benchmark...</span>
      </div>
    );
  }

  if (!refData && !aegisData) return null;

  var defenses = (refData && refData.defenses) || [];
  var aegisFpr = aegisData ? aegisData.fpr : null;
  var aegisFnr = aegisData ? aegisData.fnr : null;
  var aegisEffectiveness = aegisData ? aegisData.effectiveness : null;

  return (
    <div className="border border-neutral-700/50 rounded-lg p-3 bg-neutral-900/50 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-neutral-300 tracking-wide">
          {t('redteam.defense.liu.title')}
        </span>
        <span className="text-[9px] font-mono text-neutral-600 italic">
          USENIX Security 2024
        </span>
      </div>

      {/* AEGIS effectiveness bar */}
      {aegisEffectiveness != null && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-neutral-400">
              {t('redteam.defense.liu.effectiveness')}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              {(aegisEffectiveness * 100).toFixed(1) + '%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: (aegisEffectiveness * 100) + '%' }}
            />
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="text-neutral-500 border-b border-neutral-800">
              <th className="text-left py-1 pr-2 font-medium">Defense</th>
              <th className="text-right py-1 pr-2 font-medium">{t('redteam.defense.liu.pna')}</th>
              <th className="text-right py-1 pr-2 font-medium">{t('redteam.defense.liu.asv')}</th>
              <th className="text-right py-1 pr-2 font-medium">{t('redteam.defense.liu.mr')}</th>
              <th className="text-right py-1 pr-2 font-medium">{t('redteam.defense.liu.fpr')}</th>
              <th className="text-right py-1 font-medium">{t('redteam.defense.liu.fnr')}</th>
            </tr>
          </thead>
          <tbody>
            {/* AEGIS row — highlighted */}
            {aegisData && (
              <tr className="border-b border-emerald-800/40 bg-emerald-950/20">
                <td className="py-1.5 pr-2 text-emerald-300 font-bold">AEGIS RagSanitizer</td>
                <td className="py-1.5 pr-2 text-right text-neutral-400">
                  {pct(aegisData.pna)}
                </td>
                <td className={'py-1.5 pr-2 text-right font-bold ' + rateColor(aegisData.asv || 0)}>
                  {pct(aegisData.asv)}
                </td>
                <td className="py-1.5 pr-2 text-right text-neutral-400">
                  {pct(aegisData.mr)}
                </td>
                <td className={'py-1.5 pr-2 text-right font-bold ' + rateColor(aegisFpr || 0)}>
                  {pct(aegisFpr)}
                </td>
                <td className={'py-1.5 text-right font-bold ' + rateColor(aegisFnr || 0)}>
                  {pct(aegisFnr)}
                </td>
              </tr>
            )}

            {/* Reference rows */}
            {defenses.map(function(d) {
              return (
                <tr key={d.name} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="py-1.5 pr-2 text-neutral-300 font-semibold">{d.name}</td>
                  <td className="py-1.5 pr-2 text-right text-neutral-400">
                    {pct(d.pna)}
                  </td>
                  <td className={'py-1.5 pr-2 text-right font-bold ' + rateColor(d.asv || 0)}>
                    {pct(d.asv)}
                  </td>
                  <td className="py-1.5 pr-2 text-right text-neutral-400">
                    {pct(d.mr)}
                  </td>
                  <td className={'py-1.5 pr-2 text-right font-bold ' + rateColor(d.fpr || 0)}>
                    {pct(d.fpr)}
                  </td>
                  <td className={'py-1.5 text-right font-bold ' + rateColor(d.fnr || 0)}>
                    {pct(d.fnr)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
