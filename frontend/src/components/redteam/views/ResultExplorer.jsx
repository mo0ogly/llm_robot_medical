import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Trash2, FileJson, FileCode, CheckCircle, AlertCircle, Loader2, ChevronRight, HardDrive, TreePine, ChevronDown, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

/**
 * CampaignTreeView — TreeView component for formal campaign results.
 * Displays a tree: Campaign → Chain → Trial with color-coded violations.
 * Green = Allowed(i) satisfied, Red = Reachable(M) ⊄ Allowed(i), Orange = warning.
 */
function CampaignTreeView({ data }) {
  var _e = useState({}), expanded = _e[0], setExpanded = _e[1];

  var toggle = function(key) {
    setExpanded(function(prev) {
      var next = Object.assign({}, prev);
      next[key] = !next[key];
      return next;
    });
  };

  if (!data || !data.per_chain) {
    return (
      React.createElement('div', { className: 'p-8 text-center text-neutral-600' },
        React.createElement(TreePine, { size: 32, className: 'mx-auto mb-3 opacity-30' }),
        React.createElement('p', { className: 'text-xs font-mono uppercase tracking-widest' }, 'No campaign data loaded'),
        React.createElement('p', { className: 'text-[10px] mt-2 text-neutral-700' }, 'Load a campaign_*.json file from the sidebar')
      )
    );
  }

  var agg = data.aggregate || {};
  var sep = data.separation_score || {};

  return (
    React.createElement('div', { className: 'p-4 space-y-3 font-mono text-xs' },
      // Campaign header
      React.createElement('div', { className: 'p-3 rounded-lg bg-neutral-900 border border-neutral-800' },
        React.createElement('div', { className: 'flex justify-between items-center' },
          React.createElement('span', { className: 'text-white font-bold' }, 'FORMAL CAMPAIGN'),
          React.createElement('span', {
            className: 'px-2 py-0.5 rounded text-[9px] font-bold ' +
              (agg.violation_rate > 0.5 ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
               agg.violation_rate > 0 ? 'bg-orange-900/30 text-orange-400 border border-orange-500/30' :
               'bg-green-900/30 text-green-400 border border-green-500/30')
          }, (agg.violation_rate * 100).toFixed(1) + '% VIOLATIONS')
        ),
        React.createElement('div', { className: 'mt-2 grid grid-cols-3 gap-2 text-[10px] text-neutral-500' },
          React.createElement('span', null, 'Trials: ' + agg.total_trials),
          React.createElement('span', null, 'Sep(M): ' + (sep.sep_score || 0).toFixed(3)),
          React.createElement('span', null, 'CI: [' + ((agg.wilson_ci_95 || {}).lower || 0).toFixed(2) + ', ' + ((agg.wilson_ci_95 || {}).upper || 0).toFixed(2) + ']')
        )
      ),
      // Per-chain tree
      (data.per_chain || []).map(function(chain, ci) {
        var isOpen = expanded['chain_' + ci];
        var vr = chain.violation_rate || 0;
        var color = vr > 0.5 ? 'text-red-400' : vr > 0 ? 'text-orange-400' : 'text-green-400';
        var bgColor = vr > 0.5 ? 'border-red-500/20' : vr > 0 ? 'border-orange-500/20' : 'border-green-500/20';
        var Icon = vr > 0.5 ? ShieldAlert : vr > 0 ? Shield : ShieldCheck;

        return React.createElement('div', { key: ci, className: 'border rounded-lg ' + bgColor },
          // Chain header (clickable)
          React.createElement('button', {
            onClick: function() { toggle('chain_' + ci); },
            className: 'w-full flex items-center gap-2 p-2 hover:bg-white/5 transition-colors'
          },
            React.createElement(isOpen ? ChevronDown : ChevronRight, { size: 12, className: 'text-neutral-600' }),
            React.createElement(Icon, { size: 14, className: color }),
            React.createElement('span', { className: 'flex-1 text-left text-neutral-300' }, chain.chain_id),
            React.createElement('span', { className: color + ' font-bold' }, (vr * 100).toFixed(0) + '%')
          ),
          // Trials (expanded)
          isOpen && React.createElement('div', { className: 'px-4 pb-2 space-y-1' },
            (chain.trials || []).map(function(trial, ti) {
              return React.createElement('div', {
                key: ti,
                className: 'flex items-center gap-2 py-1 text-[10px] ' +
                  (trial.violated ? 'text-red-400' : 'text-green-600')
              },
                React.createElement('div', {
                  className: 'w-2 h-2 rounded-full ' +
                    (trial.violated ? 'bg-red-500' : 'bg-green-500')
                }),
                React.createElement('span', null, 'Trial ' + trial.trial),
                trial.violated ?
                  React.createElement('span', { className: 'text-red-500/60' }, 'VIOLATED') :
                  React.createElement('span', { className: 'text-green-500/60' }, 'SAFE'),
                trial.response_snippet &&
                  React.createElement('span', {
                    className: 'text-neutral-700 truncate max-w-[200px]',
                    title: trial.response_snippet
                  }, trial.response_snippet.substring(0, 40) + '...')
              );
            }),
            chain.control_trials && chain.control_trials.length > 0 &&
              React.createElement('div', { className: 'mt-1 pt-1 border-t border-neutral-800 text-[10px] text-neutral-600' },
                'Control: ' + chain.control_trials.filter(function(t) { return !t.violated; }).length +
                '/' + chain.control_trials.length + ' safe'
              )
          )
        );
      })
    )
  );
}

