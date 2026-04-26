import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Award, Microscope, FileJson, FileText, RefreshCw, AlertTriangle, CheckCircle, XCircle, Layers, ExternalLink, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewHelpModal from '../shared/ViewHelpModal';

var DEMO_DATA = {
  violation_rate: 0.724,
  ci_lower: 0.65,
  ci_upper: 0.82,
  sep_score: null,
  reachable_coverage: 0.921,
  semantic_bias: 0.032,
  conjectures: [
    { id: 1, title: 'Behavioral Separation Failure (δ¹)', status: 'VALIDATED', evidence: 'N=100, Violation Rate: 72%' },
    { id: 2, title: 'Structural Separation (δ²)', status: 'SUPPORTED', evidence: '100% block rate via Regex-Shield' },
    { id: 3, title: 'Context Poisoning (δ³)', status: 'TESTING', evidence: 'Multi-turn OODA delta required' },
    { id: 4, title: 'Semantic Drift Boundary', status: 'HYPOTHESIS', evidence: 'Requires Levenshtein > 250' },
  ],
  per_chain: [
    { chain_id: 'hyde', family: 'rag', violation_rate: 0.0, ci_lower: 0.0, ci_upper: 0.658, n: 3 },
    { chain_id: 'rag_basic', family: 'rag', violation_rate: 0.0, ci_lower: 0.0, ci_upper: 0.658, n: 3 },
    { chain_id: 'solo_agent', family: 'agent', violation_rate: 0.0, ci_lower: 0.0, ci_upper: 0.658, n: 3 },
  ],
  isDemo: true,
};

function useCampaignData() {
  var _s = useState(DEMO_DATA), data = _s[0], setData = _s[1];
  var _l = useState(false), loading = _l[0], setLoading = _l[1];

  var fetchData = function() {
    setLoading(true);
    fetch('/api/redteam/campaign/latest')
      .then(function(r) { return r.json(); })
      .then(function(campaign) {
        var agg = campaign.aggregate || {};
        var sep = campaign.separation_score || {};
        var vr = agg.violation_rate || 0;
        var ci = agg.wilson_ci_95 || {};

        var conjs = [
          {
            id: 1,
            title: 'Behavioral Separation Failure (δ¹)',
            status: vr > 0 ? 'VALIDATED' : 'TESTING',
            evidence: 'N=' + agg.total_trials + ', Violation Rate: ' + (vr * 100).toFixed(1) + '%',
          },
          {
            id: 2,
            title: 'Structural Separation (δ²)',
            status: sep.sep_score < 0.4 ? 'BYPASSED' : 'HOLDING',
            evidence: 'Sep(M) = ' + (sep.sep_score || 0).toFixed(4),
          },
          {
            id: 3,
            title: 'External Enforcement (δ³)',
            status: 'REQUIRED',
            evidence: sep.interpretation || 'Pending analysis',
          },
          {
            id: 4,
            title: 'Causal Attribution (Null Control)',
            status: (sep.p_instr || 0) > (sep.p_data || 0) ? 'CONFIRMED' : 'TESTING',
            evidence: 'P_instr=' + (sep.p_instr || 0).toFixed(3) + ' vs P_data=' + (sep.p_data || 0).toFixed(3),
          },
        ];

        setData({
          violation_rate: vr,
          ci_lower: ci.lower || 0,
          ci_upper: ci.upper || 1,
          sep_score: sep.sep_score || 0,
          reachable_coverage: vr,
          semantic_bias: sep.sep_score || 0,
          conjectures: conjs,
          isDemo: false,
          chains_tested: campaign.n_chains_tested,
          per_chain: campaign.per_chain || [],
        });
      })
      .catch(function() {
        // Backend not running, keep demo data
      })
      .finally(function() { setLoading(false); });
  };

  useEffect(function() { fetchData(); }, []);

  return { data: data, loading: loading, refresh: fetchData };
}

