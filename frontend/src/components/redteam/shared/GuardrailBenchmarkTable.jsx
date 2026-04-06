// GuardrailBenchmarkTable — Guardrail benchmark comparison (Hackett et al. 2025)
import { useTranslation } from 'react-i18next';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

function asrColor(val) {
  if (val < 20) return 'text-emerald-400';
  if (val <= 50) return 'text-amber-400';
  return 'text-rose-400';
}

export default function GuardrailBenchmarkTable() {
  var { t } = useTranslation();
  var { data } = useFetchWithCache('/api/redteam/defense/benchmark');

  if (!data || !data.guardrails) return null;

  return (
    <div className="border border-neutral-700/50 rounded-lg p-3 bg-neutral-900/50 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-neutral-300 tracking-wide">
          {t('redteam.defense.benchmark.title')}
        </span>
        <span className="text-[9px] font-mono text-neutral-600 italic">
          {t('redteam.defense.benchmark.source')}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="text-neutral-500 border-b border-neutral-800">
              <th className="text-left py-1 pr-2 font-medium">Name</th>
              <th className="text-left py-1 pr-2 font-medium">{t('redteam.defense.benchmark.vendor')}</th>
              <th className="text-right py-1 pr-2 font-medium">{t('redteam.defense.benchmark.baseline')}</th>
              <th className="text-right py-1 pr-2 font-medium">{t('redteam.defense.benchmark.char_inj')}</th>
              <th className="text-right py-1 font-medium">{t('redteam.defense.benchmark.adv_ml')}</th>
            </tr>
          </thead>
          <tbody>
            {data.guardrails.map(function(g) {
              return (
                <tr key={g.name} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="py-1.5 pr-2 text-neutral-300 font-semibold">{g.name}</td>
                  <td className="py-1.5 pr-2 text-neutral-500">{g.vendor}</td>
                  <td className="py-1.5 pr-2 text-right text-neutral-400">
                    {(g.baseline_pi != null ? g.baseline_pi + '%' : '—')}
                  </td>
                  <td className={'py-1.5 pr-2 text-right font-bold ' + asrColor(g.char_inj_asr || 0)}>
                    {(g.char_inj_asr != null ? g.char_inj_asr + '%' : '—')}
                  </td>
                  <td className={'py-1.5 text-right font-bold ' + asrColor(g.adv_ml_asr || 0)}>
                    {(g.adv_ml_asr != null ? g.adv_ml_asr + '%' : '—')}
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
