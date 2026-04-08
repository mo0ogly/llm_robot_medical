import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Beaker, RefreshCw, FileJson, FileText, AlertTriangle,
  Play, ArrowUpCircle, Download, HelpCircle, Search
} from 'lucide-react';
import VerdictMatrix from '../shared/VerdictMatrix';
import IterationTimeline from '../shared/IterationTimeline';
import ViewHelpModal from '../shared/ViewHelpModal';

var STATUS_STYLES = {
  DONE:         'bg-green-900/20 text-green-400 border-green-500/30',
  RUNNING:      'bg-blue-900/20 text-blue-400 border-blue-500/30',
  INCONCLUSIVE: 'bg-orange-900/20 text-orange-400 border-orange-500/30',
  PLANNED:      'bg-neutral-800 text-neutral-500 border-neutral-700',
  REFUTED:      'bg-red-900/20 text-red-400 border-red-500/30',
  SUPPORTED:    'bg-green-900/20 text-green-400 border-green-500/30',
};

function getStatusCls(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.PLANNED;
}

function useManifest() {
  var _d = useState([]), campaigns = _d[0], setCampaigns = _d[1];
  var _l = useState(false), loading = _l[0], setLoading = _l[1];
  var _e = useState(null), error = _e[0], setError = _e[1];

  var fetchManifest = function() {
    setLoading(true);
    setError(null);
    fetch('/api/redteam/experiments/manifest')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  };

  useEffect(function() { fetchManifest(); }, []);

  return { campaigns: campaigns, loading: loading, error: error, refresh: fetchManifest };
}

function useLineage(campaignId) {
  var _d = useState(null), lineage = _d[0], setLineage = _d[1];
  var _l = useState(false), loading = _l[0], setLoading = _l[1];
  var _e = useState(null), error = _e[0], setError = _e[1];

  useEffect(function() {
    if (!campaignId) { setLineage(null); return; }
    setLoading(true);
    setError(null);
    fetch('/api/redteam/experiments/' + encodeURIComponent(campaignId) + '/lineage')
      .then(function(r) { return r.json(); })
      .then(function(data) { setLineage(data); })
      .catch(function(err) { setError(err.message); setLineage(null); })
      .finally(function() { setLoading(false); });
  }, [campaignId]);

  return { lineage: lineage, loading: loading, error: error };
}

