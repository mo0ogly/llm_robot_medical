import React, { useState, useEffect } from 'react';
import { Swords, Code, Play, ShieldAlert, Cpu, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { ATTACK_TEMPLATES } from '../attackTemplates';

// Build demo catalog from attackTemplates when backend is offline
function buildDemoCatalog() {
  var cats = {};
  ATTACK_TEMPLATES.forEach(function(t) {
    if (!t.template) return; // skip empty Custom
    var cat = t.category || 'injection';
    if (!cats[cat]) cats[cat] = [];
    // Resolve variables in template
    var msg = t.template;
    if (t.variables) {
      Object.keys(t.variables).forEach(function(k) {
        msg = msg.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), t.variables[k]);
      });
    }
    cats[cat].push({ name: t.name, message: msg });
  });
  return cats;
}

export default function AttackView() {
  var [catalog, setCatalog] = useState({});
  var [selectedCategory, setSelectedCategory] = useState('injection');
  var [payload, setPayload] = useState('');
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState(null);
  var [offline, setOffline] = useState(false);

  useEffect(function() {
    fetch('/api/redteam/catalog')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        setCatalog(data);
        if (data.injection && data.injection.length > 0) {
          setPayload(data.injection[0]);
        }
      })
      .catch(function() {
        // Fallback to demo catalog from attackTemplates
        console.warn('Backend missing, using demo attack catalog.');
        var demo = buildDemoCatalog();
        setCatalog(demo);
        setOffline(true);
        if (demo.injection && demo.injection.length > 0) {
          setPayload(demo.injection[0].message || demo.injection[0]);
        }
      });
  }, []);

  const runAttack = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/redteam/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attack_type: selectedCategory,
          attack_message: payload
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Attack failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
      {offline && (
        <div className="border border-yellow-500/30 rounded p-2 bg-yellow-500/5 text-center mb-4">
          <span className="text-yellow-400 font-mono text-[10px] font-bold">DEMO MODE</span>
          <span className="text-[10px] text-gray-500 ml-2">Backend offline — 52 templates loaded from local catalog (execution disabled)</span>
        </div>
      )}

      <header className="border-b border-neutral-800 pb-4 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Swords className="text-red-500 animate-pulse" /> Payload Forge
           </h2>
           <p className="text-neutral-400 text-sm mt-1">Design OODA attack instructions and static Context Poisoning vectors.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={runAttack}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-lg ${
              loading 
                ? 'bg-neutral-800 text-neutral-500 cursor-wait' 
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-900/40 active:scale-95'
            }`}
          >
             {loading ? <Cpu className="animate-spin" size={16} /> : <Play size={16} />} 
             {loading ? 'EXECUTING...' : 'RUN EXPLOIT'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Left: Attack Catalog Selection */}
        <div className="lg:col-span-1 bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 flex flex-col overflow-hidden">
           <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Activity size={12} /> Strategy Library
           </h3>
           <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
             {Object.keys(catalog).map(cat => (
               <div key={cat} className="space-y-1">
                 <div className="text-[10px] text-neutral-600 font-bold uppercase mb-1 ml-1">{cat}</div>
                 <div className="space-y-1">
                    {catalog[cat].map(function(item, idx) {
                      var msg = typeof item === 'string' ? item : item.message;
                      var label = typeof item === 'string' ? item : item.name;
                      return (
                      <div
                        key={idx}
                        onClick={function() { setSelectedCategory(cat); setPayload(msg); }}
                        className={'p-2 text-[11px] font-mono rounded cursor-pointer transition-all border ' + (
                          payload === msg
                            ? 'bg-red-950/20 border-red-500/50 text-red-200'
                            : 'bg-black/40 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                        ) + ' truncate'}
                        title={msg}
                      >
                        {label}
                      </div>
                      );
                    })}
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        {/* Center: Editor and Results */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          {/* Editor */}
          <div className="flex-1 border border-neutral-800 bg-neutral-950/80 rounded-lg flex flex-col overflow-hidden shadow-inner ring-1 ring-white/5">
            <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex justify-between items-center text-neutral-400 text-[10px] font-mono uppercase tracking-tight">
              <div className="flex items-center gap-2"><Code size={14} className="text-red-500"/> exploit_payload.md</div>
              <div className="text-neutral-600 underline cursor-not-allowed">Autogen v0.42</div>
            </div>
            <textarea 
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="flex-1 bg-transparent text-green-500 font-mono p-4 resize-none focus:outline-none placeholder-neutral-800 text-sm leading-relaxed"
              placeholder="Inject malicious context here..."
              spellCheck="false"
            />
          </div>

          {/* Result Terminal */}
          <div className="h-[200px] border border-neutral-800 bg-neutral-900/50 rounded-lg flex flex-col overflow-hidden">
            <div className="bg-neutral-950 px-4 py-1.5 border-b border-neutral-800 flex items-center gap-2 text-neutral-500 text-[10px] font-bold uppercase">
              Audit Feedback
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs overflow-x-hidden">
              {!result && !loading && <span className="text-neutral-700 italic">Waiting for execution...</span>}
              {loading && <span className="text-blue-500 animate-pulse">Running semantic inference via {selectedCategory}...</span>}
              
              {result && (
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                       <p className="text-neutral-500 mb-1 uppercase text-[9px]">Model Response</p>
                       <div className="text-neutral-300 p-2 bg-black/40 rounded border border-neutral-800 break-words">
                          {result.target_response}
                       </div>
                    </div>
                    <div className="w-[120px] shrink-0">
                       <p className="text-neutral-500 mb-1 uppercase text-[9px]">Safety Score</p>
                       <div className={`p-2 rounded border text-center font-bold ${
                         result.scores?.violation ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-green-500/10 border-green-500/50 text-green-500'
                       }`}>
                          {result.scores?.violation ? 'BREACH' : 'SECURE'}
                       </div>
                    </div>
                  </div>
                  
                  {result.audit_analysis && (
                    <div className="p-2 bg-neutral-950 border-l-2 border-orange-500 text-orange-400/80 italic text-[11px] leading-snug">
                       {result.audit_analysis}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
