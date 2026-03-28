import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal as TerminalIcon, Download, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import robotEventBus from '../../../utils/robotEventBus';

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
    level: level,
    module: module,
    msg: msg
  };
}

var LEVEL_STYLES = {
  INFO: 'bg-blue-500/10 text-blue-500/80 border border-blue-500/20',
  SUCCESS: 'bg-green-500/10 text-green-500/80 border border-green-500/20',
  WARN: 'bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20',
  ERROR: 'bg-red-500/10 text-red-500/80 border border-red-500/20'
};

var MSG_STYLES = {
  ERROR: 'text-red-400',
  WARN: 'text-yellow-200/70'
};

var FILTERS = ['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'];

var FILTER_KEYS = {
  ALL: 'redteam.logs.filter.all',
  INFO: 'redteam.logs.filter.info',
  SUCCESS: 'redteam.logs.filter.success',
  WARN: 'redteam.logs.filter.warn',
  ERROR: 'redteam.logs.filter.error'
};

var BUS_EVENT_MAP = {
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
  var { t } = useTranslation();
  var [logs, setLogs] = useState([]);
  var [filter, setFilter] = useState('ALL');
  var [sseConnected, setSseConnected] = useState(false);
  var scrollRef = useRef(null);
  var abortRef = useRef(null);

  var appendLog = useCallback(function (level, module, msg) {
    setLogs(function (prev) {
      var next = prev.concat(makeLog(level, module, msg));
      if (next.length > 2000) {
        next = next.slice(next.length - 1500);
      }
      return next;
    });
  }, []);

  // Auto-scroll to bottom on new logs
  useEffect(function () {
    var el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  // SSE connection via fetch + ReadableStream
  useEffect(function () {
    var controller = new AbortController();
    abortRef.current = controller;
    var cancelled = false;

    function connectSSE() {
      fetch('/api/redteam/telemetry/stream', { signal: controller.signal })
        .then(function (response) {
          if (!response.ok || !response.body) {
            throw new Error('SSE connection failed: ' + response.status);
          }
          if (!cancelled) {
            setSseConnected(true);
            appendLog('INFO', 'SSE', t('redteam.logs.connected'));
          }
          var reader = response.body.getReader();
          var decoder = new TextDecoder();
          var buffer = '';

          function pump() {
            return reader.read().then(function (result) {
              if (result.done || cancelled) return;
              buffer += decoder.decode(result.value, { stream: true });
              var lines = buffer.split('\n');
              buffer = lines.pop() || '';
              for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line.indexOf('data:') === 0) {
                  var payload = line.substring(5).trim();
                  if (payload) {
                    try {
                      var evt = JSON.parse(payload);
                      var level = (evt.level || 'INFO').toUpperCase();
                      if (!LEVEL_STYLES[level]) level = 'INFO';
                      appendLog(level, evt.module || 'SYS', evt.msg || evt.message || JSON.stringify(evt));
                    } catch (e) {
                      appendLog('INFO', 'SSE', payload);
                    }
                  }
                }
              }
              return pump();
            });
          }

          return pump();
        })
        .catch(function (err) {
          if (cancelled) return;
          setSseConnected(false);
          if (err.name !== 'AbortError') {
            appendLog('WARN', 'SSE', t('redteam.logs.disconnected'));
          }
        });
    }

    connectSSE();

    return function () {
      cancelled = true;
      controller.abort();
    };
  }, [appendLog, t]);

  // robotEventBus subscription
  useEffect(function () {
    var unsubs = [];
    var events = Object.keys(BUS_EVENT_MAP);
    for (var i = 0; i < events.length; i++) {
      (function (eventName) {
        var cfg = BUS_EVENT_MAP[eventName];
        var unsub = robotEventBus.on(eventName, function (data) {
          var msg = (data && data.msg) || (data && data.message) || eventName;
          if (typeof data === 'string') msg = data;
          appendLog(cfg.level, cfg.module, msg);
        });
        unsubs.push(unsub);
      })(events[i]);
    }
    return function () {
      for (var j = 0; j < unsubs.length; j++) {
        unsubs[j]();
      }
    };
  }, [appendLog]);

  var clearLogs = useCallback(function () {
    setLogs([]);
  }, []);

  var exportJSON = useCallback(function () {
    var json = JSON.stringify(logs, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var d = new Date();
    var dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    a.href = url;
    a.download = 'aegis_logs_' + dateStr + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [logs]);

  var filteredLogs = filter === 'ALL' ? logs : logs.filter(function (l) {
    return l.level === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <header className="border-b border-neutral-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TerminalIcon className="text-neutral-400" /> {t('redteam.logs.title')}
          </h2>
          <p className="text-neutral-400 text-sm mt-1">{t('redteam.logs.subtitle')}</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Connection status indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className={sseConnected ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}>
              {'●'}
            </span>
            <span className={sseConnected ? 'text-green-500/70' : 'text-red-500/70'}>
              {sseConnected ? 'SSE' : 'OFFLINE'}
            </span>
          </div>
          <button
            onClick={clearLogs}
            className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
            title={t('redteam.logs.clear')}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={exportJSON}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} /> {t('redteam.logs.export')}
          </button>
        </div>
      </header>

      {/* Offline banner */}
      {!sseConnected && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 text-yellow-400 text-sm flex items-center gap-2">
          <span>{'⚠'}</span> {t('redteam.logs.disconnected')}
        </div>
      )}

      {/* Terminal area */}
      <div className="flex-1 bg-black/80 border border-neutral-800 rounded-lg p-4 font-mono text-sm overflow-hidden flex flex-col shadow-inner">
        {/* Filter bar */}
        <div className="flex gap-4 mb-4 border-b border-neutral-800 pb-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
          {FILTERS.map(function (f) {
            return (
              <button
                key={f}
                onClick={function () { setFilter(f); }}
                className={'transition-colors ' + (filter === f ? 'text-blue-500 underline underline-offset-4' : 'hover:text-neutral-300')}
              >
                {t(FILTER_KEYS[f])}
              </button>
            );
          })}
        </div>

        {/* Log lines */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-2">
          {filteredLogs.length === 0 && (
            <div className="text-neutral-700 text-center py-12">
              {t('redteam.logs.no_logs')}
            </div>
          )}
          {filteredLogs.map(function (log) {
            return (
              <div key={log.id} className="flex gap-3 group">
                <span className="text-neutral-700 shrink-0">{'[' + log.ts + ']'}</span>
                <span className={'shrink-0 w-16 px-1.5 rounded-[2px] text-center font-bold text-[10px] h-fit mt-0.5 ' + (LEVEL_STYLES[log.level] || LEVEL_STYLES.INFO)}>
                  {log.level}
                </span>
                <span className="text-neutral-600 font-bold shrink-0">{'[' + log.module + ']'}</span>
                <span className={'flex-1 break-all ' + (MSG_STYLES[log.level] || 'text-neutral-400')}>
                  {log.msg}
                </span>
              </div>
            );
          })}
        </div>

        {/* Listening indicator */}
        <div className="mt-4 border-t border-neutral-800 pt-4 flex items-center gap-2">
          <span className={'animate-pulse ' + (sseConnected ? 'text-green-600' : 'text-red-600')}>{'●'}</span>
          <span className="text-neutral-700 text-xs">{t('redteam.logs.listening')}</span>
        </div>
      </div>
    </div>
  );
}