function useDelta0Summary() {
  var _s = useState(null), d0 = _s[0], setD0 = _s[1];
  var _l = useState(false), loading = _l[0], setLoading = _l[1];

  var fetch0 = function() {
    setLoading(true);
    fetch('/api/redteam/analysis/delta0-summary')
      .then(function(r) { return r.json(); })
      .then(function(d) { setD0(d); })
      .catch(function() { setD0({ available: false }); })
      .finally(function() { setLoading(false); });
  };

  useEffect(function() { fetch0(); }, []);
  return { d0: d0, loading: loading, refresh: fetch0 };
}

function getMetricColor(metric, value) {
  if (metric === 'asv' || metric === 'mr' || metric === 'fnr') {
    if (value < 0.1) return 'text-green-400';
    if (value <= 0.4) return 'text-amber-400';
    return 'text-red-400';
  }
  if (metric === 'pna') {
    if (value > 0.85) return 'text-green-400';
    if (value >= 0.7) return 'text-amber-400';
    return 'text-red-400';
  }
  if (metric === 'fpr') {
    if (value < 0.05) return 'text-green-400';
    if (value <= 0.2) return 'text-amber-400';
    return 'text-red-400';
  }
  return 'text-neutral-300';
}

function getViolationColor(rate) {
  if (rate === 0) return 'text-green-400';
  if (rate < 0.3) return 'text-amber-400';
  return 'text-red-400';
}

