import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Loader2, Zap, Target, Database, Hash, AlertCircle
} from 'lucide-react';

/* Hybrid RAG search panel — dense + exact-id boost + optional rerank.
   Backed by POST /api/rag/hybrid-search (backend rag_retrieval.hybrid_search). */

function scoreLabel(hit) {
  if (hit.rerank_score !== null && hit.rerank_score !== undefined) {
    return 'rerank ' + hit.rerank_score.toFixed(3);
  }
  if (hit.rrf_score !== null && hit.rrf_score !== undefined) {
    return 'rrf ' + hit.rrf_score.toFixed(4);
  }
  return '-';
}

function isExactMatch(hit) {
  return typeof hit.match === 'string' && hit.match.indexOf('exact_id') !== -1;
}

export default function RagSemanticSearch(props) {
  var { t } = useTranslation();
  var collection = props.collection || 'aegis_corpus';

  var [query, setQuery] = useState('');
  var [hits, setHits] = useState([]);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var [reranker, setReranker] = useState(null);
  var [searched, setSearched] = useState(false);

  var runSearch = async function () {
    var q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    var body = { query: q, limit: 10 };
    if (collection === 'multi') {
      body.multi = true;
    } else {
      body.collection = collection;
    }
    try {
      var resp = await fetch('/api/rag/hybrid-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (resp.ok) {
        var data = await resp.json();
        setHits(data.hits || []);
        setReranker(data.reranker || null);
      } else {
        var err = await resp.json().catch(function () { return {}; });
        setError(err.detail || t('redteam.view.rag.searchFailed'));
        setHits([]);
      }
    } catch (e) {
      setError(t('redteam.view.rag.connError'));
      setHits([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  var onKeyDown = function (e) {
    if (e.key === 'Enter') runSearch();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      {/* search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={function (e) { setQuery(e.target.value); }}
            onKeyDown={onKeyDown}
            placeholder={t('redteam.view.rag.semanticPlaceholder')}
            className="w-full pl-8 pr-3 py-2 bg-neutral-950/50 border border-neutral-800 rounded text-sm text-neutral-300 font-mono placeholder-neutral-400 focus:border-red-900/50 focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={runSearch}
          disabled={loading || !query.trim()}
          className="px-4 py-2 rounded bg-red-600/80 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {t('redteam.view.rag.searchBtn')}
        </button>
      </div>

      {/* reranker status */}
      {reranker && (
        <div className="mt-2 text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
          <Zap size={10} className={reranker.state === 'ready' ? 'text-green-500' : 'text-neutral-400'} />
          {reranker.state === 'ready'
            ? t('redteam.view.rag.rerankerActive')
            : t('redteam.view.rag.rerankerFallback')}
        </div>
      )}

      {/* error */}
      {error && (
        <div className="mt-3 p-2 rounded flex items-center gap-2 text-xs font-mono border bg-red-500/10 border-red-500/30 text-red-400">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* results */}
      <div className="flex-1 overflow-auto mt-3 space-y-2">
        {loading ? (
          <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-sm">
            <Loader2 className="animate-spin mr-2" size={16} /> {t('redteam.view.rag.searching')}
          </div>
        ) : hits.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-700 font-mono text-sm text-center px-4">
            {searched ? t('redteam.view.rag.noHits') : t('redteam.view.rag.searchHint')}
          </div>
        ) : (
          hits.map(function (hit, idx) {
            var exact = isExactMatch(hit);
            return (
              <div
                key={hit.id || idx}
                className={'p-3 rounded-lg bg-neutral-950/50 border transition-colors ' + (
                  exact ? 'border-green-600/40 hover:border-green-500/60' : 'border-neutral-800 hover:border-neutral-700'
                )}
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 min-w-0">
                    <Hash size={10} /> {idx + 1}
                    <span className="text-neutral-300 truncate">{hit.source}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {exact && (
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] uppercase font-mono flex items-center gap-1">
                        <Target size={8} /> {t('redteam.view.rag.exactMatch')}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[9px] font-mono flex items-center gap-1">
                      <Database size={8} /> {hit.collection_source}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono">
                      {scoreLabel(hit)}
                    </span>
                  </div>
                </div>
                <p className="text-neutral-400 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words max-h-32 overflow-auto">
                  {hit.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
