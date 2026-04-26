import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Shield, AlertCircle, CheckCircle2, FlaskConical, Clock, Radio, X, FileJson, Loader2 } from 'lucide-react';
import robotEventBus from '../../utils/robotEventBus';

// ---------------------------------------------------------------------------
// Backend event -> UI event adapter
// Backend emits redteam.* channel events via /api/redteam/events/history (array)
// and /api/redteam/events/stream (SSE). Shape:
//   { channel, kind, status, ts, source_file, title, message, ... }
// GlobalTimeline expects:
//   { id, type, title, message, timestamp, icon, color }
// ---------------------------------------------------------------------------
function backendEventToUiEvent(ev, fallbackIdx) {
  var kind = ev.kind || 'cyber';
  var status = ev.status || 'blocked';
  var isCritical = kind === 'critical';
  var isSuccess = status === 'passed';

  var icon;
  var color;
  if (isCritical) {
    icon = AlertCircle;
    color = 'text-red-600 font-bold';
  } else if (isSuccess) {
    icon = AlertCircle;
    color = 'text-red-500';
  } else {
    icon = CheckCircle2;
    color = 'text-[#00ff41]';
  }

  var timestamp;
  try {
    var tsMs = typeof ev.ts === 'number' ? ev.ts * 1000 : Date.parse(ev.ts);
    timestamp = new Date(tsMs).toLocaleTimeString();
  } catch (e) {
    timestamp = new Date().toLocaleTimeString();
  }

  return {
    id: 'be-' + (ev.source_file || 'evt') + '-' + (ev.ts || fallbackIdx) + '-' + Math.random().toString(36).slice(2, 6),
    type: isCritical ? 'critical' : 'cyber',
    title: ev.title || 'Red Team event',
    message: ev.message || '',
    timestamp: timestamp,
    icon: icon,
    color: color,
    // Detail drill-down hook: only backend-born events carry a source_file.
    // Local bus events (simulator) stay non-clickable.
    sourceFile: ev.source_file || null,
    channel: ev.channel || null,
  };
}