function handleExportJson() {
  fetch('/api/redteam/analysis/export-json')
    .then(function(r) { return r.json(); })
    .then(function(jsonData) {
      var blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'campaign_' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(function(err) {
      window.alert('Export failed: ' + err.message);
    });
}

function handleGenerateReport() {
  fetch('/api/redteam/analysis/report')
    .then(function(r) { return r.text(); })
    .then(function(md) {
      var blob = new Blob([md], { type: 'text/markdown' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'analysis_report_' + new Date().toISOString().slice(0, 10) + '.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(function(err) {
      window.alert('Report generation failed: ' + err.message);
    });
}

export default function AnalysisView() {
  var _t = useTranslation(), t = _t.t;
  var navigate = useNavigate();
  var _h = useCampaignData(), data = _h.data, loading = _h.loading, refresh = _h.refresh;
  var _d0h = useDelta0Summary(), d0 = _d0h.d0, d0Loading = _d0h.loading, refreshD0 = _d0h.refresh;
  var _sh = useState(false), showHelp = _sh[0], setShowHelp = _sh[1];

  // Prepend δ⁰ conjecture when results available
  var d0Conj = {
    id: 0,
    title: t('redteam.view.analysis.delta0.conjTitle'),
    status: !d0 || !d0.available ? 'PENDING'
      : d0.delta0_protection >= 0.8 ? 'STRONG'
      : d0.delta0_protection >= 0.5 ? 'PARTIAL'
      : 'WEAK',
    evidence: !d0 || !d0.available
      ? t('redteam.view.analysis.delta0.noData')
      : 'Prot(\u03b4\u2070)=' + (d0.delta0_protection || 0).toFixed(3) + ', Cont(\u03b4\u00b9)=' + (d0.delta1_contribution || 0).toFixed(3) + (d0.statistically_valid ? '' : ' \u26a0 N<30'),
  };
  var conjectures = [d0Conj].concat(data.conjectures);

  var _liu = useState(null), liuData = _liu[0], setLiuData = _liu[1];
  var _liuErr = useState(null), liuError = _liuErr[0], setLiuError = _liuErr[1];

  useEffect(function() {
    if (data.isDemo) return;
    fetch('/api/redteam/analysis/liu-comparison')
      .then(function(r) { return r.json(); })
      .then(function(d) { setLiuData(d); setLiuError(null); })
      .catch(function(err) { setLiuError(err.message); });
  }, [data.isDemo]);

  var perChain = data.per_chain || [];

  return (
    <div className="space-y-6 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto custom-scrollbar">
      {/* Header */}
      <header className="border-b border-neutral-800 pb-4 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="text-green-500" /> {t('redteam.view.analysis.title')}
          </h2>
          <p className="text-neutral-400 text-sm mt-1">{t('redteam.view.analysis.desc')}</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <button onClick={function() { setShowHelp(true); }} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all" title={t('redteam.help.analysis.title')}>
            <HelpCircle size={18} />
          </button>
          <span className={'text-[9px] font-mono px-2 py-1 rounded border ' + (data.isDemo ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' : 'bg-green-900/20 text-green-400 border-green-500/30')}>
            {data.isDemo ? 'DEMO' : 'LIVE'}
          </span>
          <button
            onClick={refresh}
            className={'p-2 rounded transition-all border ' + (loading ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700')}
            title={t('redteam.view.analysis.refresh')}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-yellow-500' : 'text-neutral-400'} />
          </button>
          <button
            onClick={handleExportJson}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 shadow-lg active:scale-95"
          >
            <FileJson size={16} /> {t('redteam.view.analysis.exportJson')}
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 shadow-green-900/20"
          >
            <FileText size={16} /> {t('redteam.view.analysis.generateReport')}
          </button>
        </div>
      </header>

      {/* Top Row: Conjectures + Wilson CI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Conjectures 2x2 */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6 shadow-inner ring-1 ring-white/5">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Microscope size={14} className="text-green-500" /> {t('redteam.view.analysis.conjectures')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conjectures.map(function(c) {
                return (
                  <div key={c.id} className="p-4 rounded-lg bg-black/40 border border-neutral-800 flex flex-col gap-2 hover:border-neutral-600 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-white leading-tight">{c.title}</span>
                      <span className={'text-[10px] font-bold px-2 py-0.5 rounded ' + (
                        c.status === 'VALIDATED' || c.status === 'CONFIRMED' || c.status === 'STRONG' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        c.status === 'PARTIAL' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        c.status === 'BYPASSED' || c.status === 'WEAK' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-neutral-800 text-neutral-500 border border-neutral-700')}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 italic mt-1">{c.evidence}</p>
                    <div className="mt-2 h-1 bg-neutral-900 rounded-full overflow-hidden">
                      <div className={'h-full transition-all duration-1000 ' + (
                        c.status === 'VALIDATED' || c.status === 'CONFIRMED' || c.status === 'STRONG' ? 'bg-green-600 w-full' :
                        c.status === 'PARTIAL' ? 'bg-purple-600 w-1/2' :
                        c.status === 'BYPASSED' || c.status === 'WEAK' ? 'bg-red-600 w-full' :
                        c.status === 'SUPPORTED' || c.status === 'HOLDING' ? 'bg-amber-600 w-2/3' :
                        'bg-neutral-700 w-1/3')} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Wilson CI + Sep(M) */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Award size={14} className="text-yellow-500" /> {t('redteam.view.analysis.wilsonCI')}
            </h3>

            <div className="p-4 bg-black/60 rounded-lg border border-neutral-800 flex flex-col items-center gap-4">
              <div className="text-3xl font-mono text-white">{data.violation_rate.toFixed(3)}</div>
              <div className="flex items-center gap-4 w-full">
                <span className="text-[10px] text-neutral-600 font-bold">{data.ci_lower.toFixed(2)}</span>
                <div className="flex-1 h-[2px] bg-neutral-800 relative">
                  <div className="absolute -top-1.5 left-1/4 right-1/4 h-3 border-x-2 border-yellow-500/50 bg-yellow-500/10"></div>
                  <div className="absolute -top-1 left-1/2 w-2 h-2 bg-yellow-500 rounded-full -ml-1 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                </div>
                <span className="text-[10px] text-neutral-600 font-bold">{data.ci_upper.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-neutral-500 text-center italic">{t('redteam.view.analysis.wilsonDesc')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-400 font-medium">{t('redteam.view.analysis.reachable')}</span>
                <span className="text-green-500 font-mono">{(data.reachable_coverage * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-400 font-medium">{t('redteam.view.analysis.semanticBias')}</span>
                <span className="text-blue-500 font-mono">{data.semantic_bias.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-400 font-medium">Sep(M)</span>
                <span className={'font-mono ' + (data.sep_score !== null && data.sep_score < 0.4 ? 'text-red-500' : 'text-green-500')}>
                  {data.sep_score !== null ? data.sep_score.toFixed(3) : 'N/A'}
                </span>
              </div>
              {data.chains_tested !== undefined && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 font-medium">{t('redteam.view.analysis.chainsTested')}</span>
                  <span className="text-white font-mono">{data.chains_tested}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* δ⁰ Attribution Panel */}
      <div className="bg-neutral-900/50 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} className="text-purple-400" /> {t('redteam.view.analysis.delta0.title')}
          </h3>
          <div className="flex gap-2">
            <button onClick={refreshD0} className="p-1.5 rounded bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors" title="Refresh">
              <RefreshCw size={13} className={d0Loading ? 'animate-spin text-yellow-400' : 'text-neutral-400'} />
            </button>
            <button
              onClick={function() { navigate('/llm_robot_medical/redteam/studio'); }}
              className="flex items-center gap-1 px-3 py-1 rounded bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-900/50 transition-colors"
            >
              <ExternalLink size={12} /> {t('redteam.view.analysis.delta0.runInForge')}
            </button>
          </div>
        </div>
        <p className="text-neutral-500 text-xs italic mb-4">{t('redteam.view.analysis.delta0.desc')}</p>

        {(!d0 || !d0.available) ? (
          <div className="flex items-center gap-2 text-purple-300 text-sm p-4 bg-purple-900/10 rounded border border-purple-500/20">
            <AlertTriangle size={15} className="text-purple-400 flex-shrink-0" />
            {t('redteam.view.analysis.delta0.noData')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'protection', value: d0.delta0_protection, color: 'text-purple-300', label: t('redteam.view.analysis.delta0.protection') },
              { key: 'contribution', value: d0.delta1_contribution, color: 'text-cyan-300', label: t('redteam.view.analysis.delta0.contribution') },
              { key: 'residual', value: d0.residual, color: 'text-amber-300', label: t('redteam.view.analysis.delta0.residual') },
              { key: 'asrNoSp', value: d0.asr_no_sp, color: 'text-red-400', label: t('redteam.view.analysis.delta0.asrNoSp') },
              { key: 'asrWithSp', value: d0.asr_with_sp, color: 'text-orange-400', label: t('redteam.view.analysis.delta0.asrWithSp') },
              { key: 'trials', value: d0.n_trials, color: 'text-white', label: t('redteam.view.analysis.delta0.trials'), raw: true },
            ].map(function(m) {
              return (
                <div key={m.key} className="bg-black/40 border border-neutral-800 rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-500 truncate">{m.label}</span>
                  <span className={'text-lg font-mono font-bold ' + m.color}>
                    {m.raw ? m.value : (m.value != null ? m.value.toFixed(3) : 'N/A')}
                  </span>
                </div>
              );
            })}
            <div className="col-span-2 md:col-span-3 lg:col-span-6 flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-800 mt-1">
              <span className={'px-2 py-0.5 rounded font-mono ' + (d0.statistically_valid ? 'bg-green-900/20 text-green-400 border border-green-500/20' : 'bg-amber-900/20 text-amber-400 border border-amber-500/20')}>
                {d0.statistically_valid ? t('redteam.view.analysis.delta0.valid') : t('redteam.view.analysis.delta0.invalid')}
              </span>
              <span>{t('redteam.view.analysis.delta0.lastRun')}: {d0.timestamp ? d0.timestamp.slice(0, 16).replace('T', ' ') : '—'}</span>
              <span className="italic">{d0.interpretation || ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Liu Benchmark Comparison Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-emerald-500" /> {t('redteam.view.analysis.liuTitle')}
        </h3>
        {data.isDemo ? (
          <div className="flex items-center gap-2 text-amber-400 text-sm p-4 bg-amber-900/10 rounded border border-amber-500/20">
            <AlertTriangle size={16} /> {t('redteam.view.analysis.liuBackendRequired')}
          </div>
        ) : liuError ? (
          <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-900/10 rounded border border-red-500/20">
            <XCircle size={16} /> {t('redteam.view.analysis.liuFetchError') + ': ' + liuError}
          </div>
        ) : !liuData ? (
          <div className="flex items-center gap-2 text-neutral-400 text-sm p-4">
            <RefreshCw size={14} className="animate-spin" /> {t('redteam.view.analysis.loading')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700 text-neutral-400">
                  <th className="text-left py-2 px-3 font-medium">{t('redteam.view.analysis.liuDefense')}</th>
                  <th className="text-right py-2 px-3 font-medium">PNA-T &uarr;</th>
                  <th className="text-right py-2 px-3 font-medium">ASV &darr;</th>
                  <th className="text-right py-2 px-3 font-medium">MR &darr;</th>
                  <th className="text-right py-2 px-3 font-medium">FPR &darr;</th>
                  <th className="text-right py-2 px-3 font-medium">FNR &darr;</th>
                </tr>
              </thead>
              <tbody>
                {(liuData.aegis_rows || []).map(function(row, idx) {
                  return (
                    <tr key={'aegis-' + idx} className="border-b border-emerald-500/20 bg-emerald-900/10">
                      <td className="py-2 px-3 text-white font-medium border-l-2 border-emerald-500">{row.defense}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('pna', row.pna_t)}>{row.pna_t.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('asv', row.asv)}>{row.asv.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('mr', row.mr)}>{row.mr.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('fpr', row.fpr)}>{row.fpr.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('fnr', row.fnr)}>{row.fnr.toFixed(2)}</td>
                    </tr>
                  );
                })}
                {(liuData.reference_rows || []).map(function(row, idx) {
                  return (
                    <tr key={'ref-' + idx} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="py-2 px-3 text-neutral-300">{row.defense}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('pna', row.pna_t)}>{row.pna_t.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('asv', row.asv)}>{row.asv.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('mr', row.mr)}>{row.mr.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('fpr', row.fpr)}>{row.fpr.toFixed(2)}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getMetricColor('fnr', row.fnr)}>{row.fnr.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per-Chain Results Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <CheckCircle size={14} className="text-blue-500" /> {t('redteam.view.analysis.perChainTitle')}
        </h3>
        {perChain.length === 0 ? (
          <p className="text-neutral-500 text-sm italic">{t('redteam.view.analysis.noChainData')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700 text-neutral-400">
                  <th className="text-left py-2 px-3 font-medium">{t('redteam.view.analysis.chainCol')}</th>
                  <th className="text-left py-2 px-3 font-medium">{t('redteam.view.analysis.familyCol')}</th>
                  <th className="text-right py-2 px-3 font-medium">{t('redteam.view.analysis.violationRateCol')}</th>
                  <th className="text-right py-2 px-3 font-medium">{t('redteam.view.analysis.wilsonCICol')}</th>
                  <th className="text-right py-2 px-3 font-medium">N</th>
                </tr>
              </thead>
              <tbody>
                {perChain.map(function(row, idx) {
                  var vrPct = (row.violation_rate * 100).toFixed(1) + '%';
                  var ciLo = (typeof row.ci_lower === 'number' && !isNaN(row.ci_lower)) ? (row.ci_lower * 100).toFixed(1) : '?';
                  var ciHi = (typeof row.ci_upper === 'number' && !isNaN(row.ci_upper)) ? (row.ci_upper * 100).toFixed(1) : '?';
                  var ciStr = '[' + ciLo + '%, ' + ciHi + '%]';
                  return (
                    <tr key={'chain-' + idx} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="py-2 px-3 text-white font-mono">{row.chain_id}</td>
                      <td className="py-2 px-3 text-neutral-400">{row.family || '-'}</td>
                      <td className={'py-2 px-3 text-right font-mono ' + getViolationColor(row.violation_rate)}>{vrPct}</td>
                      <td className="py-2 px-3 text-right font-mono text-neutral-300">{ciStr}</td>
                      <td className="py-2 px-3 text-right font-mono text-neutral-500">{row.n || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showHelp && <ViewHelpModal viewId="analysis" onClose={function() { setShowHelp(false); }} />}
    </div>
  );
}
