// frontend/src/components/redteam/HistoryTab.jsx
// Parent orchestrator for Campaign History — search, filter, sort, group, export
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, Trash2, ChevronDown, ChevronRight, FileDown } from 'lucide-react';
import HistoryStatsBar from './HistoryStatsBar';
import HistoryCard from './HistoryCard';
import HistoryEmptyState from './HistoryEmptyState';

// ── Locale map for formatMonthLabel ──
var LOCALE_MAP = { fr: 'fr-FR', en: 'en-US', br: 'pt-BR' };

// ── Breach detection ──
function isBreach(entry) {
  var d = entry.data || {};
  if (entry.type === 'campaign') {
    var s = d.summary || {};
    return ((s.prompt_leaks || 0) + (s.rule_bypasses || 0) + (s.injection_successes || 0)) > 0;
  }
  if (entry.type === 'scenario') {
    return d.breach_point !== null && d.breach_point !== undefined;
  }
  if (entry.type === 'studio') {
    return d.breach === true;
  }
  return false;
}

// ── Format month label with locale ──
function formatMonthLabel(key, lang) {
  var parts = key.split('-');
  var y = parseInt(parts[0], 10);
  var m = parseInt(parts[1], 10) - 1;
  var locale = LOCALE_MAP[lang] || 'en-US';
  try {
    return new Date(y, m, 1).toLocaleString(locale, { month: 'long', year: 'numeric' });
  } catch (e) {
    return key;
  }
}

