// frontend/src/components/redteam/views/LogsView.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal as TerminalIcon, 
  Download, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Activity,
  History,
  FileJson,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import robotEventBus from '../../../utils/robotEventBus';
import ViewHelpModal from '../shared/ViewHelpModal';

var idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

function makeLog(level, module, msg) {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  var s = String(now.getSeconds()).padStart(2, '0');
  return {
    id: nextId(),
    ts: h + ':' + m + ':' + s,
    level: level.toUpperCase(),
    module: module.toUpperCase(),
    msg: msg
  };
}

const LEVEL_CONFIG = {
  INFO: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', text: 'text-blue-300/60' },
  SUCCESS: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'text-emerald-300/60' },
  WARN: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', text: 'text-amber-200/50' },
  ERROR: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', text: 'text-rose-400' }
};

const FILTERS = ['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'];

const BUS_EVENT_MAP = {
  'redteam:attack_start': { level: 'INFO', module: 'ATTACK' },
  'redteam:attack_result': { level: 'SUCCESS', module: 'ATTACK' },
  'redteam:attack_error': { level: 'ERROR', module: 'ATTACK' },
  'redteam:scenario_start': { level: 'INFO', module: 'SCENARIO' },
  'redteam:scenario_end': { level: 'SUCCESS', module: 'SCENARIO' },
  'redteam:campaign_start': { level: 'INFO', module: 'CAMPAIGN' },
  'redteam:campaign_end': { level: 'SUCCESS', module: 'CAMPAIGN' },
  'redteam:defense_trigger': { level: 'WARN', module: 'DEFENSE' }
};

export default function LogsView() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [sseConnected, setSseConnected] = useState(false);
  var [showHelp, setShowHelp] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  const appendLog = useCallback((level, module, msg) => {
    setLogs(prev => {
      let next = [...prev, makeLog(level, module, msg)];
      if (next.length > 2000) next = next.slice(-1500);
      return next;
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let cancelled = false;
    let es = null;

    const connectSSE = () => {
      if (cancelled) return;
      
      // Connect directly to backend for SSE (Vite proxy does not handle streaming)
      var sseUrl = window.location.port === '5173'
        ? 'http://localhost:8042/api/redteam/telemetry/stream'
        : '/api/redteam/telemetry/stream';
      es = new EventSource(sseUrl);

      es.onopen = () => {
        if (!cancelled) {
          setSseConnected(true);
          appendLog('SUCCESS', 'SYSTEM', t('redteam.logs.connected'));
        }
      };

      es.onmessage = (event) => {
        if (cancelled || !event.data) return;
        try {
          const evt = JSON.parse(event.data);
          appendLog(evt.level || 'INFO', evt.module || 'SYS', evt.msg || evt.message || event.data);
        } catch (e) {
          // If not JSON, it might be a raw string or a heartbeat
          if (event.data !== 'ping') {
             appendLog('INFO', 'SSE', event.data);
          }
        }
      };

      es.onerror = (err) => {
        if (cancelled) return;
        setSseConnected(false);
        // EventSource will auto-retry by default, but we log the offline state
      };
    };

    connectSSE();

    return () => {
      cancelled = true;
      if (es) es.close();
    };
  }, [appendLog, t]);

  useEffect(() => {
    const unsubs = Object.entries(BUS_EVENT_MAP).map(([event, cfg]) => 
      robotEventBus.on(event, data => {
        const msg = (data && (data.msg || data.message)) || (typeof data === 'string' ? data : event);
        appendLog(cfg.level, cfg.module, msg);
      })
    );
    return () => unsubs.forEach(unsub => unsub());
  }, [appendLog]);

  const clearLogs = () => setLogs([]);
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `aegis_telemetry_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.level === filter);

  return (
    <div className="h-full flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto w-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <TerminalIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
              {t('redteam.logs.title')}
            </h2>
            <p className="text-neutral-500 text-xs font-medium uppercase tracking-widest mt-1 opacity-70">
              {t('redteam.logs.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Enhanced Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
            sseConnected 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {sseConnected ? 'LIVE FEED ACTIVE' : 'OFFLINE MODE'}
            </span>
            {sseConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          </div>

          <div className="h-8 w-px bg-neutral-800 hidden md:block" />

          <div className="flex items-center gap-1.5">
            <button
              onClick={function() { setShowHelp(true); }}
              className="p-2.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
              title={t('redteam.help.logs.title')}
            >
              <HelpCircle size={18} />
            </button>
            <button
              onClick={clearLogs}
              className="p-2.5 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              title={t('redteam.logs.clear')}
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={exportJSON}
              className="group flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-neutral-700 shadow-lg"
            >
              <FileJson size={16} className="text-neutral-500 group-hover:text-blue-400 transition-colors" />
              {t('redteam.logs.export')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Terminal Area */}
      <div className="flex-1 flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative group">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        
        {/* Terminal Nav/Filter */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-black/40 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  filter === f 
                    ? 'bg-neutral-800 text-white shadow-md border border-neutral-700' 
                    : 'text-neutral-500 hover:text-neutral-400'
                }`}
              >
                {t(`redteam.logs.filter.${f.toLowerCase()}`)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-mono italic">
            <History size={10} /> {logs.length} events logged
          </div>
        </div>

        {/* Log Viewer */}
        <div 
          ref={scrollRef} 
          className="flex-1 p-5 overflow-y-auto font-mono text-[11px] leading-relaxed relative z-10 custom-scrollbar-red"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-700 gap-4 opacity-50">
              <Activity size={48} strokeWidth={1} className="animate-pulse" />
              <p className="tracking-widest uppercase text-[10px]">{t('redteam.logs.no_logs')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map(log => (
                <div key={log.id} className="flex gap-4 hover:bg-white/[0.02] p-1 rounded transition-colors group/row">
                  <span className="text-neutral-700 shrink-0 select-none opacity-40 group-hover/row:opacity-100 transition-opacity">
                    {log.ts}
                  </span>
                  <span className={`shrink-0 w-[60px] text-center rounded-[4px] border uppercase font-bold text-[8px] py-0.5 self-center ${
                    LEVEL_CONFIG[log.level]?.badge || LEVEL_CONFIG.INFO.badge
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-neutral-600 font-bold shrink-0 min-w-[70px]">
                    [{log.module}]
                  </span>
                  <span className={`flex-1 break-all transition-colors ${
                    LEVEL_CONFIG[log.level]?.text || 'text-neutral-400'
                  }`}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-5 py-2.5 border-t border-neutral-800 bg-black/40 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]'}`} />
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                {sseConnected ? t('redteam.logs.connected') : t('redteam.logs.disconnected')}
              </span>
            </div>
          </div>
          {!sseConnected && (
            <div className="flex items-center gap-2 text-amber-500/80 animate-pulse bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20">
               <AlertCircle size={10} />
               <span className="text-[9px] font-bold uppercase tracking-tighter">Diagnostic Offline</span>
            </div>
          )}
        </div>
      </div>
      {showHelp && <ViewHelpModal viewId="logs" onClose={function() { setShowHelp(false); }} />}
    </div>
  );
}
