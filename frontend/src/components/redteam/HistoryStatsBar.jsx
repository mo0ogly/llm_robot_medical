// frontend/src/components/redteam/HistoryStatsBar.jsx
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function HistoryStatsBar({ stats, allEntries }) {
  var { t } = useTranslation();

  var dayMap = useMemo(function () {
    var map = {};
    var now = new Date();
    for (var d = 29; d >= 0; d--) {
      var dt = new Date(now);
      dt.setDate(dt.getDate() - d);
      var key = dt.toISOString().slice(0, 10);
      map[key] = 0;
    }
    if (allEntries && allEntries.length) {
      for (var i = 0; i < allEntries.length; i++) {
        var eKey = (allEntries[i].date || '').slice(0, 10);
        if (eKey in map) {
          map[eKey] = map[eKey] + 1;
        }
      }
    }
    return map;
  }, [allEntries]);

  var days = useMemo(function () {
    return Object.keys(dayMap).sort().map(function (k) {
      return { date: k, count: dayMap[k] };
    });
  }, [dayMap]);

  var barHeight = function (count) {
    if (count === 0) return 2;
    return Math.min(24, 4 + count * 5);
  };

  var barColor = function (count) {
    if (count === 0) return 'bg-gray-800';
    if (count <= 2) return 'bg-green-900';
    if (count <= 5) return 'bg-green-700';
    return 'bg-green-500';
  };

  return (
    <div className="border border-gray-800 rounded-lg p-3 bg-[#111]">
      {/* Row 1 — Stats grid */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {/* Campaigns */}
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-purple-400">
            {stats.totalCampaigns}
          </div>
          <div className="text-[8px] text-gray-600 tracking-wider">
            {t('redteam.history.totalCampaigns')}
          </div>
        </div>

        {/* Scenarios */}
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-orange-400">
            {stats.totalScenarios}
          </div>
          <div className="text-[8px] text-gray-600 tracking-wider">
            {t('redteam.history.totalScenarios')}
          </div>
        </div>

        {/* Studio */}
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-cyan-400">
            {stats.totalStudio}
          </div>
          <div className="text-[8px] text-gray-600 tracking-wider">
            {t('redteam.history.totalStudio')}
          </div>
        </div>

        {/* Breach rate */}
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-red-500">
            {stats.globalBreachRate + '%'}
          </div>
          <div className="text-[8px] text-gray-600 tracking-wider">
            {t('redteam.history.breachRate')}
          </div>
        </div>

        {/* Date range */}
        <div className="text-center">
          <div className="text-sm font-bold font-mono text-gray-400">
            {stats.dateRange}
          </div>
          <div className="text-[8px] text-gray-600 tracking-wider">
            {t('redteam.history.dateRange')}
          </div>
        </div>
      </div>

      {/* Row 2 — Timeline heatmap */}
      <div className="flex gap-px items-end h-6">
        {days.map(function (d) {
          return (
            <div
              key={d.date}
              className={'flex-1 rounded-sm ' + barColor(d.count)}
              style={{ height: barHeight(d.count) + 'px' }}
              title={d.date + ' — ' + d.count}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] text-gray-600">
          {t('redteam.history.daysAgo30')}
        </span>
        <span className="text-[8px] text-gray-600">
          {t('redteam.history.today')}
        </span>
      </div>
    </div>
  );
}
