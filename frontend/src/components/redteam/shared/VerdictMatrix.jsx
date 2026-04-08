import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';

function parseThreshold(raw) {
  if (typeof raw === 'number') {
    return { operator: '>=', value: raw };
  }
  var str = String(raw).trim();
  if (str.startsWith('<=')) return { operator: '<=', value: parseFloat(str.slice(2)) };
  if (str.startsWith('>=')) return { operator: '>=', value: parseFloat(str.slice(2)) };
  if (str.startsWith('<'))  return { operator: '<',  value: parseFloat(str.slice(1)) };
  if (str.startsWith('>'))  return { operator: '>',  value: parseFloat(str.slice(1)) };
  if (str.startsWith('='))  return { operator: '=',  value: parseFloat(str.slice(1)) };
  return { operator: '>=', value: parseFloat(str) };
}

function evalPass(operator, observed, threshold) {
  if (typeof observed !== 'number' || isNaN(observed)) return false;
  if (operator === '<')  return observed < threshold;
  if (operator === '<=') return observed <= threshold;
  if (operator === '>')  return observed > threshold;
  if (operator === '>=') return observed >= threshold;
  if (operator === '=')  return observed === threshold;
  return false;
}

export default function VerdictMatrix({ criteria, results }) {
  var _t = useTranslation(), t = _t.t;

  if (!criteria || !results) return null;

  var keys = Object.keys(criteria);

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
        {t('redteam.experiment.verdictMatrix')}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700 text-neutral-400">
              <th className="text-left py-2 px-3 font-medium">{t('redteam.experiment.criterion')}</th>
              <th className="text-right py-2 px-3 font-medium">{t('redteam.experiment.threshold')}</th>
              <th className="text-right py-2 px-3 font-medium">{t('redteam.experiment.observed')}</th>
              <th className="text-center py-2 px-3 font-medium">{t('redteam.experiment.status')}</th>
            </tr>
          </thead>
          <tbody>
            {keys.map(function(key) {
              var parsed = parseThreshold(criteria[key]);
              var observed = results[key];
              var pass = evalPass(parsed.operator, observed, parsed.value);
              return (
                <tr key={key} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                  <td className="py-2 px-3 text-white font-mono">{key}</td>
                  <td className="py-2 px-3 text-right font-mono text-neutral-300">{String(criteria[key])}</td>
                  <td className={'py-2 px-3 text-right font-mono ' + (pass ? 'text-green-400' : 'text-red-400')}>
                    {observed != null ? String(observed) : 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {pass
                      ? <CheckCircle size={16} className="text-green-500 inline-block" />
                      : <XCircle size={16} className="text-red-500 inline-block" />}
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