function handleExportLineage(lineage, campaignId) {
  if (!lineage) return;
  var blob = new Blob([JSON.stringify(lineage, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'lineage_' + (campaignId || 'export') + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleExportReport(campaignId) {
  fetch('/api/redteam/experiments/' + encodeURIComponent(campaignId) + '/report')
    .then(function(r) { return r.text(); })
    .then(function(md) {
      var blob = new Blob([md], { type: 'text/markdown' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'report_' + (campaignId || 'export') + '.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(function(err) {
      window.alert('Report export failed: ' + err.message);
    });
}

export default function ExperimentDashboard() {
  var _t = useTranslation(), t = _t.t;
  var manifest = useManifest();
  var _sel = useState(null), selectedId = _sel[0], setSelectedId = _sel[1];
  var _iter = useState(0), selectedIter = _iter[0], setSelectedIter = _iter[1];
  var _search = useState(''), search = _search[0], setSearch = _search[1];
  var _help = useState(false), showHelp = _help[0], setShowHelp = _help[1];

  var lineageHook = useLineage(selectedId);
  var lineage = lineageHook.lineage;
  var lineageLoading = lineageHook.loading;
  var lineageError = lineageHook.error;

  var filteredCampaigns = manifest.campaigns.filter(function(c) {
    if (!search) return true;
    var q = search.toLowerCase();
    return (c.campaign_id || '').toLowerCase().indexOf(q) !== -1 ||
           (c.gap || '').toLowerCase().indexOf(q) !== -1 ||
           (c.conjecture || '').toLowerCase().indexOf(q) !== -1;
  });

  // Select first campaign if none selected
  useEffect(function() {
    if (!selectedId && manifest.campaigns.length > 0) {
      setSelectedId(manifest.campaigns[0].campaign_id);
    }
  }, [manifest.campaigns]);

  // Derive current iteration data
  var iterations = (lineage && lineage.iterations) ? lineage.iterations : [];
  var currentIter = iterations[selectedIter] || null;

  // Cross-model comparison: gather unique models
  var modelMap = {};
  iterations.forEach(function(iter) {
    if (iter.model && iter.verdict) {
      if (!modelMap[iter.model]) {
        modelMap[iter.model] = { model: iter.model, asr: null, verdict: null, n: null };
      }
      modelMap[iter.model].verdict = iter.verdict;
      if (iter.asr != null) modelMap[iter.model].asr = iter.asr;
      if (iter.n != null) modelMap[iter.model].n = iter.n;
    }
  });
  var modelList = Object.keys(modelMap).map(function(k) { return modelMap[k]; });
  var showCrossModel = modelList.length > 1;

  // Per-chain results from current iteration
  var perChain = (currentIter && currentIter.per_chain) ? currentIter.per_chain : [];

  // Recommendations from lineage
  var recommendations = (lineage && lineage.recommendations) ? lineage.recommendations : [];

  // Selected campaign metadata
  var selectedCampaign = manifest.campaigns.find(function(c) { return c.campaign_id === selectedId; }) || null;

  return (
    <div className="flex h-full bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-black/30 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
              <Beaker size={12} className="text-cyan-500" />
              {t('redteam.experiment.campaigns')}
            </h3>
            <button
              onClick={manifest.refresh}
              className="p-1 text-neutral-600 hover:text-neutral-300 transition-colors"
              title={t('redteam.experiment.refresh')}
            >
              <RefreshCw size={12} className={manifest.loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-600" size={12} />
            <input
              value={search}
              onChange={function(e) { setSearch(e.target.value); }}
              placeholder={t('redteam.experiment.searchCampaigns')}
              className="w-full bg-neutral-900 border border-neutral-800 rounded py-1.5 pl-7 pr-2 text-[10px] font-mono focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-neutral-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {manifest.loading && manifest.campaigns.length === 0 ? (
            <div className="flex items-center justify-center h-32 opacity-40">
              <RefreshCw size={16} className="animate-spin text-cyan-500" />
            </div>
          ) : manifest.error ? (
            <div className="p-3 text-red-400 text-[10px] flex items-center gap-1.5">
              <AlertTriangle size={12} /> {manifest.error}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-4 text-center text-neutral-600 text-[10px] font-mono uppercase">
              {t('redteam.experiment.noCampaigns')}
            </div>
          ) : (
            <div className="py-1">
              {filteredCampaigns.map(function(c) {
                var isActive = selectedId === c.campaign_id;
                var statusCls = getStatusCls(c.status);
                return (
                  <button
                    key={c.campaign_id}
                    onClick={function() { setSelectedId(c.campaign_id); setSelectedIter(0); }}
                    className={'w-full text-left px-3 py-2.5 transition-all ' +
                      (isActive
                        ? 'bg-cyan-500/10 border-r-2 border-cyan-500'
                        : 'hover:bg-white/5')}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={'text-[10px] font-bold truncate ' + (isActive ? 'text-white' : 'text-neutral-400')}>
                        {c.campaign_id}
                      </span>
                      <span className={'text-[8px] font-bold px-1.5 py-0.5 rounded border ' + statusCls}>
                        {c.status || 'PLANNED'}
                      </span>
                    </div>
                    {c.gap && (
                      <span className="text-[9px] text-neutral-600 font-mono block mt-0.5 truncate">
                        {c.gap}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {!selectedId ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600">
            <Beaker size={48} className="opacity-20 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500">
              {t('redteam.experiment.selectCampaign')}
            </p>
          </div>
        ) : lineageLoading ? (
          <div className="flex items-center justify-center h-48">
            <RefreshCw size={24} className="animate-spin text-cyan-500" />
          </div>
        ) : lineageError ? (
          <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-900/10 rounded border border-red-500/20">
            <AlertTriangle size={16} /> {lineageError}
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="border-b border-neutral-800 pb-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Beaker className="text-cyan-500" size={22} />
                    {selectedId}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {selectedCampaign && selectedCampaign.gap && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/20 text-amber-400 border border-amber-500/30">
                        {selectedCampaign.gap}
                      </span>
                    )}
                    {selectedCampaign && selectedCampaign.conjecture && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/20 text-purple-400 border border-purple-500/30">
                        {selectedCampaign.conjecture}
                      </span>
                    )}
                    {selectedCampaign && selectedCampaign.status && (
                      <span className={'text-[10px] font-bold px-2 py-0.5 rounded border ' + getStatusCls(selectedCampaign.status)}>
                        {selectedCampaign.status}
                      </span>
                    )}
                  </div>
                  {lineage && lineage.hypothesis && (
                    <p className="text-sm text-neutral-400 mt-2 italic max-w-2xl">
                      {lineage.hypothesis}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={function() { setShowHelp(true); }}
                    className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
                    title={t('redteam.experiment.help')}
                  >
                    <HelpCircle size={18} />
                  </button>
                </div>
              </div>
            </header>

            {/* Iteration Timeline */}
            <IterationTimeline
              iterations={iterations}
              onSelectIteration={function(idx) { setSelectedIter(idx); }}
            />

            {/* Verdict Matrix for selected iteration */}
            {currentIter && currentIter.criteria && currentIter.results && (
              <VerdictMatrix
                criteria={currentIter.criteria}
                results={currentIter.results}
              />
            )}

            {/* Per-chain results */}
            {perChain.length > 0 && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                  {t('redteam.experiment.perChainResults')}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-700 text-neutral-400">
                        <th className="text-left py-2 px-3 font-medium">{t('redteam.experiment.chainId')}</th>
                        <th className="text-right py-2 px-3 font-medium">ASR</th>
                        <th className="text-right py-2 px-3 font-medium">CI 95%</th>
                        <th className="text-right py-2 px-3 font-medium">N</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perChain.map(function(row, idx) {
                        var asrPct = row.asr != null ? (row.asr * 100).toFixed(1) + '%' : 'N/A';
                        var ciStr = row.ci ? ('[' + (row.ci[0] * 100).toFixed(1) + '%, ' + (row.ci[1] * 100).toFixed(1) + '%]') : '-';
                        var asrColor = row.asr == null ? 'text-neutral-500'
                          : row.asr === 0 ? 'text-green-400'
                          : row.asr < 0.3 ? 'text-amber-400'
                          : 'text-red-400';
                        return (
                          <tr key={idx} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                            <td className="py-2 px-3 text-white font-mono">{row.chain_id}</td>
                            <td className={'py-2 px-3 text-right font-mono ' + asrColor}>{asrPct}</td>
                            <td className="py-2 px-3 text-right font-mono text-neutral-300">{ciStr}</td>
                            <td className="py-2 px-3 text-right font-mono text-neutral-500">{row.n || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Cross-model comparison */}
            {showCrossModel && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                  {t('redteam.experiment.crossModelComparison')}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-700 text-neutral-400">
                        <th className="text-left py-2 px-3 font-medium">{t('redteam.experiment.model')}</th>
                        <th className="text-right py-2 px-3 font-medium">ASR</th>
                        <th className="text-right py-2 px-3 font-medium">N</th>
                        <th className="text-center py-2 px-3 font-medium">{t('redteam.experiment.verdict')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelList.map(function(m, idx) {
                        var verdictCls = getStatusCls(m.verdict);
                        return (
                          <tr key={idx} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                            <td className="py-2 px-3 text-white font-mono">{m.model}</td>
                            <td className="py-2 px-3 text-right font-mono text-neutral-300">
                              {m.asr != null ? (m.asr * 100).toFixed(1) + '%' : '-'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-neutral-500">{m.n || '-'}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={'text-[10px] font-bold px-2 py-0.5 rounded border ' + verdictCls}>
                                {m.verdict}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions panel */}
            {recommendations.length > 0 && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                  {t('redteam.experiment.recommendations')}
                </h4>
                <div className="space-y-2">
                  {recommendations.map(function(rec, idx) {
                    return (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-black/30 rounded border border-neutral-800">
                        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                        <span className="text-xs text-neutral-300 flex-1">{rec.text || rec}</span>
                        {rec.action === 'rerun' && (
                          <button className="flex items-center gap-1 px-2 py-1 rounded bg-blue-900/30 border border-blue-500/30 text-blue-300 text-[10px] font-bold hover:bg-blue-900/50 transition-colors">
                            <Play size={10} /> {t('redteam.experiment.rerun')}
                          </button>
                        )}
                        {rec.action === 'escalate' && (
                          <button className="flex items-center gap-1 px-2 py-1 rounded bg-red-900/30 border border-red-500/30 text-red-300 text-[10px] font-bold hover:bg-red-900/50 transition-colors">
                            <ArrowUpCircle size={10} /> {t('redteam.experiment.escalate')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Export buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={function() { handleExportLineage(lineage, selectedId); }}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 shadow-lg active:scale-95"
              >
                <FileJson size={16} /> {t('redteam.experiment.exportLineage')}
              </button>
              <button
                onClick={function() { handleExportReport(selectedId); }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 shadow-cyan-900/20"
              >
                <FileText size={16} /> {t('redteam.experiment.exportReport')}
              </button>
            </div>
          </>
        )}
      </main>
      {showHelp && <ViewHelpModal viewId="experiments" onClose={function() { setShowHelp(false); }} />}
    </div>
  );
}