export default function HistoryTab() {
  var ref = useTranslation();
  var t = ref.t;
  var i18n = ref.i18n;

  // ── Raw state from localStorage ──
  var historyState = useState([]);
  var history = historyState[0];
  var setHistory = historyState[1];

  var scenarioState = useState([]);
  var scenarioHistory = scenarioState[0];
  var setScenarioHistory = scenarioState[1];

  var studioState = useState([]);
  var studioHistory = studioState[0];
  var setStudioHistory = studioState[1];

  // ── UI state ──
  var filterState = useState('all');
  var activeFilter = filterState[0];
  var setActiveFilter = filterState[1];

  var searchState = useState('');
  var searchQuery = searchState[0];
  var setSearchQuery = searchState[1];

  var sortState = useState('newest');
  var sortMode = sortState[0];
  var setSortMode = sortState[1];

  var groupState = useState({});
  var expandedGroups = groupState[0];
  var setExpandedGroups = groupState[1];

  var cardState = useState({});
  var expandedCards = cardState[0];
  var setExpandedCards = cardState[1];

  // ── Load from localStorage ──
  useEffect(function () {
    var saved = localStorage.getItem('redteam_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { /* ignore */ }
    }
    var savedScenarios = localStorage.getItem('redteam_scenario_history');
    if (savedScenarios) {
      try { setScenarioHistory(JSON.parse(savedScenarios)); } catch (e) { /* ignore */ }
    }
    var savedStudio = localStorage.getItem('redteam_studio_v2_history');
    if (savedStudio) {
      try { setStudioHistory(JSON.parse(savedStudio)); } catch (e) { /* ignore */ }
    }
  }, []);

  // ── Step 1: Normalize all entries ──
  var allEntries = useMemo(function () {
    var items = [];
    var i;
    for (i = 0; i < history.length; i++) {
      items.push({ id: 'c-' + i, type: 'campaign', date: history[i].date || '', data: history[i] });
    }
    for (i = 0; i < scenarioHistory.length; i++) {
      items.push({ id: 's-' + i, type: 'scenario', date: scenarioHistory[i].date || '', data: scenarioHistory[i] });
    }
    for (i = 0; i < studioHistory.length; i++) {
      items.push({ id: 'st-' + i, type: 'studio', date: studioHistory[i].date || '', data: studioHistory[i] });
    }
    return items;
  }, [history, scenarioHistory, studioHistory]);

  // ── Step 2: Filter by tab ──
  var filteredByTab = useMemo(function () {
    if (activeFilter === 'all') return allEntries;
    var map = { campaigns: 'campaign', scenarios: 'scenario', studio: 'studio' };
    var target = map[activeFilter];
    return allEntries.filter(function (e) { return e.type === target; });
  }, [allEntries, activeFilter]);

  // ── Step 3: Filter by search ──
  var filteredBySearch = useMemo(function () {
    if (!searchQuery) return filteredByTab;
    var q = searchQuery.toLowerCase();
    return filteredByTab.filter(function (e) {
      var d = e.data || {};
      var fields = [
        d.scenario_name || '',
        d.scenario_id || '',
        d.attackType || '',
        d.mode || '',
        (e.date || '').slice(0, 10)
      ];
      for (var i = 0; i < fields.length; i++) {
        if (fields[i].toLowerCase().indexOf(q) >= 0) return true;
      }
      return false;
    });
  }, [filteredByTab, searchQuery]);

  // ── Step 4: Sort ──
  var sorted = useMemo(function () {
    var arr = filteredBySearch.slice();
    if (sortMode === 'newest') {
      arr.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    } else if (sortMode === 'oldest') {
      arr.sort(function (a, b) { return (a.date || '').localeCompare(b.date || ''); });
    } else if (sortMode === 'breach_rate') {
      arr.sort(function (a, b) {
        var bA = isBreach(a) ? 1 : 0;
        var bB = isBreach(b) ? 1 : 0;
        if (bB !== bA) return bB - bA;
        return (b.date || '').localeCompare(a.date || '');
      });
    }
    return arr;
  }, [filteredBySearch, sortMode]);

  // ── Step 5: Group by month ──
  var grouped = useMemo(function () {
    var groups = {};
    for (var i = 0; i < sorted.length; i++) {
      var key = (sorted[i].date || '').slice(0, 7);
      if (!key || key.length < 7) key = 'unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(sorted[i]);
    }
    return groups;
  }, [sorted]);

  var sortedMonthKeys = useMemo(function () {
    return Object.keys(grouped).sort().reverse();
  }, [grouped]);

  // ── Auto-expand first month on initial load ──
  useEffect(function () {
    if (sortedMonthKeys.length > 0 && Object.keys(expandedGroups).length === 0) {
      var init = {};
      init[sortedMonthKeys[0]] = true;
      setExpandedGroups(init);
    }
  }, [sortedMonthKeys]);

  // ── Stats ──
  var stats = useMemo(function () {
    var totalBreached = 0;
    for (var i = 0; i < allEntries.length; i++) {
      if (isBreach(allEntries[i])) totalBreached++;
    }
    var rate = allEntries.length > 0 ? Math.round((totalBreached / allEntries.length) * 100) : 0;

    var dates = [];
    for (var j = 0; j < allEntries.length; j++) {
      if (allEntries[j].date) dates.push(allEntries[j].date);
    }
    dates.sort();

    var dateRange = '\u2014';
    if (dates.length > 0) {
      var locale = LOCALE_MAP[i18n.language] || 'en-US';
      var oldest = new Date(dates[0]);
      var newest = new Date(dates[dates.length - 1]);
      try {
        var fmt = { month: 'short', year: 'numeric' };
        dateRange = oldest.toLocaleDateString(locale, fmt) + ' \u2014 ' + newest.toLocaleDateString(locale, fmt);
      } catch (e) {
        dateRange = dates[0].slice(0, 7) + ' \u2014 ' + dates[dates.length - 1].slice(0, 7);
      }
    }

    return {
      totalCampaigns: history.length,
      totalScenarios: scenarioHistory.length,
      totalStudio: studioHistory.length,
      globalBreachRate: rate,
      dateRange: dateRange
    };
  }, [allEntries, history, scenarioHistory, studioHistory, i18n.language]);

  // ── Tab counts ──
  var tabCounts = useMemo(function () {
    return {
      all: allEntries.length,
      campaigns: history.length,
      scenarios: scenarioHistory.length,
      studio: studioHistory.length
    };
  }, [allEntries, history, scenarioHistory, studioHistory]);

  // ── Toggle functions ──
  var toggleGroup = function (key) {
    setExpandedGroups(function (prev) {
      var next = {};
      for (var k in prev) {
        if (prev.hasOwnProperty(k)) next[k] = prev[k];
      }
      next[key] = !prev[key];
      return next;
    });
  };

  var toggleCard = function (id) {
    setExpandedCards(function (prev) {
      var next = {};
      for (var k in prev) {
        if (prev.hasOwnProperty(k)) next[k] = prev[k];
      }
      next[id] = !prev[id];
      return next;
    });
  };

  // ── CSV Export (uses current filtered/sorted view) ──
  var exportCSV = function () {
    var rows = [];
    var section = activeFilter;
    var i, e, d, s, payload, bp;

    if (section === 'all') {
      rows.push('Type,Date,Detail1,Detail2,Detail3,Detail4,Detail5');
      for (i = 0; i < sorted.length; i++) {
        e = sorted[i];
        d = e.data || {};
        if (e.type === 'campaign') {
          s = d.summary || {};
          rows.push('Campaign,' + (d.date || '') + ',' + (s.total_rounds || 0) + ' rounds,' + (s.prompt_leaks || 0) + ' leaks,' + (s.rule_bypasses || 0) + ' bypasses,' + (s.injection_successes || 0) + ' injections,');
        } else if (e.type === 'scenario') {
          bp = (d.breach_point !== null && d.breach_point !== undefined) ? d.breach_point : '';
          rows.push('Scenario,' + (d.date || '') + ',"' + (d.scenario_name || '').replace(/"/g, '""') + '",' + (d.steps_passed || 0) + '/' + (d.total_steps || 0) + ',' + bp + ',,');
        } else if (e.type === 'studio') {
          payload = '"' + (d.payload || '').replace(/"/g, '""').replace(/\n/g, ' ') + '"';
          rows.push('Studio,' + (d.date || '') + ',' + (d.mode || '') + ',' + (d.attackType || '') + ',' + (d.svc || '') + ',' + (d.breach ? 'YES' : 'NO') + ',' + payload);
        }
      }
    } else if (section === 'campaigns') {
      rows.push('Date,Rounds,Leaks,Bypasses,Injections');
      for (i = 0; i < sorted.length; i++) {
        e = sorted[i];
        if (e.type !== 'campaign') continue;
        d = e.data || {};
        s = d.summary || {};
        rows.push((d.date || '') + ',' + (s.total_rounds || 0) + ',' + (s.prompt_leaks || 0) + ',' + (s.rule_bypasses || 0) + ',' + (s.injection_successes || 0));
      }
    } else if (section === 'scenarios') {
      rows.push('Date,Name,Steps Passed,Total Steps,Breach Point');
      for (i = 0; i < sorted.length; i++) {
        e = sorted[i];
        if (e.type !== 'scenario') continue;
        d = e.data || {};
        bp = (d.breach_point !== null && d.breach_point !== undefined) ? d.breach_point : '';
        rows.push((d.date || '') + ',"' + (d.scenario_name || '').replace(/"/g, '""') + '",' + (d.steps_passed || 0) + ',' + (d.total_steps || 0) + ',' + bp);
      }
    } else if (section === 'studio') {
      rows.push('Date,Mode,Attack Type,SVC,Breach,Payload');
      for (i = 0; i < sorted.length; i++) {
        e = sorted[i];
        if (e.type !== 'studio') continue;
        d = e.data || {};
        payload = '"' + (d.payload || '').replace(/"/g, '""').replace(/\n/g, ' ') + '"';
        rows.push((d.date || '') + ',' + (d.mode || '') + ',' + (d.attackType || '') + ',' + (d.svc !== undefined ? d.svc : '') + ',' + (d.breach ? 'YES' : 'NO') + ',' + payload);
      }
    }

    if (rows.length <= 1) return;

    var csv = '\uFEFF' + rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'aegis_history_' + section + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── JSON Export (existing behavior) ──
  var exportAll = function () {
    var data = { campaigns: history, scenarios: scenarioHistory, studio: studioHistory };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'aegis_history_all_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Clear History ──
  var clearHistory = function () {
    localStorage.removeItem('redteam_history');
    localStorage.removeItem('redteam_scenario_history');
    localStorage.removeItem('redteam_studio_v2_history');
    setHistory([]);
    setScenarioHistory([]);
    setStudioHistory([]);
  };

  // ── If absolutely no data ──
  if (allEntries.length === 0) {
    return <HistoryEmptyState filtered={false} />;
  }

  // ── Config arrays ──
  var TABS = ['all', 'campaigns', 'scenarios', 'studio'];
  var TAB_LABELS = {
    all: t('redteam.history.filterAll'),
    campaigns: t('redteam.history.filterCampaigns'),
    scenarios: t('redteam.history.filterScenarios'),
    studio: t('redteam.history.filterStudio')
  };

  var SORT_MODES = [
    { key: 'newest', label: t('redteam.history.sortNewest') },
    { key: 'oldest', label: t('redteam.history.sortOldest') },
    { key: 'breach_rate', label: t('redteam.history.sortBreach') }
  ];

  // ── Render ──
  return (
    <div className="space-y-3">
      {/* Stats Bar */}
      <HistoryStatsBar stats={stats} allEntries={allEntries} />

      {/* Search Bar */}
      <div className="relative">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-600" />
        <input
          type="text"
          value={searchQuery}
          onChange={function (e) { setSearchQuery(e.target.value); }}
          placeholder={t('redteam.history.searchPlaceholder')}
          className="w-full pl-7 pr-2 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-neutral-600"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1">
        {TABS.map(function (tab) {
          var isActive = activeFilter === tab;
          var cls = isActive
            ? 'border-neutral-500 bg-neutral-800 text-white'
            : 'border-neutral-800 text-neutral-600 hover:border-neutral-600';
          return (
            <button
              key={tab}
              onClick={function () { setActiveFilter(tab); }}
              className={'px-2 py-1 rounded text-[9px] font-mono font-bold border transition-colors ' + cls}
            >
              {TAB_LABELS[tab] + ' (' + tabCounts[tab] + ')'}
            </button>
          );
        })}
      </div>

      {/* Sort + Actions Row */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {SORT_MODES.map(function (sm) {
            var isActive = sortMode === sm.key;
            return (
              <button
                key={sm.key}
                onClick={function () { setSortMode(sm.key); }}
                className={'text-[9px] font-mono cursor-pointer transition-colors ' +
                  (isActive ? 'text-white font-bold' : 'text-neutral-600 hover:text-neutral-400')}
              >
                {sm.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={exportCSV}
            title={t('redteam.history.exportCSV')}
            className="text-neutral-600 hover:text-neutral-300 transition-colors"
          >
            <Download size={12} />
          </button>
          <button
            onClick={exportAll}
            title={t('redteam.history.exportJSON')}
            className="text-neutral-600 hover:text-neutral-300 transition-colors"
          >
            <FileDown size={14} />
          </button>
          <button
            onClick={clearHistory}
            title={t('redteam.history.clearConfirm')}
            className="text-neutral-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Grouped List */}
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2">
        {sortedMonthKeys.map(function (mk) {
          var isOpen = expandedGroups[mk];
          var entries = grouped[mk] || [];
          var Chevron = isOpen ? ChevronDown : ChevronRight;
          return (
            <div key={mk}>
              {/* Month Header */}
              <button
                onClick={function () { toggleGroup(mk); }}
                className="flex items-center gap-1 text-[10px] text-gray-500 tracking-wider py-1 hover:text-gray-300 cursor-pointer w-full text-left"
              >
                <Chevron size={12} />
                <span className="uppercase font-bold">
                  {formatMonthLabel(mk, i18n.language)}
                </span>
                <span className="text-neutral-700 ml-1">
                  {'(' + entries.length + ')'}
                </span>
              </button>

              {/* Cards */}
              {isOpen && (
                <div className="space-y-1 ml-1">
                  {entries.map(function (entry) {
                    return (
                      <HistoryCard
                        key={entry.id}
                        entry={entry}
                        expanded={!!expandedCards[entry.id]}
                        onToggle={function () { toggleCard(entry.id); }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty filtered state */}
      {sortedMonthKeys.length === 0 && (
        <HistoryEmptyState filtered={searchQuery.length > 0 || activeFilter !== 'all'} />
      )}
    </div>
  );
}
