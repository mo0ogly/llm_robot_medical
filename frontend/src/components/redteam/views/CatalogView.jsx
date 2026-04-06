import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Play, ExternalLink, Search, ChevronDown, ChevronUp, Filter, X, HelpCircle } from 'lucide-react';
import TaxonomyCoverageCard from '../shared/TaxonomyCoverageCard';
import ViewHelpModal from '../shared/ViewHelpModal';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

var CAT_STYLE = {
  injection:    { label: 'INJ',     cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  rule_bypass:  { label: 'BYPASS',  cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  prompt_leak:  { label: 'LEAK',    cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
};

var DELTA_STYLE = {
  delta0: { label: 'δ⁰', cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  delta1: { label: 'δ¹', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  delta2: { label: 'δ²', cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  delta3: { label: 'δ³', cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
};

function Badge({ label, cls }) {
  return (
    <span className={'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ' + cls}>
      {label}
    </span>
  );
}

function TemplateCard({ tpl, onOpenForge, onLaunch, launching }) {
  var cat = CAT_STYLE[tpl.category] || { label: tpl.category, cls: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
  var delta = DELTA_STYLE[tpl.target_delta] || { label: tpl.target_delta || '—', cls: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
  var taxPrimary = tpl.taxonomy && tpl.taxonomy.primary
    ? tpl.taxonomy.primary.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); })
    : null;

  return (
    <div className="group relative flex flex-col gap-2 p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-600 hover:bg-neutral-900 transition-all cursor-pointer"
         onClick={function() { onOpenForge(tpl); }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-neutral-100 leading-snug flex-1 min-w-0 pr-1">
          {tpl.name}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <Badge label={cat.label} cls={cat.cls} />
          <Badge label={delta.label} cls={delta.cls} />
        </div>
      </div>

      {/* Taxonomy primary */}
      {taxPrimary && (
        <span className="text-[9px] text-neutral-500 font-mono truncate" title={taxPrimary}>
          {taxPrimary}
        </span>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          {tpl.conjecture && (
            <span className="text-[9px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              {tpl.conjecture}
            </span>
          )}
          {tpl.chain_id && (
            <span className="text-[9px] font-mono text-teal-400/80 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 truncate max-w-[100px]" title={tpl.chain_id}>
              {tpl.chain_id}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            title="Open in Forge"
            onClick={function(e) { e.stopPropagation(); onOpenForge(tpl); }}
            className="p-1 rounded hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={11} />
          </button>
          <button
            title="Launch directly"
            onClick={function(e) { e.stopPropagation(); onLaunch(tpl); }}
            disabled={!!launching}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-40 transition-colors border border-red-500/30"
          >
            {launching === tpl.id ? '...' : <><Play size={9} /> RUN</>}
          </button>
        </div>
      </div>
    </div>
  );
}

var FILTERS = ['ALL', 'injection', 'rule_bypass', 'prompt_leak', 'delta0', 'delta1', 'delta2', 'delta3', 'C1', 'C2', 'C3'];

export default function CatalogView() {
  var { t } = useNavigate ? useTranslation() : { t: function(k) { return k; } };
  var { t: tt } = useTranslation();
  var navigate = useNavigate();

  var [templates, setTemplates] = useState([]);
  var [loading, setLoading] = useState(true);
  var [offline, setOffline] = useState(false);
  var [search, setSearch] = useState('');
  var [activeFilter, setActiveFilter] = useState('ALL');
  var [launching, setLaunching] = useState(null);
  var [launchResult, setLaunchResult] = useState({});
  var [showTaxo, setShowTaxo] = useState(false);
  var [showHelp, setShowHelp] = useState(false);

  var { data: _tplData, error: tplError } = useFetchWithCache('/api/redteam/templates');
  useEffect(function() {
    if (_tplData) { setTemplates(_tplData); setLoading(false); }
    if (tplError) { setOffline(true); setLoading(false); }
  }, [_tplData, tplError]);

  var filtered = useMemo(function() {
    var q = search.trim().toLowerCase();
    return templates.filter(function(tpl) {
      var matchSearch = !q ||
        tpl.name.toLowerCase().includes(q) ||
        (tpl.id && tpl.id.toLowerCase().includes(q)) ||
        (tpl.conjecture && tpl.conjecture.toLowerCase().includes(q)) ||
        (tpl.taxonomy && tpl.taxonomy.primary && tpl.taxonomy.primary.includes(q));

      var matchFilter = activeFilter === 'ALL' ||
        tpl.category === activeFilter ||
        tpl.target_delta === activeFilter ||
        tpl.conjecture === activeFilter;

      return matchSearch && matchFilter;
    });
  }, [templates, search, activeFilter]);

  function openForge(tpl) {
    navigate('/llm_robot_medical/redteam/studio', {
      state: { templateId: tpl.id, templateName: tpl.name, category: tpl.category }
    });
  }

  async function launchDirect(tpl) {
    setLaunching(tpl.id);
    setLaunchResult(function(prev) { return Object.assign({}, prev, { [tpl.id]: null }); });
    try {
      var res = await fetch('/api/redteam/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: tpl.category, attack_message: tpl.id, levels: ['delta1'], provider: 'ollama' })
      });
      var data = await res.json();
      setLaunchResult(function(prev) {
        return Object.assign({}, prev, { [tpl.id]: data.violated ? 'VIOLATED' : 'BLOCKED' });
      });
    } catch(_) {
      setLaunchResult(function(prev) { return Object.assign({}, prev, { [tpl.id]: 'ERR' }); });
    }
    setLaunching(null);
  }

  var byDelta = { delta0: 0, delta1: 0, delta2: 0, delta3: 0 };
  templates.forEach(function(t) { if (t.target_delta && byDelta[t.target_delta] !== undefined) byDelta[t.target_delta]++; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-100">{tt('redteam.view.catalog.title')}</h1>
          <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded border border-neutral-700">
            {templates.length} {tt('redteam.catalog.templates_count')}
          </span>
        </div>
        <button onClick={function() { setShowHelp(true); }} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all" title={tt('redteam.help.catalog.title')}>
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Stats bar */}
      {!loading && !offline && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
          {Object.entries(byDelta).map(function([d, n]) {
            var style = DELTA_STYLE[d] || {};
            return n > 0 ? (
              <div key={d} className="flex items-center gap-1.5">
                <span className={'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ' + style.cls}>{style.label}</span>
                <span className="text-xs text-neutral-400 font-mono">{n}</span>
              </div>
            ) : null;
          })}
          <div className="w-px h-4 bg-neutral-700" />
          <button
            onClick={function() { setShowTaxo(function(v) { return !v; }); }}
            className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors font-mono"
          >
            <Filter size={10} />
            {showTaxo ? tt('redteam.catalog.hide_taxo') : tt('redteam.catalog.show_taxo')}
            {showTaxo ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
        </div>
      )}

      {/* Taxonomy coverage (collapsible) */}
      {showTaxo && <TaxonomyCoverageCard />}

      {/* Search + filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={function(e) { setSearch(e.target.value); }}
            placeholder={tt('redteam.catalog.search_placeholder')}
            className="w-full pl-7 pr-7 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
          />
          {search && (
            <button onClick={function() { setSearch(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
              <X size={11} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {FILTERS.map(function(f) {
            var active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={function() { setActiveFilter(f); }}
                className={'px-2 py-1 text-[9px] font-mono font-bold rounded border transition-colors ' +
                  (active
                    ? 'bg-neutral-100 text-neutral-900 border-neutral-100'
                    : 'bg-transparent text-neutral-500 border-neutral-700 hover:border-neutral-500 hover:text-neutral-300')}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="text-[10px] text-neutral-600 font-mono">
          {filtered.length} / {templates.length} {tt('redteam.catalog.results_label')}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="text-xs text-neutral-500 font-mono py-8 text-center animate-pulse">
          {tt('redteam.catalog.loading')}
        </div>
      )}
      {offline && (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 text-sm text-red-400 font-mono">
          {tt('redteam.catalog.offline.title')} — {tt('redteam.catalog.offline.desc')}
        </div>
      )}

      {/* Card grid */}
      {!loading && !offline && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map(function(tpl) {
            return (
              <div key={tpl.id} className="relative">
                <TemplateCard
                  tpl={tpl}
                  onOpenForge={openForge}
                  onLaunch={launchDirect}
                  launching={launching}
                />
                {launchResult[tpl.id] && (
                  <span className={
                    'absolute top-2 right-2 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ' +
                    (launchResult[tpl.id] === 'VIOLATED'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : launchResult[tpl.id] === 'BLOCKED'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-neutral-800 text-neutral-500 border-neutral-700')
                  }>
                    {launchResult[tpl.id]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !offline && filtered.length === 0 && (
        <div className="py-8 text-center text-xs text-neutral-600 font-mono">
          {tt('redteam.catalog.no_results')}
        </div>
      )}

      {showHelp && <ViewHelpModal viewId="catalog" onClose={function() { setShowHelp(false); }} />}
    </div>
  );
}
