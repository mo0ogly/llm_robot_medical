import { useState, useEffect } from 'react';
import {
  Swords, Play, X, CheckCircle, Save,
  Eye, FileText, Lightbulb, Copy
} from 'lucide-react';
import { renderMarkdown } from './renderMarkdown';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

export default function PayloadEditModal({ isOpen, onClose, onSave, onInsert, initialName, initialBody, initialCategory, initialHelpMd, isNew, t }) {
  var [name, setName] = useState(initialName || '');
  var [body, setBody] = useState(initialBody || '');
  var [category, setCategory] = useState(initialCategory || 'injection');
  var [helpMd, setHelpMd] = useState(initialHelpMd || '');
  var [activeTab, setActiveTab] = useState('edit');
  var [saving, setSaving] = useState(false);
  var [copied, setCopied] = useState(false);
  var { data: _taxonomyFlat } = useFetchWithCache('/api/redteam/taxonomy/flat');
  var taxonomyFlat = _taxonomyFlat || {};
  var [taxPrimary, setTaxPrimary] = useState('');
  var [taxSecondary, setTaxSecondary] = useState([]);
  var [taxSearch, setTaxSearch] = useState('');

  useEffect(function() {
    if (isOpen) {
      setName(initialName || '');
      setBody(initialBody || '');
      setCategory(initialCategory || 'injection');
      setHelpMd(initialHelpMd || '');
      setActiveTab('edit');
      setTaxPrimary('');
      setTaxSecondary([]);
      setTaxSearch('');
    }
  }, [isOpen, initialName, initialBody, initialCategory, initialHelpMd]);

  if (!isOpen) return null;

  var lineCount = (body || '').split('\n').length;
  var charCount = (body || '').length;

  function handleSave() {
    if (!body.trim()) return;
    setSaving(true);
    onSave({ name: name, body: body, category: category, help_md: helpMd }, function() {
      setSaving(false);
      onClose();
    }, function() {
      setSaving(false);
    });
  }

  function handleInsertAndClose() {
    if (onInsert && body.trim()) {
      onInsert(body);
    }
    onClose();
  }

  function handleCopy() {
    navigator.clipboard.writeText(body).then(function() {
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 1500);
    });
  }

  var tabs = [
    { id: 'edit', label: t('redteam.attack.modal.tab_edit'), icon: FileText },
    { id: 'preview', label: t('redteam.attack.modal.tab_preview'), icon: Eye },
    { id: 'help', label: t('redteam.attack.modal.tab_help'), icon: Lightbulb },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-4 bg-neutral-950 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{maxHeight: '90vh'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900 shrink-0">
          <div className="flex items-center gap-3">
            <Swords size={16} className="text-red-500" />
            <span className="font-bold text-sm text-white">
              {isNew ? t('redteam.attack.modal.title_new') : t('redteam.attack.modal.title_edit')}
            </span>
            <span className="text-[10px] text-neutral-600 font-mono">{charCount + ' ' + t('redteam.attack.modal.chars') + ' | ' + lineCount + ' ' + t('redteam.attack.modal.lines')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="p-1.5 rounded text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all" title="Copy">
              {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
            <button onClick={onClose} className="p-1.5 text-neutral-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Meta: Name + Category */}
        <div className="px-5 py-3 border-b border-neutral-800 flex gap-4 items-end shrink-0">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 block">{t('redteam.attack.modal.name_label')}</label>
            <input
              value={name}
              onChange={function(e) { setName(e.target.value); }}
              placeholder={t('redteam.attack.crud.name_placeholder')}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm font-mono text-white placeholder-neutral-700 outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="w-48">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 block">{t('redteam.attack.modal.category_label')}</label>
            <select
              value={category}
              onChange={function(e) { setCategory(e.target.value); }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-red-500 transition-colors"
            >
              <option value="injection">INJECTION</option>
              <option value="rule_bypass">RULE BYPASS</option>
              <option value="prompt_leak">PROMPT LEAK</option>
            </select>
          </div>
        </div>

        {/* Taxonomy selector */}
        {Object.keys(taxonomyFlat).length > 0 && (
          <div className="px-5 py-2 border-b border-neutral-800 shrink-0">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 block">
                  {t('redteam.taxonomy.primary')}
                </label>
                <div className="relative">
                  <input
                    value={taxSearch}
                    onChange={function(e) { setTaxSearch(e.target.value); }}
                    placeholder="Search technique..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-[11px] font-mono text-white placeholder-neutral-700 outline-none focus:border-orange-500 transition-colors"
                  />
                  {taxSearch.length > 1 && (
                    <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded shadow-xl">
                      {Object.keys(taxonomyFlat).filter(function(tid) {
                        var lc = taxSearch.toLowerCase();
                        return tid.toLowerCase().indexOf(lc) !== -1 || (taxonomyFlat[tid].technique_label || '').toLowerCase().indexOf(lc) !== -1;
                      }).slice(0, 15).map(function(tid) {
                        var path = taxonomyFlat[tid];
                        return (
                          <button key={tid} onClick={function() { setTaxPrimary(tid); setTaxSearch(''); }}
                            className="w-full text-left px-3 py-1 text-[10px] font-mono hover:bg-neutral-800 transition-colors block">
                            <span className="text-orange-400">{path.technique_label}</span>
                            <span className="text-neutral-600 ml-2">{path.class_id + ' > ' + path.category_id}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {taxPrimary && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                      {taxPrimary}
                    </span>
                    <span className="text-[9px] text-neutral-600">
                      {taxonomyFlat[taxPrimary] ? taxonomyFlat[taxPrimary].class_id + ' > ' + taxonomyFlat[taxPrimary].category_id + (taxonomyFlat[taxPrimary].subcategory_id ? ' > ' + taxonomyFlat[taxPrimary].subcategory_id : '') : ''}
                    </span>
                    <button onClick={function() { setTaxPrimary(''); }} className="text-neutral-600 hover:text-red-400 transition-colors">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 shrink-0">
          {tabs.map(function(tab) {
            var isActive = activeTab === tab.id;
            var Icon = tab.icon;
            return (
              <button key={tab.id} onClick={function() { setActiveTab(tab.id); }}
                className={'flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ' +
                  (isActive ? 'border-b-2 border-red-500 text-red-400 bg-red-950/10' : 'text-neutral-600 hover:text-neutral-400 border-b-2 border-transparent')}>
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body — Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'edit' && (
            <div className="h-full flex flex-col">
              <div className="px-5 py-1.5 text-[10px] text-neutral-600 font-mono border-b border-neutral-800/50 shrink-0">
                {t('redteam.attack.modal.body_label')}
              </div>
              <textarea
                value={body}
                onChange={function(e) { setBody(e.target.value); }}
                placeholder={t('redteam.attack.crud.body_placeholder')}
                className="flex-1 bg-black/40 text-green-400 font-mono p-4 resize-none focus:outline-none placeholder-neutral-800 text-sm leading-relaxed w-full"
                style={{minHeight: '300px'}}
                spellCheck="false"
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="p-5 overflow-y-auto custom-scrollbar" style={{maxHeight: 'calc(90vh - 220px)'}}>
              {body.trim() ? (
                <div
                  className="prose prose-invert prose-sm max-w-none font-mono text-xs"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
                />
              ) : (
                <div className="text-neutral-700 italic text-sm text-center py-12">{t('redteam.attack.modal.preview_empty')}</div>
              )}
            </div>
          )}

          {activeTab === 'help' && (
            <div className="h-full flex" style={{maxHeight: 'calc(90vh - 220px)'}}>
              {/* Left: MD Editor */}
              <div className="w-1/2 flex flex-col border-r border-neutral-800">
                <div className="px-3 py-1.5 text-[10px] text-neutral-600 font-mono border-b border-neutral-800/50 shrink-0 flex justify-between items-center">
                  <span>{t('redteam.attack.modal.help_md_title')} — {t('redteam.attack.modal.tab_edit')}</span>
                  <span className="text-neutral-700">{(helpMd || '').length + ' ' + t('redteam.attack.modal.chars')}</span>
                </div>
                <textarea
                  value={helpMd}
                  onChange={function(e) { setHelpMd(e.target.value); }}
                  placeholder={'# ' + (name || 'Template') + '\n\n## What it does\nDescribe the attack vector...\n\n## OODA Phase\n- **Observe**: ...\n- **Orient**: ...\n\n## Expected Impact\n> Critical: may override safety limits\n\n## Example\n```\nOBX|1|ST|...\n```'}
                  className="flex-1 bg-black/40 text-cyan-400 font-mono p-3 resize-none focus:outline-none placeholder-neutral-800 text-[11px] leading-relaxed w-full"
                  spellCheck="false"
                />
              </div>
              {/* Right: Live Preview */}
              <div className="w-1/2 flex flex-col">
                <div className="px-3 py-1.5 text-[10px] text-neutral-600 font-mono border-b border-neutral-800/50 shrink-0">
                  {t('redteam.attack.modal.tab_preview')}
                </div>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                  {(helpMd || '').trim() ? (
                    <div
                      className="prose prose-invert prose-sm max-w-none font-mono text-xs"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(helpMd) }}
                    />
                  ) : (
                    <div className="text-neutral-700 italic text-[11px] text-center py-8 space-y-3">
                      <div>{t('redteam.attack.modal.preview_empty')}</div>
                      <div className="text-neutral-800 text-[10px] text-left space-y-1 border border-neutral-800 rounded p-3">
                        <div className="text-neutral-600 font-bold mb-2">{t('redteam.attack.modal.help_md_title')}</div>
                        <div><code className="text-cyan-500"># Title</code> <span className="text-neutral-700">Header</span></div>
                        <div><code className="text-cyan-500">**bold**</code> <span className="text-neutral-700">Bold</span></div>
                        <div><code className="text-cyan-500">*italic*</code> <span className="text-neutral-700">Italic</span></div>
                        <div><code className="text-cyan-500">`code`</code> <span className="text-neutral-700">Code</span></div>
                        <div><code className="text-cyan-500">```block```</code> <span className="text-neutral-700">Code block</span></div>
                        <div><code className="text-cyan-500">&gt; quote</code> <span className="text-neutral-700">Blockquote</span></div>
                        <div><code className="text-cyan-500">- item</code> <span className="text-neutral-700">List</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 flex justify-between items-center shrink-0 bg-neutral-900/50">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors">
            {t('redteam.attack.crud.cancel')}
          </button>
          <div className="flex gap-2">
            {onInsert && (
              <button
                onClick={handleInsertAndClose}
                disabled={!body.trim()}
                className="px-4 py-1.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-cyan-400 rounded transition-colors flex items-center gap-1.5"
              >
                <Play size={10} /> {t('redteam.attack.modal.insert_and_close')}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !body.trim()}
              className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded transition-colors flex items-center gap-1.5"
            >
              <Save size={12} /> {saving ? '...' : t('redteam.attack.crud.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
