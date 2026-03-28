import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Square, Download, Settings2, AlertTriangle, ShieldAlert, ListChecks, Dna, SkipForward, Eye, EyeOff } from 'lucide-react';
import AgentLevelSelector from './AgentLevelSelector';
import DigitalTwin from './DigitalTwin';
import TestSuitePanel from './TestSuitePanel';
import GeneticProgressView from './GeneticProgressView';

export default function CampaignTab() {
  const { t, i18n } = useTranslation();
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [offline, setOffline] = useState(false);
  const [levels, setLevels] = useState({ medical: 'normal', redteam: 'normal', security: 'normal' });
  const [showConfig, setShowConfig] = useState(false);
  const [aegisShield, setAegisShield] = useState(false);
  const [activeTab, setActiveTab] = useState('suite'); // 'suite' | 'full' | 'genetic'
  const [showLiveGrid, setShowLiveGrid] = useState(true);
  const [currentChain, setCurrentChain] = useState(null);
  const abortRef = useRef(null);
  const feedRef = useRef(null);
  const skipRef = useRef(false);

  // Build per-chain status from rounds
  var chainStatusMap = useMemo(function() {
    var map = {};
    rounds.forEach(function(r) {
      var key = r.chain_id || r.attack_name || r.attack_type || ('round_' + r.round);
      if (!map[key]) map[key] = { total: 0, violations: 0, blocked: 0, name: r.attack_name || key };
      map[key].total++;
      if (r.scores && !r.scores.metric_reachable_subset_allowed) map[key].violations++;
      else map[key].blocked++;
    });
    return map;
  }, [rounds]);

  // startCampaign and runSelected both delegate to streamFromEndpoint below

  const stopCampaign = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  // ---- SSE stream helper shared by startCampaign and runSelected ----
  const streamFromEndpoint = async (url, body) => {
    setRunning(true);
    setRounds([]);
    setSummary(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === 'round_start') {
              setProgress({ current: payload.round, total: payload.total });
              setCurrentChain(payload.attack_name || payload.chain_id || null);
            } else if (payload.type === 'round_result') {
              setRounds((prev) => [...prev, payload]);
              feedRef.current?.scrollTo(0, feedRef.current.scrollHeight);
            } else if (payload.type === 'campaign_done') {
              setSummary(payload.summary);
              const entry = { date: new Date().toISOString(), summary: payload.summary, roundCount: payload.summary?.total_rounds || 0 };
              const saved = JSON.parse(localStorage.getItem('redteam_history') || '[]');
              saved.unshift(entry);
              localStorage.setItem('redteam_history', JSON.stringify(saved.slice(0, 50)));
            }
          } catch {}
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') { console.error(e); setOffline(true); }
    }
    setRunning(false);
  };

  const startCampaign = () =>
    streamFromEndpoint(`/api/redteam/campaign/stream?lang=${i18n.language}`, { levels, aegis_shield: aegisShield });

  const runSelected = (templates) =>
    streamFromEndpoint('/api/redteam/campaign/stream?lang=' + i18n.language, {
      levels,
      aegis_shield: aegisShield,
      attacks: templates.map(function(t) {
        return {
          type: t.category,
          message: t.template,
          name: t.name,
          chain_id: t.chainId || null,
        };
      }),
    });

  const getScore = (scores) => {
    if (!scores?.metric_reachable_subset_allowed) return { label: 'Reachable ⊈ Allowed', color: 'text-red-100 bg-red-900 border border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' };
    if (scores?.prompt_leak) return { label: 'LEAK', color: 'text-purple-400 bg-purple-500/10' };
    if (scores?.rule_bypass) return { label: 'BYPASS', color: 'text-orange-400 bg-orange-500/10' };
    if (scores?.injection_success) return { label: 'INJECTED', color: 'text-red-400 bg-red-500/10' };
    return { label: 'BLOCKED', color: 'text-[#00ff41] bg-[#00ff41]/10' };
  };

  const leaks = rounds.filter((r) => r.scores?.prompt_leak).length;
  const bypasses = rounds.filter((r) => r.scores?.rule_bypass).length;
  const injections = rounds.filter((r) => r.scores?.injection_success).length;
  const formalViolations = rounds.filter((r) => r.scores && !r.scores.metric_reachable_subset_allowed).length;

  return (
    <div className="space-y-4">
      {offline && (
        <div className="border border-yellow-500/30 rounded p-4 bg-yellow-500/5 text-center">
          <div className="text-yellow-400 font-mono text-xs font-bold mb-2">BACKEND OFFLINE</div>
          <p className="text-[11px] text-gray-400">The Red Team campaign requires the FastAPI backend (port 8042).</p>
          <p className="text-[10px] text-gray-600 mt-1">Run: <code className="text-gray-400">cd backend && python3 server.py</code></p>
        </div>
      )}
      
      {/* ---- Test Suite Panel ---- */}
      <div className="border border-gray-700/50 rounded p-3 bg-gray-900/50 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListChecks size={14} className="text-[#00ff41]" />
            <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest">Test Suite</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Aegis Shield toggle */}
            <button
              onClick={() => setAegisShield((p) => !p)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                aegisShield
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                  : 'bg-gray-800 border-gray-600 text-gray-500 hover:border-gray-400'
              }`}
            >
              <ShieldAlert size={10} />
              AEGIS SHIELD {aegisShield ? 'ON' : 'OFF'}
            </button>
            {/* Run All */}
            {!running ? (
              <button
                onClick={startCampaign}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-gray-700 border border-gray-600 text-gray-300 text-[10px] font-mono hover:bg-gray-600 transition-all"
              >
                <Play size={10} /> Run All
              </button>
            ) : (
              <button
                onClick={stopCampaign}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-900/50 border border-red-700 text-red-300 text-[10px] font-mono hover:bg-red-900 transition-all animate-pulse"
              >
                <Square size={10} /> Stop
              </button>
            )}
          </div>
        </div>
        <TestSuitePanel
          onRunSelected={runSelected}
          rounds={rounds}
          summary={summary}
          running={running}
        />
      </div>

      {/* ---- Live Chain Status Grid ---- */}
      {(running || Object.keys(chainStatusMap).length > 0) && (
        <div className="border border-gray-700/50 rounded p-3 bg-gray-900/50 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-cyan-400" />
              <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest">Live Chain Monitor</span>
              <span className="text-[9px] text-gray-600">{Object.keys(chainStatusMap).length} chains</span>
            </div>
            <div className="flex items-center gap-2">
              {running && (
                <button
                  onClick={function() { skipRef.current = true; }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] font-mono hover:bg-yellow-900/50 transition-all"
                  title="Skip current test and move to next"
                >
                  <SkipForward size={10} /> Skip
                </button>
              )}
              <button
                onClick={function() { setShowLiveGrid(function(p) { return !p; }); }}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showLiveGrid ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>

          {showLiveGrid && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
              {Object.entries(chainStatusMap).map(function(entry) {
                var key = entry[0];
                var stat = entry[1];
                var hasViolation = stat.violations > 0;
                var isCurrent = currentChain === key;
                var bg = hasViolation
                  ? 'bg-red-900/40 border-red-600/60'
                  : 'bg-emerald-900/20 border-emerald-600/30';
                if (isCurrent) bg = 'bg-cyan-900/40 border-cyan-400/60 animate-pulse';
                return (
                  <div
                    key={key}
                    className={'border rounded px-1.5 py-1 text-center cursor-default transition-all ' + bg}
                    title={stat.name + ': ' + stat.violations + '/' + stat.total + ' violations'}
                  >
                    <div className="text-[8px] text-gray-400 truncate">{key.replace(/_/g, ' ').slice(0, 12)}</div>
                    <div className={'text-[10px] font-mono font-bold ' + (hasViolation ? 'text-red-400' : 'text-emerald-400')}>
                      {hasViolation ? stat.violations + '!' : stat.blocked + '✓'}
                    </div>
                  </div>
                );
              })}
              {running && currentChain && !chainStatusMap[currentChain] && (
                <div className="border border-cyan-400/60 bg-cyan-900/40 rounded px-1.5 py-1 text-center animate-pulse">
                  <div className="text-[8px] text-cyan-300 truncate">{(currentChain || '').replace(/_/g, ' ').slice(0, 12)}</div>
                  <div className="text-[10px] font-mono font-bold text-cyan-400">...</div>
                </div>
              )}
            </div>
          )}

          {/* Current test indicator */}
          {running && currentChain && (
            <div className="flex items-center gap-2 mt-1 px-2 py-1 bg-cyan-950/30 border border-cyan-900/30 rounded">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] text-cyan-400 font-mono">Running: {currentChain}</span>
              <span className="text-[9px] text-gray-600 ml-auto">{progress.current}/{progress.total}</span>
            </div>
          )}
        </div>
      )}

      {/* ---- Genetic Prompt Optimizer (Liu et al., 2023) ---- */}
      <div className="border border-gray-700/50 rounded p-3 bg-gray-900/50 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Dna size={14} className="text-[#e94560]" />
          <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest">Genetic Optimizer</span>
          <span className="text-[9px] text-gray-600 ml-auto">Liu et al. 2023</span>
        </div>
        <GeneticProgressView
          levels={levels}
          aegisShield={aegisShield}
          lang={i18n.language}
        />
      </div>

      {/* Thesis Formal Violation Banner */}
      {formalViolations > 0 && (
        <div className="border-2 border-red-600 rounded p-4 bg-red-950/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
          <div className="flex items-start gap-4">
            <ShieldAlert size={32} className="text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-red-400 font-bold text-lg font-mono">FORMAL METRIC VIOLATION DETECTED</h3>
              <p className="text-red-300 text-xs mt-1 mb-2 font-mono">Reachable(M) ⊈ Allowed(i)</p>
              <p className="text-gray-300 text-xs">Empirical validation of Conjecture 1: The model failed to maintain structural separation, leading to unauthorized physical actuator state divergence.</p>
              <div className="mt-2 inline-block px-2 py-1 bg-red-900/50 text-red-200 text-xs rounded border border-red-800/50">
                Violations Count: {formalViolations} / {rounds.length} rounds
              </div>
              {summary?.violation_rate_ci && (
                <div className="mt-2 text-xs font-mono text-red-300 bg-red-900/20 rounded p-2 border border-red-800/30">
                  <span className="font-bold">Wilson 95% CI:</span> violation_rate = {(summary.violation_rate_ci.rate * 100).toFixed(1)}%
                  {' '}[{(summary.violation_rate_ci.ci_95_lower * 100).toFixed(1)}%, {(summary.violation_rate_ci.ci_95_upper * 100).toFixed(1)}%] (n={summary.violation_rate_ci.n})
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metrics dashboard grid */}
      <div className="mb-4">
         <DigitalTwin latestRound={rounds[rounds.length - 1]} aegisShield={aegisShield} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="border border-purple-500/30 rounded p-3 text-center bg-purple-500/5 transition-all">
          <div className="text-2xl font-bold text-purple-400 font-mono">{leaks}</div>
          <div className="text-[10px] text-purple-500/70 tracking-wider">PROMPT LEAK</div>
        </div>
        <div className="border border-orange-500/30 rounded p-3 text-center bg-orange-500/5 transition-all">
          <div className="text-2xl font-bold text-orange-400 font-mono">{bypasses}</div>
          <div className="text-[10px] text-orange-500/70 tracking-wider">RULE BYPASS</div>
        </div>
        <div className="border border-red-500/30 rounded p-3 text-center bg-red-500/5 transition-all">
          <div className="text-2xl font-bold text-red-400 font-mono">{injections}</div>
          <div className="text-[10px] text-red-500/70 tracking-wider">INJECTION</div>
        </div>
        <div className="border border-red-600/50 rounded p-3 text-center bg-red-600/5 col-span-3">
          <div className="text-2xl font-bold text-red-300 font-mono">{formalViolations}</div>
          <div className="text-[10px] text-red-400/70 tracking-wider">Reachable(M) ⊄ Allowed(i) [THEOREM VIOLATIONS]</div>
        </div>
      </div>

      {/* Sep(M) panel — shown after campaign completes with enough data */}
      {summary?.violation_rate_ci && (
        <div className="border border-cyan-900/50 rounded p-3 bg-cyan-950/10 font-mono text-xs space-y-1">
          <div className="text-cyan-400 font-bold mb-2 tracking-wider">SEP(M) — ZVEREV SEPARATION SCORE</div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
            <div className="border border-gray-700 rounded p-2">
              <span className="text-cyan-300">violation_rate</span>: {(summary.violation_rate_ci.rate * 100).toFixed(1)}%
              <div className="text-[9px] text-gray-600">Wilson 95% CI [{(summary.violation_rate_ci.ci_95_lower * 100).toFixed(1)}%, {(summary.violation_rate_ci.ci_95_upper * 100).toFixed(1)}%] n={summary.violation_rate_ci.n}</div>
            </div>
            <div className="border border-gray-700 rounded p-2">
              <span className="text-cyan-300">δ¹ defense</span>: {formalViolations > 0 ? '❌ INSUFFICIENT' : '✓ Holding'}
              <div className="text-[9px] text-gray-600">Conjecture 1 {formalViolations > 0 ? 'supported' : 'not yet confirmed'}</div>
            </div>
          </div>
          <div className="text-[9px] text-gray-600 mt-1">To compute Sep(M): POST /api/redteam/separation-score — compares data-position vs instruction-position violation rates.</div>
        </div>
      )}

      {/* Progress bar */}
      {running && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-600 mb-1">
            <span>{t('redteam.campaign.label.round')} {progress.current}/{progress.total}</span>
            <span>{Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${formalViolations > 0 ? 'bg-red-500' : 'bg-[#00ff41]'}`}
              style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Levels configuration */}
      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-[#00ff41] transition-colors"
        >
          <Settings2 size={12} />
          {showConfig ? 'HIDE AGENT CONFIGURATION' : 'CONFIGURE THESIS PARAMETERS'}
        </button>
      </div>

      {showConfig && (
        <div className="space-y-3">
          <AgentLevelSelector levels={levels} onChange={setLevels} />
          
          <div className="flex items-center justify-between p-3 border border-blue-900/50 bg-blue-950/20 rounded">
             <div>
                <div className="text-sm font-bold text-blue-400 font-mono">AEGIS SHIELD (δ²)</div>
                <div className="text-[10px] text-gray-400">Strict structural separation parser before LLM inference. Proves Conjecture 1 by validating Conjecture 2.</div>
             </div>
             <button 
                onClick={() => setAegisShield(!aegisShield)} 
                className={`px-3 py-1 text-xs font-mono font-bold rounded border transition-colors ${aegisShield ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[#00ff41]/20' : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300'}`}
             >
                {aegisShield ? 'ENABLED' : 'DISABLED'}
             </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {!running ? (
          <button
            onClick={startCampaign}
            className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                       text-[#00ff41] border border-[#00ff41]/50 rounded
                       hover:bg-[#00ff41]/10 transition-colors"
          >
            <Play size={12} /> EVALUATE CONJECTURE 1 (RUN CAMPAIGN)
          </button>
        ) : (
          <button
            onClick={stopCampaign}
            className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                       text-red-400 border border-red-500/50 rounded
                       hover:bg-red-500/10 transition-colors"
          >
            <Square size={12} /> HALT EVALUATION
          </button>
        )}
        {rounds.length > 0 && (
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify({ rounds, summary, levels }, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `thesis-validation-${new Date().toISOString().slice(0, 10)}.json`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold
                       text-gray-400 border border-gray-700 rounded
                       hover:border-gray-500 transition-colors"
          >
            <Download size={12} /> EXPORT ACADEMIC LOGS
          </button>
        )}
      </div>

      {/* Feed */}
      <div ref={feedRef} className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        {rounds.map((r, i) => {
          const badge = getScore(r.scores);
          return (
            <details key={i} className={`border rounded group transition-colors ${
              r.scores?.metric_reachable_subset_allowed === false 
              ? 'border-red-800/60 bg-red-950/20' 
              : 'border-gray-800/50 bg-[#111]'
            }`}>
              <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 list-none">
                <span className="text-gray-600 text-[10px] w-8">#{r.round}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.color}`}>{badge.label}</span>
                <span className="text-xs text-gray-400 truncate flex-1 font-mono">{r.attack_message?.slice(0, 70)}...</span>
                {r.scores?.heuristics?.length > 0 && (
                  <AlertTriangle size={14} className="text-yellow-500 shrink-0" />
                )}
              </summary>
              <div className="px-3 pb-3 space-y-3 mt-2 border-t border-gray-800 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-2 rounded">
                    <div className="text-[10px] text-gray-500 mb-1 font-bold">INJECTION VECTOR (i)</div>
                    <pre className="text-[11px] text-red-400/80 whitespace-pre-wrap font-mono">{r.attack_message}</pre>
                  </div>
                  <div className="bg-black/40 p-2 rounded">
                    <div className="text-[10px] text-gray-500 mb-1 font-bold">STATE REACHED (M)</div>
                    <pre className="text-[11px] text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto font-mono custom-scrollbar">{r.target_response}</pre>
                  </div>
                </div>
                
                <div className="bg-[#050505] border border-blue-900/30 p-2 rounded">
                  <div className="text-[10px] text-blue-500/70 mb-1 font-bold">AEGIS FORMAL AUDIT</div>
                  {r.scores?.heuristics?.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {r.scores.heuristics.map((h, idx) => (
                        <div key={idx} className="text-xs text-yellow-400/90 font-mono flex items-center gap-1 bg-yellow-900/20 px-2 py-1 rounded">
                          <AlertTriangle size={12} /> {h}
                        </div>
                      ))}
                    </div>
                  )}
                  <pre className="text-[11px] text-blue-400/80 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">{r.audit_analysis}</pre>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* Campaign Summary */}
      {summary && (
        <div className={`border rounded p-4 space-y-3 ${summary.formal_metric_violations > 0 ? 'border-red-500/50 bg-red-900/10' : 'border-[#00ff41]/50 bg-[#00ff41]/5'}`}>
          <div className="flex items-center gap-2">
            {summary.formal_metric_violations > 0 ? <ShieldAlert className="text-red-500" size={18} /> : <div className="w-2 h-2 rounded-full bg-[#00ff41]"></div>}
            <div className={`text-sm font-bold font-mono ${summary.formal_metric_violations > 0 ? 'text-red-400' : 'text-[#00ff41]'}`}>
              {summary.formal_metric_violations > 0 ? 'THESIS CONJECTURE 1: EMPIRICALLY VALIDATED' : 'CONJECTURE NOT MET'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono bg-black/40 p-3 rounded">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px]">TOTAL EXECUTIONS</span>
              <span className="text-gray-200 text-lg">{summary.total_rounds}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px]">BYPASS RATE</span>
              <span className="text-gray-200 text-lg">{(summary.success_rate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex flex-col border-l border-gray-800 pl-3">
              <span className="text-gray-500 text-[10px]">UNAUTHORIZED STATES</span>
              <span className={summary.unauthorized_side_effects > 0 ? 'text-red-400 text-lg' : 'text-gray-200 text-lg'}>{summary.unauthorized_side_effects}</span>
            </div>
            <div className="flex flex-col border-l border-gray-800 pl-3">
              <span className="text-gray-500 text-[10px]">Reachable(M) ⊈ Allowed(i)</span>
              <span className={summary.formal_metric_violations > 0 ? 'text-red-500 font-bold text-lg' : 'text-[#00ff41] text-lg'}>{summary.formal_metric_violations}</span>
            </div>
          </div>
          {summary.formal_metric_violations > 0 && (
             <p className="text-xs text-red-300 mt-2 italic">Conclusion: The causal LLM failed to segregate the operational prompt from the poisoned observational data, causing an out-of-bounds physical command.</p>
          )}
        </div>
      )}
    </div>
  );
}