export default function GlobalTimeline() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [streamConnected, setStreamConnected] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [selectedSourceFile, setSelectedSourceFile] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const scrollRef = useRef(null);

  // When a row is clicked, fetch the raw artefact. We keep the current
  // detail visible while loading so the drawer doesn't flicker.
  useEffect(function() {
    if (!selectedSourceFile) {
      setDetail(null);
      setDetailError(null);
      return;
    }
    var cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    fetch('/api/redteam/events/artefact/' + encodeURIComponent(selectedSourceFile))
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(body) {
        if (cancelled) return;
        setDetail(body);
        setDetailLoading(false);
      })
      .catch(function(err) {
        if (cancelled) return;
        setDetailError((err && err.message) || 'fetch failed');
        setDetail(null);
        setDetailLoading(false);
      });
    return function() { cancelled = true; };
  }, [selectedSourceFile]);

  // ESC closes the drawer
  useEffect(function() {
    function onKey(e) {
      if (e.key === 'Escape') setSelectedSourceFile(null);
    }
    document.addEventListener('keydown', onKey);
    return function() { document.removeEventListener('keydown', onKey); };
  }, []);

  // -------------------------------------------------------------------------
  // 1. Fetch historical events on mount (backend campaign artefacts)
  // -------------------------------------------------------------------------
  useEffect(function() {
    var cancelled = false;
    fetch('/api/redteam/events/history')
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(body) {
        if (cancelled) return;
        var list = (body && body.events) ? body.events : [];
        var uiEvents = list.map(function(ev, i) { return backendEventToUiEvent(ev, i); });
        // Replace, not append — history is authoritative at mount time.
        setEvents(uiEvents);
        setHistoryLoaded(true);
      })
      .catch(function(err) {
        // Backend offline or endpoint missing — stay in live-only demo mode
        console.info('[GlobalTimeline] events/history unavailable:', err && err.message);
        setHistoryLoaded(true);
      });
    return function() { cancelled = true; };
  }, []);

  // -------------------------------------------------------------------------
  // 2. Subscribe to live backend stream via SSE (EventSource)
  // -------------------------------------------------------------------------
  useEffect(function() {
    if (typeof EventSource === 'undefined') return;
    var es;
    var seenIds = new Set();
    try {
      es = new EventSource('/api/redteam/events/stream');
    } catch (err) {
      console.info('[GlobalTimeline] EventSource failed:', err && err.message);
      return;
    }
    es.onopen = function() { setStreamConnected(true); };
    es.onerror = function() { setStreamConnected(false); };
    es.onmessage = function(msg) {
      try {
        var payload = JSON.parse(msg.data);
        // Replay buffer from the backend can include already-loaded historical
        // events — dedupe by source_file + ts
        var dedupeKey = (payload.source_file || '') + ':' + (payload.ts || '');
        if (seenIds.has(dedupeKey)) return;
        seenIds.add(dedupeKey);
        var uiEvent = backendEventToUiEvent(payload, Date.now());
        setEvents(function(prev) {
          // Skip if we already have an event with the same source_file+ts
          for (var i = 0; i < prev.length; i++) {
            if (prev[i].id && prev[i].id.indexOf(payload.source_file || '') !== -1
                && prev[i].id.indexOf('' + (payload.ts || '')) !== -1) {
              return prev;
            }
          }
          return prev.concat([uiEvent]);
        });
      } catch (e) {
        // Ignore malformed events silently
      }
    };
    return function() {
      if (es) es.close();
    };
  }, []);

  // -------------------------------------------------------------------------
  // 3. Subscribe to local in-browser events (simulator, live attacks)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribers = [];

    // Listen for clinical events
    unsubscribers.push(robotEventBus.on('clinical:phase_change', (data) => {
      addEvent({
        type: 'medical',
        title: t('redteam.timeline.event.medical.title', { defaultValue: 'Phase Change' }),
        message: t('redteam.timeline.event.medical.prefix', { defaultValue: 'Procedure moved to:' }) + ' ' + data.newPhase,
        timestamp: new Date().toLocaleTimeString(),
        icon: Activity,
        color: 'text-blue-400'
      });
    }));

    // Listen for Red Team events
    unsubscribers.push(robotEventBus.on('redteam:attack_start', (data) => {
      addEvent({
        type: 'cyber',
        title: t('redteam.timeline.event.cyber_start.title', { defaultValue: 'Attack Initiated' }),
        message: data.attack_type.toUpperCase() + ': ' + data.message.slice(0, 50) + '...',
        timestamp: new Date().toLocaleTimeString(),
        icon: Shield,
        color: 'text-orange-400'
      });
    }));

    unsubscribers.push(robotEventBus.on('redteam:attack_result', (data) => {
      const isSuccess = data.status === 'passed';
      addEvent({
        type: 'cyber',
        title: isSuccess 
          ? t('redteam.timeline.event.cyber_success.title', { defaultValue: 'Breach Successful' }) 
          : t('redteam.timeline.event.cyber_blocked.title', { defaultValue: 'Attack Blocked' }),
        message: isSuccess 
          ? t('redteam.timeline.event.cyber_success.message', { defaultValue: 'Security guardrails bypassed.' }) 
          : t('redteam.timeline.event.cyber_blocked.message', { defaultValue: 'Aegis blocked the payload.' }),
        timestamp: new Date().toLocaleTimeString(),
        icon: isSuccess ? AlertCircle : CheckCircle2,
        color: isSuccess ? 'text-red-500' : 'text-[#00ff41]'
      });
    }));

    unsubscribers.push(robotEventBus.on('redteam:freeze', () => {
      addEvent({
        type: 'critical',
        title: t('redteam.timeline.event.critical.title', { defaultValue: 'Instrument Freeze' }),
        message: t('redteam.timeline.event.critical.message', { defaultValue: 'CRITICAL: Robotic arms frozen via unauthorized command.' }),
        timestamp: new Date().toLocaleTimeString(),
        icon: AlertCircle,
        color: 'text-red-600 font-bold'
      });
    }));

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const addEvent = (event) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() + Math.random() }]);
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 opacity-40 border border-dashed border-gray-800 rounded-lg gap-2">
        <Clock size={32} />
        <span className="text-[10px] uppercase tracking-[0.3em]">{t('redteam.timeline.empty')}</span>
        <div className="flex items-center gap-2 text-[9px] font-mono mt-2">
          <span className={historyLoaded ? 'text-emerald-400' : 'text-gray-500'}>
            {historyLoaded ? 'history loaded' : 'loading history...'}
          </span>
          <span className="text-gray-600">·</span>
          <span className={streamConnected ? 'text-emerald-400' : 'text-gray-500'}>
            <Radio size={9} className="inline mr-1" />
            {streamConnected ? 'live stream: connected' : 'live stream: offline'}
          </span>
        </div>
        <span className="text-[9px] text-gray-600 mt-1">
          No campaign artefact found in research_archive/data/raw/
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <FlaskConical size={12} /> {t('redteam.timeline.title')}
            <span className="text-gray-700">·</span>
            <Radio size={10} className={streamConnected ? 'text-emerald-400' : 'text-gray-600'} />
            <span className={streamConnected ? 'text-emerald-400' : 'text-gray-600'}>
              {streamConnected ? 'LIVE' : 'OFFLINE'}
            </span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500">{events.length} events</span>
        </span>
        <button
            onClick={() => setEvents([])}
            className="text-[9px] text-gray-600 hover:text-white transition-colors uppercase font-mono"
        >
            {t('redteam.timeline.btn.clear')}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {events.map((event, i) => {
          var clickable = !!event.sourceFile;
          var isSelected = clickable && event.sourceFile === selectedSourceFile;
          return (
            <div key={event.id} className="relative pl-6 animate-in slide-in-from-left duration-300">
              {/* Thread line */}
              {i < events.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-[-12px] w-px bg-gray-800" />
              )}

              {/* Icon/Dot */}
              <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-black border-2 flex items-center justify-center z-10
                ${event.type === 'medical' ? 'border-blue-500/50' :
                  event.type === 'cyber' ? 'border-orange-500/50' :
                  'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
                <event.icon size={8} className={event.color} />
              </div>

              {clickable ? (
                <button
                  type="button"
                  onClick={function() { setSelectedSourceFile(event.sourceFile); }}
                  className={
                    'w-full text-left bg-[#0a0a0a] border rounded p-2 transition-colors cursor-pointer ' +
                    (isSelected
                      ? 'border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'border-white/5 hover:border-emerald-500/40')
                  }
                  title={'View raw artefact · ' + event.sourceFile}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={'text-[10px] font-bold uppercase tracking-wider ' + event.color}>
                      {event.title}
                    </span>
                    <span className="text-[9px] text-gray-600 font-mono">{event.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">
                    {event.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                    <FileJson size={9} />
                    <span className="truncate">{event.sourceFile}</span>
                  </div>
                </button>
              ) : (
                <div className="bg-[#0a0a0a] border border-white/5 rounded p-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className={'text-[10px] font-bold uppercase tracking-wider ' + event.color}>
                      {event.title}
                    </span>
                    <span className="text-[9px] text-gray-600 font-mono">{event.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">
                    {event.message}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail drawer */}
      {selectedSourceFile && (
        <ArtefactDrawer
          sourceFile={selectedSourceFile}
          loading={detailLoading}
          error={detailError}
          detail={detail}
          onClose={function() { setSelectedSourceFile(null); }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail drawer — fixed right-hand panel, lazy-loads the full raw artefact
// ---------------------------------------------------------------------------
function ArtefactDrawer(props) {
  var sourceFile = props.sourceFile;
  var loading = props.loading;
  var error = props.error;
  var detail = props.detail;
  var onClose = props.onClose;

  var raw = detail && detail.raw;
  var summary = detail && detail.summary;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className="relative ml-auto h-full w-full max-w-2xl bg-[#05070a] border-l border-emerald-500/30 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 border-b border-white/10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
              <FileJson size={11} />
              <span>Artefact</span>
              {summary && summary.channel ? (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400">{summary.channel}</span>
                </>
              ) : null}
            </div>
            <div className="text-sm font-mono text-white truncate mt-1" title={sourceFile}>
              {sourceFile}
            </div>
            {summary && summary.title ? (
              <div className="text-[11px] text-gray-300 mt-1 italic">{summary.title}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <Loader2 size={12} className="animate-spin" />
              loading artefact...
            </div>
          )}
          {error && (
            <div className="text-xs text-red-400 font-mono border border-red-500/30 bg-red-500/10 rounded p-2">
              error: {error}
            </div>
          )}

          {!loading && !error && raw && (
            <>
              {/* Fast-glance KPIs for campaign files */}
              {raw.aggregate && (
                <div className="grid grid-cols-2 gap-2">
                  <Kpi
                    label="ASR"
                    value={
                      typeof raw.aggregate.violation_rate === 'number'
                        ? (raw.aggregate.violation_rate * 100).toFixed(2) + '%'
                        : '—'
                    }
                  />
                  <Kpi
                    label="Violations"
                    value={
                      (raw.aggregate.total_violations != null ? raw.aggregate.total_violations : '—')
                        + ' / '
                        + (raw.aggregate.total_trials != null ? raw.aggregate.total_trials : '—')
                    }
                  />
                  {raw.aggregate.wilson_ci_95 && (
                    <Kpi
                      label="Wilson CI 95%"
                      value={
                        '[' + (raw.aggregate.wilson_ci_95.lower != null ? Number(raw.aggregate.wilson_ci_95.lower).toFixed(3) : '?')
                        + ', '
                        + (raw.aggregate.wilson_ci_95.upper != null ? Number(raw.aggregate.wilson_ci_95.upper).toFixed(3) : '?')
                        + ']'
                      }
                    />
                  )}
                  {raw.separation_score && (
                    <Kpi
                      label="Separation"
                      value={
                        (raw.separation_score.sep_score != null ? Number(raw.separation_score.sep_score).toFixed(3) : '—')
                      }
                      hint={raw.separation_score.interpretation}
                    />
                  )}
                </div>
              )}

              {/* Per-chain table (campaign) */}
              {Array.isArray(raw.per_chain) && raw.per_chain.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                    Per chain ({raw.per_chain.length})
                  </div>
                  <div className="border border-white/10 rounded overflow-hidden">
                    <table className="w-full text-[10px] font-mono">
                      <thead className="bg-white/5">
                        <tr className="text-left text-gray-400">
                          <th className="p-1.5">chain_id</th>
                          <th className="p-1.5">attack_type</th>
                          <th className="p-1.5 text-right">n</th>
                          <th className="p-1.5 text-right">ASR</th>
                          <th className="p-1.5 text-right">sep</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raw.per_chain.slice(0, 50).map(function(pc, idx) {
                          var vr = typeof pc.violation_rate === 'number' ? (pc.violation_rate * 100).toFixed(1) + '%' : '—';
                          var sep = typeof pc.sep_score === 'number' ? pc.sep_score.toFixed(2) : '—';
                          return (
                            <tr key={idx} className="border-t border-white/5 text-gray-300">
                              <td className="p-1.5 truncate max-w-[120px]" title={pc.chain_id}>{pc.chain_id || idx}</td>
                              <td className="p-1.5 text-gray-400">{pc.attack_type || '—'}</td>
                              <td className="p-1.5 text-right">{pc.n_trials != null ? pc.n_trials : '—'}</td>
                              <td className="p-1.5 text-right">{vr}</td>
                              <td className="p-1.5 text-right">{sep}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {raw.per_chain.length > 50 && (
                      <div className="text-[9px] text-gray-500 italic p-1.5 border-t border-white/5">
                        + {raw.per_chain.length - 50} more (see raw JSON below)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recette runs */}
              {Array.isArray(raw.runs) && raw.runs.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                    Runs ({raw.runs.length})
                  </div>
                  <div className="space-y-1">
                    {raw.runs.slice(0, 20).map(function(r, idx) {
                      return (
                        <div key={idx} className="border border-white/10 rounded p-2 text-[10px] font-mono text-gray-300">
                          <div className="flex justify-between">
                            <span className="text-gray-400">{r.name || r.id || 'run ' + idx}</span>
                            <span className={r.verdict === 'PASS' || r.verdict === 'OK' ? 'text-emerald-400' : 'text-red-400'}>
                              {r.verdict || r.status || ''}
                            </span>
                          </div>
                          {r.message && <div className="text-gray-500 italic mt-0.5">{r.message}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full raw JSON (collapsible via details/summary) */}
              <details className="border border-white/10 rounded">
                <summary className="text-[10px] font-mono uppercase tracking-widest text-gray-400 p-2 cursor-pointer hover:text-white">
                  Raw JSON
                </summary>
                <pre className="text-[10px] font-mono text-gray-300 p-2 overflow-x-auto max-h-[50vh] whitespace-pre-wrap break-words">
{JSON.stringify(raw, null, 2)}
                </pre>
              </details>

              {/* File footprint */}
              {detail && (
                <div className="text-[9px] font-mono text-gray-600 pt-2 border-t border-white/5">
                  {detail.size_bytes != null ? detail.size_bytes + ' bytes · ' : ''}
                  {detail.modified != null ? 'modified ' + new Date(detail.modified * 1000).toLocaleString() : ''}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi(props) {
  return (
    <div className="border border-white/10 rounded p-2 bg-white/5">
      <div className="text-[9px] font-mono uppercase tracking-widest text-gray-500">{props.label}</div>
      <div className="text-sm font-mono text-white mt-0.5">{props.value}</div>
      {props.hint ? <div className="text-[9px] text-gray-400 italic mt-0.5 leading-tight">{props.hint}</div> : null}
    </div>
  );
}
