// DefenseTaxonomyCard — Defense taxonomy coverage stats (compact card)
import { useTranslation } from 'react-i18next';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

var CLASS_COLORS = {
  prevention: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  detection: { bar: 'bg-blue-500', text: 'text-blue-400' },
  response: { bar: 'bg-orange-500', text: 'text-orange-400' },
  measurement: { bar: 'bg-purple-500', text: 'text-purple-400' },
};

export default function DefenseTaxonomyCard() {
  var { t } = useTranslation();
  var { data } = useFetchWithCache('/api/redteam/defense/coverage');

  if (!data) return null;

  var pct = data.percentage || 0;

  return (
    <div className="border border-neutral-700/50 rounded-lg p-3 bg-neutral-900/50 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-neutral-300 tracking-wide">
          {t('redteam.defense.taxonomy.coverage')}
        </span>
        <span className="text-xs font-mono text-neutral-400">
          {(data.production || 0) + '+' + (data.partial || 0) + '/' + (data.total || 0) + ' (' + pct + '%)'}
        </span>
      </div>

      {/* Global progress bar */}
      <div className="w-full h-1.5 bg-neutral-800 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
          style={{ width: pct + '%' }}
        />
      </div>

      {/* Per-class mini bars */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {(data.by_class || []).map(function(cls) {
          var colors = CLASS_COLORS[cls.class_id] || { bar: 'bg-gray-500', text: 'text-gray-400' };
          return (
            <div key={cls.class_id} className="flex items-center gap-2">
              <span className={'text-[10px] font-mono truncate w-20 ' + colors.text}>
                {t('redteam.defense.taxonomy.class.' + cls.class_id, { defaultValue: cls.class_label })}
              </span>
              <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={'h-full rounded-full transition-all duration-500 ' + colors.bar}
                  style={{ width: (cls.percentage || 0) + '%' }}
                />
              </div>
              <span className="text-[10px] text-neutral-500 font-mono w-12 text-right">
                {(cls.production || 0) + '+' + (cls.partial || 0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Implementation status legend */}
      <div className="mt-2 flex gap-3 text-[9px] text-neutral-600 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          {t('redteam.defense.taxonomy.impl.production')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          {t('redteam.defense.taxonomy.impl.partial')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 inline-block" />
          {t('redteam.defense.taxonomy.impl.planned')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" />
          {t('redteam.defense.taxonomy.impl.external')}
        </span>
      </div>
    </div>
  );
}
