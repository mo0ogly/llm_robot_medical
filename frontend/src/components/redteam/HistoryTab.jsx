// frontend/src/components/redteam/HistoryTab.jsx
// Parent orchestrator for Campaign History — search, filter, sort, group, export
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, Trash2, ChevronDown, ChevronRight, FileDown, Calendar, Filter, SortDesc } from 'lucide-react';
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

const HistoryTab = memo(function HistoryTab() {
  const { t, i18n } = useTranslation();

  // ── Raw state from localStorage ──
  const [history, setHistory] = useState([]);
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const [studioHistory, setStudioHistory] = useState([]);

  // ── UI state ──
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('newest');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  // ── Load from localStorage + Forge unified archive (API) ──
  useEffect(() => {
    // Load localStorage data (studio, scenarios)
    const saved = localStorage.getItem('redteam_history');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) {} }
    const savedScenarios = localStorage.getItem('redteam_scenario_history');
    if (savedScenarios) { try { setScenarioHistory(JSON.parse(savedScenarios)); } catch (e) {} }
    const savedStudio = localStorage.getItem('redteam_studio_v2_history');
    if (savedStudio) { try { setStudioHistory(JSON.parse(savedStudio)); } catch (e) {} }

    // Load experiments from Forge unified archive (F46, Sep(M), ASIDE)
    fetch('http://127.0.0.1:8042/api/redteam/experiments/list')
      .then(r => r.json())
      .then(data => {
        if (data.experiments && Array.isArray(data.experiments)) {
          const experiments = data.experiments.map((exp, idx) => ({
            id: `exp-${idx}`,
            type: 'experiment',
            exp_type: exp.type,
            campaign_id: exp.campaign_id,
            name: exp.name,
            date: exp.created_at,
            summary: {
              prompt_leaks: 0,
              rule_bypasses: 0,
              injection_successes: 0,
              total_evaluations: exp.total_evaluations,
            },
            data: exp,
          }));
          // Add experiments to history
          setHistory(prev => [...prev, ...experiments]);
        }
      })
      .catch(e => console.debug('Forge experiments load: optional', e));
  }, []);

  // ── DELETE INDIVIDUAL ENTRY ──
  const handleDeleteEntry = (entryId) => {
    const [typePrefix, indexStr] = entryId.split('-');
    const index = parseInt(indexStr, 10);

    if (typePrefix === 'c') {
      const newHist = history.filter((_, i) => i !== index);
      setHistory(newHist);
      localStorage.setItem('redteam_history', JSON.stringify(newHist));
    } else if (typePrefix === 's') {
      const newScen = scenarioHistory.filter((_, i) => i !== index);
      setScenarioHistory(newScen);
      localStorage.setItem('redteam_scenario_history', JSON.stringify(newScen));
    } else if (typePrefix === 'st') {
      const newStudio = studioHistory.filter((_, i) => i !== index);
      setStudioHistory(newStudio);
      localStorage.setItem('redteam_studio_v2_history', JSON.stringify(newStudio));
    }
  };

  // ── Normalize all entries ──
  const allEntries = useMemo(() => {
    let items = [];
    history.forEach((h, i) => items.push({ id: `c-${i}`, type: 'campaign', date: h.date || '', data: h }));
    scenarioHistory.forEach((s, i) => items.push({ id: `s-${i}`, type: 'scenario', date: s.date || '', data: s }));
    studioHistory.forEach((st, i) => items.push({ id: `st-${i}`, type: 'studio', date: st.date || '', data: st }));
    return items;
  }, [history, scenarioHistory, studioHistory]);

  // ── Filter by tab ──
  const filteredByTab = useMemo(() => {
    if (activeFilter === 'all') return allEntries;
    const map = { campaigns: 'campaign', scenarios: 'scenario', studio: 'studio' };
    return allEntries.filter(e => e.type === map[activeFilter]);
  }, [allEntries, activeFilter]);

  // ── Filter by search ──
  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return filteredByTab;
    const q = searchQuery.toLowerCase();
    return filteredByTab.filter(e => {
      const d = e.data || {};
      const fields = [d.scenario_name || '', d.scenario_id || '', d.attackType || '', d.mode || '', (e.date || '').slice(0, 10)];
      return fields.some(f => f.toLowerCase().includes(q));
    });
  }, [filteredByTab, searchQuery]);

  // ── Sort ──
  const sorted = useMemo(() => {
    let arr = [...filteredBySearch];
    if (sortMode === 'newest') arr.sort((a, b) => b.date.localeCompare(a.date));
    else if (sortMode === 'oldest') arr.sort((a, b) => a.date.localeCompare(b.date));
    else if (sortMode === 'breach_rate') {
      arr.sort((a, b) => {
        const bA = isBreach(a) ? 1 : 0;
        const bB = isBreach(b) ? 1 : 0;
        return bB !== bA ? bB - bA : b.date.localeCompare(a.date);
      });
    }
    return arr;
  }, [filteredBySearch, sortMode]);

  // ── Group by month ──
  const grouped = useMemo(() => {
    const groups = {};
    sorted.forEach(item => {
      let key = (item.date || '').slice(0, 7) || 'unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [sorted]);

  const sortedMonthKeys = useMemo(() => Object.keys(grouped).sort().reverse(), [grouped]);

  // ── Stats ──
  const stats = useMemo(() => {
    const totalBreached = allEntries.filter(isBreach).length;
    const rate = allEntries.length > 0 ? Math.round((totalBreached / allEntries.length) * 100) : 0;
    const dates = allEntries.map(e => e.date).filter(Boolean).sort();
    let dateRange = '—';
    if (dates.length > 0) {
      const locale = LOCALE_MAP[i18n.language] || 'en-US';
      const fmt = { month: 'short', year: 'numeric' };
      dateRange = `${new Date(dates[0]).toLocaleDateString(locale, fmt)} — ${new Date(dates[dates.length-1]).toLocaleDateString(locale, fmt)}`;
    }
    return {
      totalCampaigns: history.length,
      totalScenarios: scenarioHistory.length,
      totalStudio: studioHistory.length,
      globalBreachRate: rate,
      dateRange: dateRange
    };
  }, [allEntries, history, scenarioHistory, studioHistory, i18n.language]);

  const toggleGroup = useCallback((key) => setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] })), []);
  const toggleCard = useCallback((id) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] })), []);

  // ── Exports ──
  const exportCSV = () => {
    let rows = ['Type,Date,Summary,Detail'];
    sorted.forEach(e => {
        const d = e.data || {};
        if (e.type === 'campaign') rows.push(`Campaign,${d.date},${d.summary?.total_rounds} rounds,${d.summary?.injection_successes} breaches`);
        else if (e.type === 'scenario') rows.push(`Scenario,${d.date},${d.scenario_name},${d.steps_passed}/${d.total_steps}`);
        else if (e.type === 'studio') rows.push(`Studio,${d.date},${d.mode},${d.svc}`);
    });
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `aegis_history_${activeFilter}.csv`; a.click();
  };

  const clearHistory = () => {
    if (confirm(t('redteam.history.clearConfirm', { defaultValue: 'Wipe all history data?' }))) {
      ['redteam_history', 'redteam_scenario_history', 'redteam_studio_v2_history'].forEach(k => localStorage.removeItem(k));
      setHistory([]); setScenarioHistory([]); setStudioHistory([]);
    }
  };

  if (allEntries.length === 0) return <HistoryEmptyState filtered={false} />;

  const TABS = ['all', 'campaigns', 'scenarios', 'studio'];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <HistoryStatsBar stats={stats} allEntries={allEntries} />

      <div className="flex flex-col gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeFilter === tab 
                    ? 'bg-neutral-800 text-white shadow-lg' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {t(`redteam.history.filter.${tab}`)}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('redteam.catalog.search_placeholder')}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-red-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 uppercase tracking-wider">
               <SortDesc size={12} /> {t('redteam.history.sort.newest')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all" title="Export CSV">
              <Download size={16} />
            </button>
            <button onClick={clearHistory} className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Clear All">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedMonthKeys.length > 0 ? sortedMonthKeys.map(mk => {
          const isOpen = expandedGroups[mk] !== false; // Default to open
          const entries = grouped[mk] || [];
          return (
            <div key={mk} className="space-y-3">
              <button
                onClick={() => toggleGroup(mk)}
                className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-widest pl-2"
              >
                <Calendar size={14} />
                {formatMonthLabel(mk, i18n.language)}
                <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded ml-1">{entries.length}</span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {entries.map(entry => (
                    <HistoryCard
                      key={entry.id}
                      entry={entry}
                      expanded={!!expandedCards[entry.id]}
                      onToggle={() => toggleCard(entry.id)}
                      onDelete={handleDeleteEntry}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }) : (
          <HistoryEmptyState filtered={true} />
        )}
      </div>
    </div>
  );
});

export default HistoryTab;
