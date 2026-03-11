// frontend/src/components/redteam/CampaignTab.jsx
import { useState, useRef } from 'react';
import { Play, Square, Download, Settings2 } from 'lucide-react';
import AgentLevelSelector from './AgentLevelSelector';

export default function CampaignTab() {
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [offline, setOffline] = useState(false);
  const [levels, setLevels] = useState({ medical: 'normal', redteam: 'normal', security: 'normal' });
  const [showConfig, setShowConfig] = useState(false);
  const abortRef = useRef(null);
  const feedRef = useRef(null);

  const startCampaign = async () => {
    setRunning(true);
    setRounds([]);
    setSummary(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/redteam/campaign/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levels }),
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
            } else if (payload.type === 'round_result') {
              setRounds((prev) => [...prev, payload]);
              feedRef.current?.scrollTo(0, feedRef.current.scrollHeight);
            } else if (payload.type === 'campaign_done') {
              setSummary(payload.summary);
              // Save to history
              const entry = { date: new Date().toISOString(), summary: payload.summary, roundCount: payload.summary?.total_rounds || 0 };
              const saved = JSON.parse(localStorage.getItem('redteam_history') || '[]');
              saved.unshift(entry);
              localStorage.setItem('redteam_history', JSON.stringify(saved.slice(0, 50)));
            }
          } catch {}
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
        setOffline(true);
      }
    }
    setRunning(false);
  };

  const stopCampaign = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  const getScore = (scores) => {
    if (scores?.prompt_leak) return { label: 'LEAK', color: 'text-purple-400 bg-purple-500/10' };
    if (scores?.rule_bypass) return { label: 'BYPASS', color: 'text-orange-400 bg-orange-500/10' };
    if (scores?.injection_success) return { label: 'INJECTED', color: 'text-red-400 bg-red-500/10' };
    return { label: 'BLOCKED', color: 'text-[#00ff41] bg-[#00ff41]/10' };
  };

  const leaks = rounds.filter((r) => r.scores?.prompt_leak).length;
  const bypasses = rounds.filter((r) => r.scores?.rule_bypass).length;
  const injections = rounds.filter((r) => r.scores?.injection_success).length;

  return (
    <div className="space-y-4">
      {offline && (
        <div className="border border-yellow-500/30 rounded p-4 bg-yellow-500/5 text-center">
          <div className="text-yellow-400 font-mono text-xs font-bold mb-2">BACKEND OFFLINE</div>
          <p className="text-[11px] text-gray-400">The Red Team campaign requires the FastAPI backend (port 8042).</p>
          <p className="text-[10px] text-gray-600 mt-1">Run: <code className="text-gray-400">cd backend && python3 server.py</code></p>
        </div>
      )}
      {/* Metrics dashboard */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-purple-500/30 rounded p-3 text-center bg-purple-500/5">
          <div className="text-2xl font-bold text-purple-400 font-mono">{leaks}</div>
          <div className="text-[10px] text-purple-500/70 tracking-wider">PROMPT LEAK</div>
        </div>
        <div className="border border-orange-500/30 rounded p-3 text-center bg-orange-500/5">
          <div className="text-2xl font-bold text-orange-400 font-mono">{bypasses}</div>
          <div className="text-[10px] text-orange-500/70 tracking-wider">RULE BYPASS</div>
        </div>
        <div className="border border-red-500/30 rounded p-3 text-center bg-red-500/5">
          <div className="text-2xl font-bold text-red-400 font-mono">{injections}</div>
          <div className="text-[10px] text-red-500/70 tracking-wider">INJECTION</div>
        </div>
      </div>

      {/* Progress bar */}
      {running && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-600 mb-1">
            <span>Round {progress.current}/{progress.total}</span>
            <span>{Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5">
            <div
              className="bg-[#00ff41] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Levels configuration */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-[#00ff41] transition-colors"
        >
          <Settings2 size={12} />
          {showConfig ? 'HIDE AGENT CONFIGURATION' : 'CONFIGURE AGENTS (DIFFICULTY)'}
        </button>
      </div>

      {showConfig && (
        <AgentLevelSelector levels={levels} onChange={setLevels} />
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
            <Play size={12} /> LAUNCH CAMPAIGN
          </button>
        ) : (
          <button
            onClick={stopCampaign}
            className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                       text-red-400 border border-red-500/50 rounded
                       hover:bg-red-500/10 transition-colors"
          >
            <Square size={12} /> STOP
          </button>
        )}
        {rounds.length > 0 && (
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify({ rounds, summary, levels }, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `campaign-${new Date().toISOString().slice(0, 10)}.json`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold
                       text-gray-400 border border-gray-700 rounded
                       hover:border-gray-500 transition-colors"
          >
            <Download size={12} /> EXPORT
          </button>
        )}
      </div>

      {/* Feed */}
      <div ref={feedRef} className="space-y-1 max-h-[50vh] overflow-y-auto">
        {rounds.map((r, i) => {
          const badge = getScore(r.scores);
          return (
            <details key={i} className="border border-gray-800/50 rounded bg-[#111] group">
              <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5">
                <span className="text-gray-600 text-[10px] w-8">#{r.round}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.color}`}>{badge.label}</span>
                <span className="text-xs text-gray-500 truncate flex-1">{r.attack_message?.slice(0, 60)}...</span>
              </summary>
              <div className="px-3 pb-3 space-y-2">
                <div>
                  <div className="text-[10px] text-gray-600 mb-1">ATTACK</div>
                  <pre className="text-xs text-red-400/70 whitespace-pre-wrap">{r.attack_message}</pre>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 mb-1">DA VINCI RESPONSE</div>
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto">{r.target_response}</pre>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 mb-1">AEGIS ANALYSIS</div>
                  <pre className="text-xs text-blue-400/70 whitespace-pre-wrap max-h-32 overflow-y-auto">{r.audit_analysis}</pre>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* Summary */}
      {summary && (
        <div className="border border-[#00ff41]/30 rounded p-3 bg-[#00ff41]/5">
          <div className="text-xs text-[#00ff41] font-bold mb-2">CAMPAIGN COMPLETED</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <span className="text-gray-500">Rounds:</span><span className="text-gray-300">{summary.total_rounds}</span>
            <span className="text-gray-500">Success rate:</span><span className="text-gray-300">{(summary.success_rate * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
