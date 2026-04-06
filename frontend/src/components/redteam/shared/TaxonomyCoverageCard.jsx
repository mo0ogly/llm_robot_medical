// TaxonomyCoverageCard — CrowdStrike taxonomy coverage stats (compact card)
import { useTranslation } from 'react-i18next';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

var CLASS_COLORS = {
  overt: { bar: 'bg-red-500', text: 'text-red-400' },
  indirect: { bar: 'bg-blue-500', text: 'text-blue-400' },
  social_cognitive: { bar: 'bg-orange-500', text: 'text-orange-400' },
  evasive: { bar: 'bg-purple-500', text: 'text-purple-400' },
};

export default function TaxonomyCoverageCard() {
  var { t } = useTranslation();
  var { data } = useFetchWithCache('/api/redteam/taxonomy/coverage');

  if (!data) return null;

  var pct = data.percentage || 0;

  return (
    <div className="border border-neutral-700/50 rounded-lg p-3 bg-neutral-900/50 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-neutral-300 tracking-wide">
          {t('redteam.taxonomy.coverage.title')}
        </span>
        <span className="text-xs font-mono text-neutral-400">
          {data.covered + '/' + data.total + ' (' + pct + '%)'}
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
                {t('redteam.taxonomy.class.' + cls.class_id, { defaultValue: cls.class_label })}
              </span>
              <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={'h-full rounded-full transition-all duration-500 ' + colors.bar}
                  style={{ width: (cls.percentage || 0) + '%' }}
                />
              </div>
              <span className="text-[10px] text-neutral-500 font-mono w-12 text-right">
                {cls.covered + '/' + cls.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gap count */}
      {data.gap_techniques && data.gap_techniques.length > 0 && (
        <div className="mt-2 text-[10px] text-neutral-600 font-mono">
          {data.gap_techniques.length + ' ' + t('redteam.taxonomy.coverage.gap') + ' ' + t('redteam.taxonomy.techniques')}
        </div>
      )}
    </div>
  );
}
