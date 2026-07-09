import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, Loader2, CheckCircle2, AlertTriangle, RefreshCw, Trash2, AlertCircle
} from 'lucide-react';

/* RAG maintenance panel — integrity check, per-doc re-index, safe collection reset.
   Backed by POST /api/rag/integrity, /api/rag/reindex, /api/rag/reset. */

export default function RagMaintenance(props) {
  var { t } = useTranslation();
  var collectionsList = props.collections || [];
  var onChanged = props.onChanged || function () {};

  var [collection, setCollection] = useState('aegis_corpus');
  var [minChunks, setMinChunks] = useState(3);
  var [report, setReport] = useState(null);
  var [loading, setLoading] = useState(false);
  var [busySource, setBusySource] = useState(null);
  var [feedback, setFeedback] = useState(null);

  var runIntegrity = async function () {
    setLoading(true);
    setFeedback(null);
    try {
      var resp = await fetch('/api/rag/integrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collection, min_chunks: Number(minChunks) }),
      });
      if (resp.ok) {
        setReport(await resp.json());
      } else {
        var err = await resp.json().catch(function () { return {}; });
        setFeedback({ type: 'error', message: err.detail || t('redteam.view.rag.checkFailed') });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: t('redteam.view.rag.connError') });
    } finally {
      setLoading(false);
    }
  };

  var doReindex = async function (source) {
    setBusySource(source);
    setFeedback(null);
    try {
      var resp = await fetch('/api/rag/reindex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collection, source: source }),
      });
      var data = await resp.json().catch(function () { return {}; });
      if (resp.ok) {
        setFeedback({ type: 'success', message: source + ' ' + t('redteam.view.rag.reindexed') + ' (' + data.chunks + ')' });
        runIntegrity();
        onChanged();
      } else {
        setFeedback({ type: 'error', message: data.detail || t('redteam.view.rag.reindexUnavailable') });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: t('redteam.view.rag.connError') });
    } finally {
      setBusySource(null);
    }
  };

  var doReset = async function () {
    if (!report) return;
    var count = report.total_chunks || 0;
    if (!window.confirm(t('redteam.view.rag.resetConfirm') + ' ' + collection + ' (' + count + ')?')) return;
    setLoading(true);
    setFeedback(null);
    try {
      var resp = await fetch('/api/rag/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collection, confirm_count: count }),
      });
      var data = await resp.json().catch(function () { return {}; });
      if (resp.ok) {
        setFeedback({ type: 'success', message: t('redteam.view.rag.resetDone') + ' (' + data.deleted_chunks + ')' });
        setReport(null);
        onChanged();
      } else {
        setFeedback({ type: 'error', message: data.detail || t('redteam.view.rag.resetFailed') });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: t('redteam.view.rag.connError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      {/* controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={collection}
          onChange={function (e) { setCollection(e.target.value); setReport(null); }}
          className="bg-neutral-950/50 border border-neutral-800 rounded px-2 py-1.5 text-xs text-neutral-300 font-mono focus:border-red-900/50 focus:outline-none"
        >
          <option value="aegis_corpus">aegis_corpus</option>
          {collectionsList.map(function (c) {
            if (c.name === 'aegis_corpus') return null;
            return <option key={c.name} value={c.name}>{c.name}</option>;
          })}
        </select>
        <label className="text-[10px] font-mono uppercase text-neutral-400">
          {t('redteam.view.rag.minChunks')}
        </label>
        <input
          type="number"
          min="1"
          value={minChunks}
          onChange={function (e) { setMinChunks(e.target.value); }}
          className="w-16 bg-neutral-950/50 border border-neutral-800 rounded px-2 py-1.5 text-xs text-neutral-300 font-mono focus:border-red-900/50 focus:outline-none"
        />
        <button
          onClick={runIntegrity}
          disabled={loading}
          className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
          {t('redteam.view.rag.checkIntegrity')}
        </button>
      </div>

      {feedback && (
        <div className={'mt-3 p-2 rounded flex items-center gap-2 text-xs font-mono border ' + (
          feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                      : 'bg-red-500/10 border-red-500/30 text-red-400'
        )}>
          {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {feedback.message}
        </div>
      )}

      {/* report */}
      {report && (
        <div className="mt-3 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono">
            <span className="text-neutral-300">
              {report.total_docs} {t('redteam.view.rag.docs')} / {report.total_chunks} {t('redteam.view.rag.chunks')}
            </span>
            <span className={report.unhealthy_count > 0 ? 'text-amber-400' : 'text-green-400'}>
              {(report.total_docs - report.unhealthy_count)}/{report.total_docs} {t('redteam.view.rag.healthy')}
            </span>
          </div>

          <div className="flex-1 overflow-auto mt-2 divide-y divide-neutral-800/50">
            {report.docs.map(function (d) {
              return (
                <div key={d.source} className="flex items-center gap-2 px-2 py-1.5">
                  {d.healthy
                    ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    : <AlertTriangle size={13} className="text-amber-400 shrink-0" />}
                  <span className="flex-1 min-w-0 text-xs font-mono text-neutral-300 truncate">{d.source}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{d.chunk_count}</span>
                  {!d.healthy && (
                    <button
                      onClick={function () { doReindex(d.source); }}
                      disabled={busySource === d.source}
                      className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                      title={t('redteam.view.rag.reindex')}
                    >
                      {busySource === d.source
                        ? <Loader2 size={13} className="animate-spin" />
                        : <RefreshCw size={13} />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* danger zone */}
          <button
            onClick={doReset}
            disabled={loading}
            className="mt-3 px-3 py-2 rounded bg-red-950/40 hover:bg-red-900/40 border border-red-900/40 text-red-400 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} /> {t('redteam.view.rag.resetCollection')} ({report.total_chunks})
          </button>
        </div>
      )}
    </div>
  );
}
