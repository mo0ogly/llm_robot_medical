import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Database, UploadCloud, Search, Trash2, FileText, CheckCircle2,
  AlertCircle, Loader2, RefreshCw, Eye, ChevronRight, File,
  Hash, Layers, Zap, Box, X, Filter
} from 'lucide-react';

/* ─────────────── helpers ─────────────── */
function formatBytes(len) {
  if (len < 1024) return len + ' B';
  if (len < 1048576) return (len / 1024).toFixed(1) + ' KB';
  return (len / 1048576).toFixed(1) + ' MB';
}

var TYPE_COLORS = {
  pdf:  'bg-red-500/20 text-red-400 border-red-500/30',
  md:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  txt:  'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
  text: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

var TYPE_ICONS = { pdf: FileText, md: FileText, txt: File, text: File };

/* ─────────────── main component ─────────────── */
export default function RagView() {
  var { t } = useTranslation();

  /* state */
  var [documents, setDocuments] = useState([]);
  var [loading, setLoading] = useState(true);
  var [uploading, setUploading] = useState(false);
  var [feedback, setFeedback] = useState(null);
  var [rightTab, setRightTab] = useState('parser');
  var [searchTerm, setSearchTerm] = useState('');
  var [selectedDoc, setSelectedDoc] = useState(null);
  var [chunks, setChunks] = useState([]);
  var [loadingChunks, setLoadingChunks] = useState(false);
  var fileInputRef = useRef(null);

  /* ── API calls ── */
  var fetchDocuments = async function () {
    setLoading(true);
    try {
      var resp = await fetch('/api/rag/documents');
      if (resp.ok) {
        var data = await resp.json();
        setDocuments(data);
      }
    } catch (err) {
      /* offline — keep current list */
    } finally {
      setLoading(false);
    }
  };

  var fetchChunks = async function (filename) {
    setLoadingChunks(true);
    try {
      var resp = await fetch('/api/rag/documents/' + encodeURIComponent(filename) + '/chunks');
      if (resp.ok) {
        var data = await resp.json();
        setChunks(data.chunks || []);
      }
    } catch (err) {
      setChunks([]);
    } finally {
      setLoadingChunks(false);
    }
  };

  useEffect(function () { fetchDocuments(); }, []);

  var handleFileUpload = async function (e) {
    var file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFeedback({ type: 'info', message: t('redteam.view.rag.uploading') + ' ' + file.name + '...' });

    var formData = new FormData();
    formData.append('file', file);

    try {
      var resp = await fetch('/api/rag/upload', { method: 'POST', body: formData });
      if (resp.ok) {
        setFeedback({ type: 'success', message: file.name + ' ' + t('redteam.view.rag.indexed') });
        fetchDocuments();
      } else {
        var err = await resp.json();
        setFeedback({ type: 'error', message: err.detail || t('redteam.view.rag.uploadFailed') });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: t('redteam.view.rag.connError') });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  var handleDelete = async function (filename) {
    if (!window.confirm(t('redteam.view.rag.confirmDelete') + ' ' + filename + '?')) return;
    try {
      var resp = await fetch('/api/rag/documents/' + encodeURIComponent(filename), { method: 'DELETE' });
      if (resp.ok) {
        setFeedback({ type: 'success', message: t('redteam.view.rag.deleted') + ' ' + filename });
        fetchDocuments();
        if (selectedDoc && selectedDoc.filename === filename) {
          setSelectedDoc(null);
          setChunks([]);
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: t('redteam.view.rag.deleteFailed') });
    }
  };

  var handleSelectDoc = function (doc) {
    setSelectedDoc(doc);
    fetchChunks(doc.filename);
  };

  /* derived */
  var filteredDocs = documents.filter(function (d) {
    return d.filename.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  });
  var totalChunks = documents.reduce(function (sum, d) { return sum + (d.chunk_count || 0); }, 0);

  /* ─────────── RENDER ─────────── */
  return (
    <div className="space-y-4 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">

      {/* ── HEADER ── */}
      <header className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="text-red-500 animate-pulse" /> {t('redteam.view.rag.title')}
          </h2>
          <p className="text-neutral-400 text-sm mt-1">{t('redteam.view.rag.desc')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* stats badges */}
          <div className="flex gap-2 text-[10px] font-mono uppercase">
            <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
              {documents.length} {t('redteam.view.rag.docs')}
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">
              {totalChunks} {t('redteam.view.rag.chunks')}
            </span>
          </div>
          <button
            onClick={fetchDocuments}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
            title={t('redteam.view.rag.refresh')}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* ── FEEDBACK ── */}
      {feedback && (
        <div className={'p-3 rounded flex items-center gap-2 text-sm font-mono border ' + (
          feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
          feedback.type === 'error'   ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                        'bg-blue-500/10 border-blue-500/30 text-blue-400'
        )}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> :
           feedback.type === 'error'   ? <AlertCircle size={16} /> :
                                         <Loader2 size={16} className="animate-spin" />}
          {feedback.message}
          <button className="ml-auto opacity-50 hover:opacity-100" onClick={function () { setFeedback(null); }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── MAIN GRID : Left detail + Right tabs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">

        {/* ══════ LEFT PANEL : Document Detail / Chunk Inspector (55%) ══════ */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-lg flex flex-col overflow-hidden">
          {selectedDoc ? (
            <>
              {/* doc header */}
              <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <FileText size={20} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{selectedDoc.filename}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Layers size={12} /> {selectedDoc.chunk_count || 0} {t('redteam.view.rag.chunks')}
                    </span>
                    <span className={'px-1.5 py-0.5 rounded border text-[10px] uppercase ' + (TYPE_COLORS[selectedDoc.type] || TYPE_COLORS.text)}>
                      {selectedDoc.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={function () { setSelectedDoc(null); setChunks([]); }}
                  className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* chunk list */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {loadingChunks ? (
                  <div className="h-full flex items-center justify-center text-neutral-600">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    <span className="font-mono text-sm">{t('redteam.view.rag.loadingChunks')}</span>
                  </div>
                ) : chunks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-neutral-600 font-mono text-sm">
                    {t('redteam.view.rag.noChunks')}
                  </div>
                ) : (
                  chunks.map(function (chunk, idx) {
                    return (
                      <div key={chunk.id} className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                            <Hash size={10} /> {t('redteam.view.rag.chunk')} {idx + 1}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-neutral-600">{formatBytes(chunk.length)}</span>
                            {chunk.has_embedding && (
                              <span className="px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-1">
                                <Zap size={8} /> {t('redteam.view.rag.embedded')}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-neutral-400 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
                          {chunk.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-600 p-8">
              <Box size={48} className="mb-4 opacity-30" />
              <p className="font-mono text-sm text-center">{t('redteam.view.rag.selectDoc')}</p>
              <p className="text-xs text-neutral-700 mt-1 text-center">{t('redteam.view.rag.selectDocHint')}</p>
            </div>
          )}
        </div>

        {/* ══════ RIGHT PANEL : Tabbed (45%) ══════ */}
        <div className="lg:col-span-5 flex flex-col overflow-hidden">

          {/* tab bar */}
          <div className="flex border-b border-neutral-800 mb-0">
            <button
              onClick={function () { setRightTab('parser'); }}
              className={'flex-1 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ' + (
                rightTab === 'parser'
                  ? 'border-red-500 text-red-400 bg-red-500/5'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              )}
            >
              <UploadCloud size={14} className="inline mr-1.5 -mt-0.5" />
              {t('redteam.view.rag.tabParser')}
            </button>
            <button
              onClick={function () { setRightTab('files'); }}
              className={'flex-1 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ' + (
                rightTab === 'files'
                  ? 'border-red-500 text-red-400 bg-red-500/5'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              )}
            >
              <Layers size={14} className="inline mr-1.5 -mt-0.5" />
              {t('redteam.view.rag.tabIndexed')}
            </button>
          </div>

          {/* tab content */}
          <div className="flex-1 overflow-hidden bg-neutral-900/50 border border-neutral-800 border-t-0 rounded-b-lg flex flex-col">

            {/* ── TAB 1 : Doc Parser ── */}
            {rightTab === 'parser' && (
              <div className="flex-1 flex flex-col p-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.txt,.md"
                />

                {/* drop zone */}
                <div
                  onClick={function () { if (!uploading) fileInputRef.current.click(); }}
                  className={'flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all cursor-pointer relative overflow-hidden min-h-[200px] ' + (
                    uploading
                      ? 'border-neutral-800 bg-neutral-950/20 cursor-wait'
                      : 'border-neutral-800 bg-neutral-950/50 hover:border-red-900/50 hover:bg-red-900/5 group'
                  )}
                >
                  <UploadCloud
                    className={'mb-3 transition-colors ' + (uploading ? 'text-neutral-700 animate-bounce' : 'text-neutral-600 group-hover:text-red-500')}
                    size={40}
                  />
                  <p className="text-neutral-400 text-sm font-medium text-center px-4">
                    {uploading ? t('redteam.view.rag.processing') : t('redteam.view.rag.dropzone')}
                  </p>
                  <p className="text-neutral-600 text-[11px] mt-2 font-mono">PDF / TXT / MD</p>

                  {uploading && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-900/20">
                      <div className="h-full bg-red-600 animate-progress" />
                    </div>
                  )}
                </div>

                {/* ChromaDB stats */}
                <div className="mt-4 p-4 bg-neutral-950/50 rounded-lg border border-neutral-800 text-[11px] font-mono text-neutral-500 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-600 mb-2">{t('redteam.view.rag.vectorConfig')}</div>
                  <div className="flex justify-between">
                    <span>Vector Store</span>
                    <span className="text-red-400">CHROMA_DB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Metric</span>
                    <span className="text-neutral-400">COSINE_SIM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collection</span>
                    <span className="text-neutral-400">aegis_corpus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chunk Size</span>
                    <span className="text-neutral-400">1000 / 800 overlap</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Embeddings</span>
                    <span className="text-neutral-400">all-MiniLM-L6-v2</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2 : Indexed Documents ── */}
            {rightTab === 'files' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* search bar */}
                <div className="p-3 border-b border-neutral-800">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={function (e) { setSearchTerm(e.target.value); }}
                      placeholder={t('redteam.view.rag.searchPlaceholder')}
                      className="w-full pl-8 pr-3 py-2 bg-neutral-950/50 border border-neutral-800 rounded text-sm text-neutral-300 font-mono placeholder-neutral-700 focus:border-red-900/50 focus:outline-none transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={function () { setSearchTerm(''); }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* file list */}
                <div className="flex-1 overflow-auto">
                  {loading && documents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-sm">
                      <Loader2 className="animate-spin mb-2" />
                      {t('redteam.view.rag.scanning')}
                    </div>
                  ) : filteredDocs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-700 font-mono text-sm p-4 text-center">
                      {searchTerm ? t('redteam.view.rag.noResults') : t('redteam.view.rag.emptyCollection')}
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-800/50">
                      {filteredDocs.map(function (doc) {
                        var isSelected = selectedDoc && selectedDoc.filename === doc.filename;
                        var IconComp = TYPE_ICONS[doc.type] || File;
                        var colorClass = TYPE_COLORS[doc.type] || TYPE_COLORS.text;

                        return (
                          <div
                            key={doc.id}
                            onClick={function () { handleSelectDoc(doc); }}
                            className={'flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all group ' + (
                              isSelected
                                ? 'bg-red-500/5 border-l-2 border-l-red-500'
                                : 'hover:bg-white/3 border-l-2 border-l-transparent'
                            )}
                          >
                            {/* icon */}
                            <div className={'p-1.5 rounded ' + (isSelected ? 'bg-red-500/10' : 'bg-neutral-800/50')}>
                              <IconComp size={14} className={isSelected ? 'text-red-400' : 'text-neutral-500'} />
                            </div>

                            {/* name + meta */}
                            <div className="flex-1 min-w-0">
                              <p className={'text-xs font-mono truncate ' + (isSelected ? 'text-white' : 'text-neutral-300')}>
                                {doc.filename}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={'px-1 py-0.5 rounded border text-[9px] uppercase ' + colorClass}>
                                  {doc.type}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-600">
                                  {doc.chunk_count || 0} {t('redteam.view.rag.chunks')}
                                </span>
                              </div>
                            </div>

                            {/* actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={function (e) { e.stopPropagation(); handleDelete(doc.filename); }}
                                className="p-1 text-neutral-600 hover:text-red-500 transition-colors"
                                title={t('redteam.view.rag.delete')}
                              >
                                <Trash2 size={13} />
                              </button>
                              <ChevronRight size={14} className="text-neutral-700" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
