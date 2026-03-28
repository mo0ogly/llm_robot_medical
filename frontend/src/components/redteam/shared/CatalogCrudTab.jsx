import { useState, useEffect } from 'react';
import {
  X, Pencil, Save, Trash2, Plus, RotateCcw, Database, Maximize2
} from 'lucide-react';
import PayloadEditModal from './PayloadEditModal';

var CAT_COLORS = {
  injection: 'text-red-400 border-red-500/30 bg-red-900/10',
  rule_bypass: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/10',
  prompt_leak: 'text-purple-400 border-purple-500/30 bg-purple-900/10'
};

export default function CatalogCrudTab({ onInsert, t }) {
  var [templates, setTemplates] = useState([]);
  var [loading, setLoading] = useState(true);
  var [editIdx, setEditIdx] = useState(null);
  var [editName, setEditName] = useState('');
  var [editBody, setEditBody] = useState('');
  var [saving, setSaving] = useState(false);
  var [flash, setFlash] = useState(null);
  var [modalOpen, setModalOpen] = useState(false);
  var [modalData, setModalData] = useState({ name: '', body: '', category: 'injection', help_md: '', isNew: false, localIdx: null });

  function load() {
    setLoading(true);
    fetch('/api/redteam/catalog')
      .then(function(r) { return r.json(); })
      .then(function(catalog) {
        var flat = [];
        ['injection', 'rule_bypass', 'prompt_leak'].forEach(function(cat) {
          var items = catalog[cat] || [];
          items.forEach(function(entry) {
            if (typeof entry === 'string') {
              flat.push({ name: '', category: cat, template: entry, message: entry });
            } else {
              flat.push({
                name: entry.name || '',
                category: cat,
                template: entry.message || entry.template || '',
                message: entry.message || entry.template || '',
                variables: entry.variables || {},
                chain_id: entry.chain_id || null,
                help_md: entry.help_md || ''
              });
            }
          });
        });
        setTemplates(flat);
        setLoading(false);
      })
      .catch(function() { setLoading(false); });
  }

  useEffect(function() { load(); }, []);

  var grouped = {};
  templates.forEach(function(tpl) {
    var cat = tpl.category || 'injection';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ tpl: tpl });
  });

  function startEdit(cat, localIdx, tpl) {
    setEditIdx(cat + '::' + localIdx);
    setEditName(tpl.name || '');
    setEditBody(tpl.template || tpl.message || '');
  }

  function startNew(cat) {
    setEditIdx('new::' + cat);
    setEditName('');
    setEditBody('');
  }

  function cancelEdit() {
    setEditIdx(null);
    setEditName('');
    setEditBody('');
  }

  function flashMsg(key, ok) {
    setFlash({ key: key, ok: ok });
    setTimeout(function() { setFlash(null); }, 2000);
  }

  function saveEdit(cat, localIdx) {
    setSaving(true);
    fetch('/api/redteam/catalog/' + cat + '/' + localIdx, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, message: editBody })
    })
      .then(function(r) { return r.json(); })
      .then(function() { setSaving(false); cancelEdit(); flashMsg('saved', true); load(); })
      .catch(function() { setSaving(false); flashMsg('error', false); });
  }

  function addNew(cat) {
    if (!editBody.trim()) return;
    setSaving(true);
    fetch('/api/redteam/catalog/' + cat, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName || t('redteam.attack.crud.new_default'), message: editBody })
    })
      .then(function(r) { return r.json(); })
      .then(function() { setSaving(false); cancelEdit(); flashMsg('saved', true); load(); })
      .catch(function() { setSaving(false); flashMsg('error', false); });
  }

  function deleteTpl(cat, localIdx) {
    if (!window.confirm(t('redteam.attack.crud.confirm_delete'))) return;
    fetch('/api/redteam/catalog/' + cat + '/' + localIdx, { method: 'DELETE' })
      .then(function() { flashMsg('deleted', true); load(); })
      .catch(function() { flashMsg('error', false); });
  }

  function openModal(cat, localIdx, tpl) {
    setModalData({
      name: tpl.name || '',
      body: tpl.template || tpl.message || '',
      category: cat,
      help_md: tpl.help_md || '',
      isNew: false,
      localIdx: localIdx
    });
    setModalOpen(true);
  }

  function openModalNew(cat) {
    setModalData({ name: '', body: '', category: cat, help_md: '', isNew: true, localIdx: null });
    setModalOpen(true);
  }

  function handleModalSave(data, onSuccess, onError) {
    if (modalData.isNew) {
      fetch('/api/redteam/catalog/' + data.category, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name || t('redteam.attack.crud.new_default'), message: data.body, help_md: data.help_md || '' })
      })
        .then(function(r) { return r.json(); })
        .then(function() { flashMsg('saved', true); load(); onSuccess(); })
        .catch(function() { flashMsg('error', false); onError(); });
    } else {
      fetch('/api/redteam/catalog/' + modalData.category + '/' + modalData.localIdx, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, message: data.body, help_md: data.help_md || '' })
      })
        .then(function(r) { return r.json(); })
        .then(function() { flashMsg('saved', true); load(); onSuccess(); })
        .catch(function() { flashMsg('error', false); onError(); });
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-32 opacity-40">
        <Database size={20} className="animate-pulse mb-2 text-red-500" />
        <span className="text-[10px] font-mono uppercase">{t('redteam.attack.crud.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 text-xs" style={{maxHeight: '100%'}}>
      <PayloadEditModal
        isOpen={modalOpen}
        onClose={function() { setModalOpen(false); }}
        onSave={handleModalSave}
        onInsert={onInsert}
        initialName={modalData.name}
        initialBody={modalData.body}
        initialCategory={modalData.category}
        initialHelpMd={modalData.help_md}
        isNew={modalData.isNew}
        t={t}
      />
      {flash && (
        <div className={'px-3 py-1.5 rounded text-[10px] font-bold font-mono text-center ' +
          (flash.ok ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30')}>
          {flash.ok ? '\u2713 ' + t('redteam.attack.crud.saved') : '\u2717 ERROR'}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={load} className="text-neutral-600 hover:text-neutral-400 transition-colors p-1" title={t('redteam.attack.crud.reload')}>
          <RotateCcw size={12} />
        </button>
      </div>

      {['injection', 'rule_bypass', 'prompt_leak'].map(function(cat) {
        var items = grouped[cat] || [];
        var colorCls = CAT_COLORS[cat] || 'text-neutral-400 border-neutral-700';
        var isNewMode = editIdx === 'new::' + cat;

        return (
          <div key={cat} className={'border rounded-lg overflow-hidden ' + colorCls.split(' ')[1]}>
            <div className={'flex items-center justify-between px-2 py-1.5 ' + colorCls.split(' ')[2]}>
              <span className={'text-[9px] font-bold uppercase tracking-widest ' + colorCls.split(' ')[0]}>
                {cat.replace('_', ' ')} ({items.length})
              </span>
              <div className="flex gap-1">
                <button
                  onClick={function() { openModalNew(cat); }}
                  className="text-[9px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors text-cyan-500 hover:bg-white/10"
                  title={t('redteam.attack.modal.fullscreen')}
                >
                  <Maximize2 size={9} />
                </button>
                <button
                  onClick={function() { isNewMode ? cancelEdit() : startNew(cat); }}
                  className={'text-[9px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors ' +
                    (isNewMode ? 'text-neutral-500 hover:text-neutral-300' : colorCls.split(' ')[0] + ' hover:bg-white/10')}
                >
                  {isNewMode ? <X size={9} /> : <Plus size={9} />}
                  {isNewMode ? t('redteam.attack.crud.cancel') : t('redteam.attack.crud.new')}
                </button>
              </div>
            </div>

            {isNewMode && (
              <div className="p-2 space-y-1.5 border-t border-neutral-800 bg-black/40">
                <input
                  value={editName}
                  onChange={function(e) { setEditName(e.target.value); }}
                  placeholder={t('redteam.attack.crud.name_placeholder')}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[10px] font-mono text-white placeholder-neutral-700 outline-none focus:border-red-500"
                />
                <textarea
                  value={editBody}
                  onChange={function(e) { setEditBody(e.target.value); }}
                  placeholder={t('redteam.attack.crud.body_placeholder')}
                  rows={4}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[10px] font-mono text-neutral-300 placeholder-neutral-700 outline-none focus:border-red-500 resize-none"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={function() { addNew(cat); }}
                    disabled={saving || !editBody.trim()}
                    className="flex-1 py-1 text-[9px] font-bold bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Save size={9} /> {saving ? '...' : t('redteam.attack.crud.save')}
                  </button>
                  <button onClick={cancelEdit} className="px-2 py-1 text-[9px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors">
                    <X size={9} />
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-neutral-800/50">
              {items.length === 0 && !isNewMode && (
                <div className="px-3 py-2 text-[10px] text-neutral-700 font-mono italic">{t('redteam.attack.crud.empty')}</div>
              )}
              {items.map(function(item, localIdx) {
                var key = cat + '::' + localIdx;
                var isEditing = editIdx === key;
                var tpl = item.tpl;
                var tplName = tpl.name || ('Template ' + (localIdx + 1));
                var tplBody = tpl.template || tpl.message || '';

                return (
                  <div key={localIdx} className="p-2 space-y-1">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <input
                          value={editName}
                          onChange={function(e) { setEditName(e.target.value); }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-red-500"
                        />
                        <textarea
                          value={editBody}
                          onChange={function(e) { setEditBody(e.target.value); }}
                          rows={5}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[10px] font-mono text-neutral-300 outline-none focus:border-red-500 resize-y"
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={function() { onInsert(editBody); }}
                            className="px-2 py-1 text-[9px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors"
                          >
                            {t('redteam.attack.btn.insert')}
                          </button>
                          <button
                            onClick={function() { saveEdit(cat, localIdx); }}
                            disabled={saving}
                            className="flex-1 py-1 text-[9px] font-bold bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Save size={9} /> {saving ? '...' : t('redteam.attack.crud.save')}
                          </button>
                          <button onClick={cancelEdit} className="px-2 py-1 text-[9px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors">
                            <X size={9} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-neutral-300 leading-tight flex-1 truncate">{tplName}</span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={function() { onInsert(tplBody); }}
                              className="px-1.5 py-0.5 text-[8px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors uppercase"
                            >{t('redteam.attack.btn.insert')}</button>
                            <button
                              onClick={function() { startEdit(cat, localIdx, tpl); }}
                              className="p-0.5 text-neutral-600 hover:text-yellow-400 transition-colors"
                              title={t('redteam.attack.crud.edit')}
                            ><Pencil size={10} /></button>
                            <button
                              onClick={function() { openModal(cat, localIdx, tpl); }}
                              className="p-0.5 text-neutral-600 hover:text-cyan-400 transition-colors"
                              title={t('redteam.attack.modal.fullscreen')}
                            ><Maximize2 size={10} /></button>
                            <button
                              onClick={function() { deleteTpl(cat, localIdx); }}
                              className="p-0.5 text-neutral-600 hover:text-red-500 transition-colors"
                              title={t('redteam.attack.crud.delete')}
                            ><Trash2 size={10} /></button>
                          </div>
                        </div>
                        <pre className="text-[9px] text-neutral-600 font-mono whitespace-pre-wrap break-all leading-tight line-clamp-2">
                          {tplBody.substring(0, 100) + (tplBody.length > 100 ? '\u2026' : '')}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