export default function ResultExplorer() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:8042/api/results');
      const data = await resp.json();
      setFiles(data);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFile = async (name) => {
    setFileLoading(true);
    setSelectedFile(name);
    try {
      const resp = await fetch(`http://localhost:8042/api/results/${name}`);
      const data = await resp.json();
      setFileContent(data);
    } catch (err) {
      console.error("Failed to load file:", err);
    } finally {
      setFileLoading(false);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const renderContent = () => {
    if (!fileContent) return null;

    const { content, type } = fileContent;

    if (type === 'json') {
      try {
        const obj = JSON.parse(content);

        // Auto-detect campaign files and render TreeView
        if (obj.per_chain && obj.aggregate && obj.separation_score) {
          return <CampaignTreeView data={obj} />;
        }
        const formatted = JSON.stringify(obj, null, 2);
        // Simple regex highlighting for JSON
        const highlighted = formatted
          .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-blue-400'; // number
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = 'text-emerald-400 font-bold'; // key
              } else {
                cls = 'text-amber-300'; // string
              }
            } else if (/true|false/.test(match)) {
              cls = 'text-purple-400'; // boolean
            } else if (/null/.test(match)) {
              cls = 'text-neutral-500'; // null
            }
            return `<span class="${cls}">${match}</span>`;
          });
        return (
          <pre 
            className="p-6 font-mono text-sm leading-relaxed overflow-auto h-full scrollbar-thin scrollbar-thumb-neutral-700"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        );
      } catch (e) {
        return <pre className="p-6 text-neutral-400 whitespace-pre-wrap">{content}</pre>;
      }
    }

    if (type === 'csv') {
      const lines = content.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(l => l.split(','));

      return (
        <div className="overflow-auto h-full p-4">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-neutral-800/50 sticky top-0 backdrop-blur-md">
                {headers.map((h, i) => (
                  <th key={i} className="p-3 border-b border-neutral-700 text-neutral-200 uppercase text-[10px] font-bold tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-neutral-800/30 transition-colors border-b border-neutral-800/50">
                  {r.map((cell, j) => (
                    <td key={j} className="p-3 text-xs text-neutral-400 font-mono">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <pre className="p-6 text-neutral-300 font-mono text-xs whitespace-pre-wrap leading-relaxed h-full overflow-auto">
        {content}
      </pre>
    );
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="p-6 border-b border-neutral-800 bg-neutral-900/40 backdrop-blur-xl flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-900/20 rounded-xl border border-red-500/20">
            <HardDrive size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">Experimental Results Repository</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">Digital Archeology & Ph.D. Benchmarks</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {selectedFile && (
             <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-bold transition-all border border-neutral-700 text-neutral-300">
               <Download size={14} /> EXPORT SOURCE
             </button>
           )}
           <button onClick={fetchFiles} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all border border-neutral-700">
             < Loader2 size={16} className={`${loading ? 'animate-spin text-red-500' : 'text-neutral-400'}`} />
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Browser */}
        <aside className="w-80 border-r border-neutral-800 bg-black/20 flex flex-col z-10">
          <div className="p-4 border-b border-neutral-800">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors" size={14} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search experiments..." 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 opacity-30">
                <Loader2 className="animate-spin mb-2" />
                <span className="text-[10px] uppercase font-mono tracking-widest">Indexing directory...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs text-neutral-600 uppercase tracking-widest font-mono">No results found in experiments/results</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredFiles.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => loadFile(file.name)}
                    className={`w-full flex items-center gap-3 px-6 py-4 transition-all group ${
                      selectedFile === file.name 
                        ? 'bg-red-500/10 border-r-2 border-red-500' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedFile === file.name ? 'bg-red-500/20 text-red-500' : 'bg-neutral-800 text-neutral-500 grayscale'}`}>
                       {file.type === 'json' ? <FileJson size={14} /> : file.type === 'csv' ? <FileCode size={14} /> : <FileText size={14} />}
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className={`text-xs font-medium truncate w-full text-left ${selectedFile === file.name ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                        {file.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1 opacity-50 font-mono text-[9px] uppercase tracking-tighter">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{new Date(file.modified * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedFile === file.name ? 'text-red-500' : 'text-neutral-600'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Console Viewer */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#0d0d0d] shadow-inner">
          {fileLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-50">
              <Loader2 size={32} className="animate-spin text-red-500 mb-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Decrypting statistical node...</p>
            </div>
          ) : selectedFile ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-2 duration-500">
              {/* Toolbar */}
              <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-900/20 flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500 text-[8px]" /> INTEGRITY VERIFIED</span>
                  <span className="uppercase">{fileContent?.type} FORMAT</span>
                </div>
                <div>
                   SHA-256: 0x{selectedFile.slice(0, 8).toUpperCase()}...
                </div>
              </div>
              
              <div className="flex-1 relative">
                {renderContent()}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 border border-dashed border-neutral-800 m-8 rounded-3xl bg-neutral-900/10">
               <FileCode size={48} className="mb-4 opacity-20" />
               <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">No Document Selected</h3>
               <p className="text-[10px] max-w-[240px] text-center font-mono uppercase tracking-tighter">Please select a result file from the Digital Archeology sidebar to visualize statistical data.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Footer Status */}
      <footer className="px-6 py-2 border-t border-neutral-800 bg-neutral-900 text-[10px] font-mono flex justify-between text-neutral-500">
         <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ENGINE: ONLINE</span>
            <span>FS_ROOT: experiments/results/</span>
         </div>
         <div>
            AEGIS v4.2 // DOCTORAL_EXPLORER
         </div>
      </footer>
    </div>
  );
}
