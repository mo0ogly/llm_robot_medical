import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal as TerminalIcon, Download, Trash2, Cpu, Shield, AlertTriangle, Bug } from 'lucide-react';

export default function LogsView() {
  var { t } = useTranslation();
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), level: 'INFO', module: 'SYS', msg: 'Aegis Red Team Lab initialized.' },
    { id: 2, time: new Date().toLocaleTimeString(), level: 'SUCCESS', module: 'DEFENSE', msg: 'Aegis Shield (δ²) structural separation verified.' },
    { id: 3, time: new Date().toLocaleTimeString(), level: 'WARN', module: 'VECTOR', msg: 'ChromaDB heartbeat latency slightly high (12ms).' }
  ]);
  const [filter, setFilter] = useState('ALL');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (level, module, msg) => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      level,
      module,
      msg
    }]);
  };

  const clearLogs = () => setLogs([]);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.level === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
      <header className="border-b border-neutral-800 pb-4 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <TerminalIcon className="text-neutral-400" /> {t('redteam.view.logs.title')}
           </h2>
           <p className="text-neutral-400 text-sm mt-1">{t('redteam.view.logs.desc')}</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={clearLogs}
             className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
             title="Clear Terminal"
           >
              <Trash2 size={18} />
           </button>
           <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2">
              <Download size={16} /> Export JSON
           </button>
        </div>
      </header>
      
      <div className="flex-1 bg-black/80 border border-neutral-800 rounded-lg p-4 font-mono text-sm overflow-hidden flex flex-col shadow-inner">
        {/* Filters */}
        <div className="flex gap-4 mb-4 border-b border-neutral-800 pb-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
           {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map(f => (
             <button 
               key={f} 
               onClick={() => setFilter(f)}
               className={`transition-colors ${filter === f ? 'text-blue-500 underline underline-offset-4' : 'hover:text-neutral-300'}`}
             >
               {f}
             </button>
           ))}
        </div>

        {/* Console Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-2">
           {filteredLogs.map((log) => (
             <div key={log.id} className="flex gap-3 group">
                <span className="text-neutral-700 shrink-0">[{log.time}]</span>
                <span className={`shrink-0 w-16 px-1.5 rounded-[2px] text-center font-bold text-[10px] h-fit mt-0.5 ${
                  log.level === 'INFO' ? 'bg-blue-500/10 text-blue-500/80 border border-blue-500/20' :
                  log.level === 'SUCCESS' ? 'bg-green-500/10 text-green-500/80 border border-green-500/20' :
                  log.level === 'WARN' ? 'bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20' :
                  'bg-red-500/10 text-red-500/80 border border-red-500/20'
                }`}>
                  {log.level}
                </span>
                <span className="text-neutral-600 font-bold shrink-0">[{log.module}]</span>
                <span className={`flex-1 break-all ${
                   log.level === 'ERROR' ? 'text-red-400' : 
                   log.level === 'WARN' ? 'text-yellow-200/70' : 
                   'text-neutral-400'
                }`}>
                   {log.msg}
                </span>
             </div>
           ))}
           {running_placeholder && (
             <div className="flex gap-3 mt-2 animate-pulse">
                <span className="text-neutral-800">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-neutral-800 underline">LISTENING...</span>
             </div>
           )}
        </div>
        
        {/* Input Bar */}
        <div className="mt-4 border-t border-neutral-800 pt-4 flex gap-3 items-center">
           <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
              <span className="animate-pulse">●</span>
              <span>AEGIS_ROOT</span>
           </div>
           <div className="text-neutral-700">~#</div>
           <input 
             type="text" 
             className="flex-1 bg-transparent text-white outline-none placeholder-neutral-800" 
             placeholder="Inject manual system signal or diagnostic command..." 
           />
           <div className="flex gap-2 opacity-30">
              <Cpu size={14} />
              <Shield size={14} />
              <Bug size={14} />
           </div>
        </div>
      </div>
    </div>
  );
}

const running_placeholder = true;
