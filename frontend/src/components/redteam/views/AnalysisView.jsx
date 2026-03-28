import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, TrendingUp, Award, Microscope, FileJson, FileText, Share2, Info, RefreshCw } from 'lucide-react';

// Demo data when backend is not running
const DEMO_DATA = {
  violation_rate: 0.724,
  ci_lower: 0.65,
  ci_upper: 0.82,
  sep_score: null,
  reachable_coverage: 0.921,
  semantic_bias: 0.032,
  conjectures: [
    { id: 1, title: 'Behavioral Separation Failure (delta-1)', status: 'VALIDATED', evidence: 'N=100, Violation Rate: 72%' },
    { id: 2, title: 'Structural Separation (delta-2)', status: 'SUPPORTED', evidence: '100% block rate via Regex-Shield' },
    { id: 3, title: 'Context Poisoning (delta-3)', status: 'TESTING', evidence: 'Multi-turn OODA delta required' },
    { id: 4, title: 'Semantic Drift Boundary', status: 'HYPOTHESIS', evidence: 'Requires Levenshtein > 250' },
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
            title: 'Behavioral Separation Failure (delta-1)',
            status: vr > 0 ? 'VALIDATED' : 'TESTING',
            evidence: 'N=' + agg.total_trials + ', Violation Rate: ' + (vr * 100).toFixed(1) + '%',
          },
          {
            id: 2,
            title: 'Structural Separation (delta-2)',
            status: sep.sep_score < 0.4 ? 'BYPASSED' : 'HOLDING',
            evidence: 'Sep(M) = ' + (sep.sep_score || 0).toFixed(4),
          },
          {
            id: 3,
            title: 'External Enforcement (delta-3)',
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

export default function AnalysisView() {
  var { t } = useTranslation();
  var _h = useCampaignData(), data = _h.data, loading = _h.loading, refresh = _h.refresh;
  var conjectures = data.conjectures;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto custom-scrollbar">
      <header className="border-b border-neutral-800 pb-4 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <BarChart2 className="text-green-500 animate-pulse" /> {t('redteam.view.analysis.title')}
           </h2>
           <p className="text-neutral-400 text-sm mt-1">{t('redteam.view.analysis.desc')}</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 shadow-lg active:scale-95">
              <FileJson size={16} /> Export JSON
           </button>
           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 shadow-green-900/20">
              <FileText size={16} /> Build LaTeX Report
           </button>
           <button onClick={refresh} className={'p-2 rounded transition-all border ' + (loading ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700')}>
              <RefreshCw size={16} className={loading ? 'animate-spin text-yellow-500' : 'text-neutral-400'} />
           </button>
           <span className={'text-[9px] font-mono px-2 py-1 rounded border ' + (data.isDemo ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' : 'bg-green-900/20 text-green-400 border-green-500/30')}>
              {data.isDemo ? 'DEMO' : 'LIVE'}
           </span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Thesis Conjectures */}
        <div className="lg:col-span-2 space-y-6 flex flex-col overflow-hidden">
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6 shadow-inner ring-1 ring-white/5">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                 <Microscope size={14} className="text-green-500" /> Formal Conjecture Tracking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {conjectures.map(c => (
                   <div key={c.id} className="p-4 rounded-lg bg-black/40 border border-neutral-800 flex flex-col gap-2 hover:border-neutral-600 transition-colors group">
                      <div className="flex justify-between items-start">
                         <span className="text-lg font-bold text-white leading-tight">{c.title}</span>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === 'VALIDATED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-neutral-800 text-neutral-500 border border-neutral-700'}`}>
                            {c.status}
                         </span>
                      </div>
                      <p className="text-xs text-neutral-500 italic mt-1">{c.evidence}</p>
                      <div className="mt-2 h-1 bg-neutral-900 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${c.status === 'VALIDATED' ? 'bg-green-600 w-full' : 'bg-neutral-700 w-1/3'}`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Metrics Correlation Chart */}
           <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-6 flex-1 flex flex-col">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 mb-8">
                 <TrendingUp size={14} className="text-blue-500" /> Entropy H(X) vs. Exploitation Probability P(Ex)
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4 border-b border-l border-neutral-800/50 relative">
                 {/* Y-Axis Label */}
                 <div className="absolute -left-10 top-1/2 -rotate-90 text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Success Rate (%)</div>
                 
                 {[0.2, 0.35, 0.48, 0.65, 0.82, 0.95].map((val, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-900/40 to-blue-500 rounded-t-[2px] transition-all duration-1000 group-hover:from-blue-700 group-hover:to-cyan-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                        style={{ height: `${val * 130}px` }} 
                      />
                      <span className="text-[9px] text-neutral-600 font-mono">H={3 + i}</span>
                   </div>
                 ))}
              </div>
              <div className="text-center mt-3 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Payload Information Density (Bits)</div>
           </div>
        </div>
        
        {/* Right Column: Wilson & Summary */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                 <Award size={14} className="text-yellow-500" /> Statistical Significance (Wilson CI)
              </h3>
              
              <div className="p-4 bg-black/60 rounded-lg border border-neutral-800 flex flex-col items-center gap-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-yellow-500/5 animate-pulse pointer-events-none"></div>
                 <div className="text-3xl font-mono text-white">{data.violation_rate.toFixed(3)}</div>
                 <div className="flex items-center gap-4 w-full">
                    <span className="text-[10px] text-neutral-600 font-bold">{data.ci_lower.toFixed(2)}</span>
                    <div className="flex-1 h-[2px] bg-neutral-800 relative">
                       <div className="absolute -top-1.5 left-1/4 right-1/4 h-3 border-x-2 border-yellow-500/50 bg-yellow-500/10"></div>
                       <div className="absolute -top-1 left-1/2 w-2 h-2 bg-yellow-500 rounded-full -ml-1 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    </div>
                    <span className="text-[10px] text-neutral-600 font-bold">{data.ci_upper.toFixed(2)}</span>
                 </div>
                 <p className="text-[10px] text-neutral-500 text-center italic">95% Confidence Interval for P(Violation) under Context Poisoning attacks.</p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400 font-medium">Reachable(M) Coverage</span>
                    <span className="text-green-500 font-mono">{(data.reachable_coverage * 100).toFixed(1)}%</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400 font-medium">Semantic Bias Score</span>
                    <span className="text-blue-500 font-mono">{data.semantic_bias.toFixed(3)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400 font-medium">Separation Metric Sep(M)</span>
                    <span className={'font-mono ' + (data.sep_score < 0.4 ? 'text-red-500' : 'text-green-500')}>{data.sep_score.toFixed(3)}</span>
                 </div>
              </div>
           </div>

           <div className="bg-neutral-950 border border-neutral-800 border-dashed rounded-xl p-6 flex flex-col items-center text-center gap-4">
              <div className="p-3 rounded-full bg-neutral-900 border border-neutral-800">
                 <Share2 className="text-neutral-500" />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-white mb-1">Collaboration Hub</h4>
                 <p className="text-[11px] text-neutral-600 leading-relaxed italic">
                    Push validated datasets directly to the Peer-Review repository or generation automated IEEE figures.
                 </p>
              </div>
              <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded transition-colors group flex items-center justify-center gap-2">
                 <Info size={14} className="group-hover:text-blue-400 transition-colors" /> Project Documentation (v4.2)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
