import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, UploadCloud, Search, Trash2, FileText, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function RagView() {
  var { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/rag/documents');
      if (resp.ok) {
        const data = await resp.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFeedback({ type: 'info', message: `Uploading ${file.name}...` });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      if (resp.ok) {
        setFeedback({ type: 'success', message: `${file.name} indexed successfully!` });
        fetchDocuments();
      } else {
        const err = await resp.json();
        setFeedback({ type: 'error', message: err.detail || "Upload failed" });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Connection error" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete ${filename} from Vector DB?`)) return;

    try {
      const resp = await fetch(`/api/rag/documents/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      if (resp.ok) {
        setFeedback({ type: 'success', message: `Deleted ${filename}` });
        fetchDocuments();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Delete failed" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
      <header className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="text-red-500 animate-pulse" /> {t('redteam.view.rag.title')}
          </h2>
          <p className="text-neutral-400 text-sm mt-1">{t('redteam.view.rag.desc')}</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchDocuments}
             className="p-2 text-neutral-400 hover:text-white transition-colors"
             title="Refresh Index"
           >
             <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
           </button>
        </div>
      </header>
      
      {feedback && (
        <div className={`p-3 rounded flex items-center gap-2 text-sm font-mono border ${
          feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
          feedback.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
          'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : 
           feedback.type === 'error' ? <AlertCircle size={16} /> : 
           <Loader2 size={16} className="animate-spin" />}
          {feedback.message}
          <button className="ml-auto opacity-50 hover:opacity-100" onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Management Table */}
        <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <FileText size={18} className="text-neutral-400" /> Indexed Documents
            </h3>
            <span className="text-xs font-mono text-neutral-500 uppercase">
              Total: {documents.length} Units
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            {loading && documents.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-neutral-600 font-mono">
                  <Loader2 className="animate-spin mb-2" />
                  Scanning Vector DB...
               </div>
            ) : documents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-sm border border-dashed border-neutral-800 rounded">
                No documents found in the 'aegis_corpus' collection.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-neutral-500 text-xs uppercase font-mono border-b border-neutral-800">
                    <th className="pb-3 px-2">Filename</th>
                    <th className="pb-3 px-2">Format</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-neutral-800/50 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-2 text-neutral-300 max-w-[300px] truncate" title={doc.filename}>
                        {doc.filename}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400 uppercase">
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button 
                          onClick={() => handleDelete(doc.filename)}
                          className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Right Column: Uploader */}
        <div className="lg:col-span-1 border border-neutral-800 bg-neutral-900/50 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <UploadCloud size={18} className="text-neutral-400" /> Document Parser
          </h3>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden" 
            accept=".pdf,.txt,.md"
          />
          
          <div 
            onClick={() => !uploading && fileInputRef.current.click()}
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded transition-all cursor-pointer relative overflow-hidden ${
              uploading 
                ? 'border-neutral-800 bg-neutral-950/20 cursor-wait' 
                : 'border-neutral-800 bg-neutral-950/50 hover:border-red-900/50 hover:bg-red-900/5 group'
            }`}
          >
             <UploadCloud className={`mb-4 transition-colors ${uploading ? 'text-neutral-700 animate-bounce' : 'text-neutral-600 group-hover:text-red-500'}`} size={48} />
             <p className="text-neutral-400 text-sm font-medium text-center px-4">
               {uploading ? 'Processing vector fragments...' : 'Drag and Drop academic PDFs or Markdown to inject into the Malicious RAG.'}
             </p>
             
             {uploading && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-red-900/20">
                   <div className="h-full bg-red-600 animate-progress"></div>
                </div>
             )}
          </div>

          <div className="mt-4 p-4 bg-neutral-950/50 rounded border border-neutral-800 text-[11px] font-mono text-neutral-500 space-y-2">
             <div className="flex justify-between">
                <span>Vector Store:</span>
                <span className="text-red-900">CHROMA_DB</span>
             </div>
             <div className="flex justify-between">
                <span>Distance Metric:</span>
                <span className="text-neutral-400">COSINE_SIM</span>
             </div>
             <div className="flex justify-between">
                <span>Collection:</span>
                <span className="text-neutral-400">aegis_corpus</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
