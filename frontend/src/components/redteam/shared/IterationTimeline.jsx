import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle } from 'lucide-react';

var VERDICT_COLORS = {
  SUPPORTED:    { dot: 'bg-green-500',  border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-900/10' },
  REFUTED:      { dot: 'bg-red-500',    border: 'border-red-500',   text: 'text-red-400',   bg: 'bg-red-900/10' },
  INCONCLUSIVE: { dot: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-400', bg: 'bg-orange-900/10' },
  PENDING:      { dot: 'bg-neutral-600', border: 'border-neutral-600', text: 'text-neutral-500', bg: 'bg-neutral-900/10' },
};

function getVerdictStyle(verdict) {
  return VERDICT_COLORS[verdict] || VERDICT_COLORS.PENDING;
}

function truncate(str, max) {
  if (!str) return '';
  if (str.length <= max) return str;
  return str.substring(0, max) + '...';
}

export default function IterationTimeline({ iterations, onSelectIteration }) {
  var _t = useTranslation(), t = _t.t;
  var _sel = useState(0), selected = _sel[0], setSelected = _sel[1];

  if (!iterations || iterations.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-center">
        <p className="text-neutral-600 text-xs font-mono uppercase tracking-widest">
          {t('redteam.experiment.noIterations')}
        </p>
      </div>
    );
  }

  function handleSelect(idx) {
    setSelected(idx);
    if (onSelectIteration) {
      onSelectIteration(idx);
    }
  }

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">
        {t('redteam.experiment.iterationTimeline')}
      </h4>
      <div className="relative pl-6">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-neutral-700" />

        {iterations.map(function(iter, idx) {
          var style = getVerdictStyle(iter.verdict);
          var isSelected = selected === idx;
          var isLast = idx === iterations.length - 1;

          return (
            <div key={idx} className={'relative ' + (isLast ? '' : 'mb-4')}>
              {/* Dot */}
              <div className={'absolute -left-6 top-2 w-4 h-4 rounded-full border-2 ' + style.dot + ' ' + style.border + ' z-10'} />

              {/* Card */}
              <button
                onClick={function() { handleSelect(idx); }}
                className={'w-full text-left p-3 rounded-lg border transition-all ' +
                  (isSelected
                    ? 'border-2 ' + style.border + ' ' + style.bg
                    : 'border border-neutral-800 hover:border-neutral-700 bg-black/30')}
              >
                {/* Header line */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    {'Run ' + (iter.run != null ? iter.run : idx + 1)}
                    {iter.model ? (' - ' + iter.model) : ''}
                  </span>
                  <span className={'text-[10px] font-bold px-2 py-0.5 rounded ' + style.text + ' ' + style.bg + ' border ' + style.border + '/30'}>
                    {iter.verdict || 'PENDING'}
                  </span>
                </div>

                {/* Date */}
                {iter.date && (
                  <span className="text-[10px] text-neutral-600 font-mono mt-1 block">
                    {iter.date}
                  </span>
                )}

                {/* Params / diagnosis */}
                {(iter.params || iter.diagnosis) && (
                  <div className="mt-2 space-y-1">
                    {iter.params && (
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {t('redteam.experiment.params') + ': ' + truncate(
                          typeof iter.params === 'string' ? iter.params : JSON.stringify(iter.params),
                          100
                        )}
                      </p>
                    )}
                    {iter.diagnosis && (
                      <p className="text-[10px] text-neutral-400 italic">
                        {truncate(iter.diagnosis, 100)}
                      </p>
                    )}
                  </div>
                )}

                {/* Findings badges */}
                {iter.findings && iter.findings.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {iter.findings.map(function(f, fi) {
                      return (
                        <span key={fi} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono">
                          {typeof f === 'string' ? f : f.label || f.id || String(f)}
                        </span>
                      );
                    })}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
