import React, { useState } from 'react';
import { Lock, ShieldAlert, Cpu, CheckCircle, XCircle, Settings, ShieldCheck, Zap } from 'lucide-react';

export default function DefenseView() {
  const [shieldActive, setShieldActive] = useState(true);
  const [threshold, setThreshold] = useState(4);
  const [loading, setLoading] = useState(false);
  const [massLoading, setMassLoading] = useState(false);
  const [massProgress, setMassProgress] = useState({ current: 0, total: 10 });
  const [safetyResults, setSafetyResults] = useState(null);
  const [campaignSummary, setCampaignSummary] = useState(null);
  const [auditError, setAuditError] = useState(null);
  const [sanitizers, setSanitizers] = useState({
    xml_stripper: true,
    b64_decoder: true,
    unicode_norm: true,
    semantic_drift: false
  });

  const toggleSanitizer = (key) => {
    setSanitizers(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const runSafetyAudit = async () => {
    setLoading(true);
    setAuditError(null);
    setCampaignSummary(null);
    try {
      const resp = await fetch('http://localhost:8042/api/redteam/safety-eval');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setSafetyResults(data);
    } catch (err) {
      console.error("Safety Audit failed:", err);
      setAuditError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runMassAudit = async () => {
    setMassLoading(true);
    setAuditError(null);
    setCampaignSummary(null);
    setMassProgress({ current: 0, total: 10 });
    
    try {
      const response = await fetch('http://localhost:8042/api/redteam/safety-campaign/stream?n=10');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'progress') {
              setMassProgress({ current: data.current, total: data.total });
              setSafetyResults(data.results);
            } else if (data.type === 'done') {
              // Once done, we could fetch a final summary or compute it
              console.log("Mass Audit Complete");
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          }
        }
      }
    } catch (err) {
      setAuditError(err.message);
    } finally {
      setMassLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto custom-scrollbar">
      <header className="border-b border-neutral-800 pb-4 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Lock className="text-blue-500 animate-pulse" /> Aegis Defenses (δ²)
           </h2>
           <p className="text-neutral-400 text-sm mt-1">Structural separation, tag extraction, and SD-RAG sanitizer parameters.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${shieldActive ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
              STATUS: {shieldActive ? 'OPERATIONAL' : 'BYPASSED'}
           </span>
           <button 
             onClick={() => setShieldActive(!shieldActive)}
             className={`w-12 h-6 rounded-full transition-all relative ${shieldActive ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-neutral-800'}`}
           >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${shieldActive ? 'left-7' : 'left-1'}`} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Shield Configuration */}
        <div className={`border rounded-xl p-6 transition-all duration-500 flex flex-col gap-6 ${shieldActive ? 'bg-blue-900/5 border-blue-500/30' : 'bg-neutral-900/30 border-neutral-800'}`}>
           <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${shieldActive ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-800 text-neutral-600'}`}>
                 <ShieldAlert size={24} />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-white tracking-tight">Deterministic Filter Hub</h3>
                 <p className="text-xs text-neutral-500 uppercase font-mono tracking-widest">Structural Prompt Extraction</p>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { id: 'xml_stripper', label: 'XML Tag Extraction (Conjecture 2)', desc: 'Forcibly removes <System_Config_Override> before inference.' },
                { id: 'b64_decoder', label: 'Base64 Heuristic Scanner', desc: 'Detects and decodes obfuscated operational commands.' },
                { id: 'unicode_norm', label: 'Cyrillic/Unicode Normalizer', desc: 'Neutralizes homoglyph bypass attempts (і -> i).' },
                { id: 'semantic_drift', label: 'Real-time Vector Drift Guard', desc: 'Blocks if distance to safe baseline is > 0.45.' }
              ].map(s => (
                <div 
                  key={s.id}
                  onClick={() => toggleSanitizer(s.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                    sanitizers[s.id] 
                      ? 'bg-blue-950/20 border-blue-800/50 text-blue-100' 
                      : 'bg-black/20 border-neutral-800 text-neutral-500 grayscale'
                  }`}
                >
                   <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold">{s.label}</span>
                      <span className="text-[10px] opacity-50 font-mono italic">{s.desc}</span>
                   </div>
                   {sanitizers[s.id] ? <CheckCircle size={18} className="text-blue-500 shrink-0" /> : <XCircle size={18} className="text-neutral-700 shrink-0" />}
                </div>
              ))}
           </div>
        </div>

        {/* SD-RAG & Analytics */}
        <div className="space-y-6">
           {/* THRESHOLD SLIDER */}
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 shadow-inner ring-1 ring-white/5">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Settings size={14} /> Quarantine Threshold
                 </h3>
                 <span className="text-2xl font-mono text-blue-400 border border-blue-900/50 px-3 py-1 bg-black/40 rounded-lg shadow-lg">
                    {threshold}
                 </span>
              </div>
              
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={threshold} 
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-blue-600 mb-4" 
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-mono uppercase font-bold px-1">
                 <span>Passive (Aggressive)</span>
                 <span>Neutral</span>
                 <span>Conservative (Safe)</span>
              </div>
           </div>

           {/* HARNESS DÉFENSIF (MPIB) */}
           <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 shadow-lg min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-blue-400" /> Defensive Harness (MPIB)
                   </h3>
                   <p className="text-[10px] text-neutral-500 mt-1 italic">Evaluation of safeguards using clinical-grade neutral payloads.</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={runSafetyAudit}
                     disabled={loading || massLoading}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                       loading 
                         ? 'bg-neutral-800 border-neutral-700 text-neutral-600' 
                         : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                     }`}
                   >
                     {loading ? 'RUNNING...' : 'SINGLE SCAN'}
                   </button>
                   <button 
                     onClick={runMassAudit}
                     disabled={loading || massLoading}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border flex items-center gap-1.5 ${
                       massLoading 
                         ? 'bg-blue-900/50 border-blue-700 text-blue-200 animate-pulse' 
                         : 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                     }`}
                   >
                     <Zap size={10} />
                     {massLoading ? `AUDITING (${massProgress.current}/${massProgress.total})` : 'Ph.D. MASS AUDIT'}
                   </button>
                 </div>
              </div>
              
              {massLoading && (
                <div className="mb-6 space-y-1">
                   <div className="flex justify-between items-center text-[9px] font-mono text-blue-400">
                     <span>PH.D. STATISTICAL VALIDATION IN PROGRESS...</span>
                     <span>{Math.round((massProgress.current / massProgress.total) * 100)}%</span>
                   </div>
                   <div className="h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                     <div 
                       className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300" 
                       style={{ width: `${(massProgress.current / massProgress.total) * 100}%` }}
                     />
                   </div>
                </div>
              )}
              
              {safetyResults ? (
                <div className="space-y-4 flex-1">
                   {safetyResults.map((cat, i) => (
                     <div key={i} className="p-3 bg-black/40 rounded-lg border border-white/5 group hover:border-blue-500/30 transition-all">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-bold text-blue-300 uppercase tracking-tighter">{cat.category}</span>
                         <span className={`text-[10px] font-mono tag-glow ${cat.score >= 80 ? 'text-emerald-500' : cat.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                           {cat.score.toFixed(1)}%
                         </span>
                       </div>
                       <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${cat.score >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : cat.score >= 50 ? 'bg-amber-500' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} 
                           style={{ width: `${cat.score}%` }} 
                         />
                       </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-40 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
                   <ShieldAlert size={32} className={`mb-2 ${auditError ? 'text-rose-500 animate-bounce' : ''}`} />
                   <span className="text-[10px] font-mono tracking-tighter uppercase text-center px-4">
                     {auditError ? `CRITICAL ERROR: ${auditError}` : "No audit data available. Start the Ph.D. safety scan above."}
                   </span>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
