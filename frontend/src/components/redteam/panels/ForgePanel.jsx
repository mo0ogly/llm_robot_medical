import React from 'react';
import {
  Crosshair, Search, Copy, Maximize2, Database, FileText
} from 'lucide-react';
import PayloadEditModal from '../shared/PayloadEditModal';
import CatalogCrudTab from '../shared/CatalogCrudTab';
import { renderMarkdown } from '../shared/renderMarkdown';
import { computeWordDiff } from '../shared/wordDiff';

var CATEGORIES = ['injection', 'rule_bypass', 'prompt_leak'];

export default function ForgePanel({
  panels, togglePanel, templates, filteredTemplates, selectedTemplate, setSelectedTemplate,
  useCustom, setUseCustom, customPayload, setCustomPayload, variables, setVariables,
  attackType, setAttackType, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery,
  p1SubTab, setP1SubTab, advModalOpen, setAdvModalOpen, editingMeta, setEditingMeta,
  showCompare, setShowCompare, selectedVersion, setSelectedVersion,
  compareVariables, setCompareVariables,
  helpContent, setHelpContent, helpDraft, setHelpDraft, helpFilename,
  helpLoading, helpEditMode, setHelpEditMode, helpSaveStatus, setHelpSaveStatus,
  resolvePayload, loadTemplates, loadTemplateHelp,
  t, PanelHeader
}) {
  var delta0State = React.useState(null);
  var delta0Result = delta0State[0];
  var setDelta0Result = delta0State[1];
  var delta0LoadState = React.useState(false);
  var delta0Loading = delta0LoadState[0];
  var setDelta0Loading = delta0LoadState[1];

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <PanelHeader
        isOpen={panels.p1}
        onToggle={function() { togglePanel('p1'); }}
        icon={<Crosshair size={14} className="text-red-500" />}
        title={t('redteam.studio.v2.panel.forge')}
        subtitle={t('redteam.studio.v2.panel.forge.desc') + ' — ' + templates.length + ' templates'}
        tag={templates.length + ' TPL'}
        tagColor="bg-red-500/15 text-red-400"
      />
      {panels.p1 && (
        <div className="bg-black/30 border-t border-neutral-800">

          {/* Advanced Edit Modal */}
          <PayloadEditModal
            isOpen={advModalOpen}
            onClose={function() { setAdvModalOpen(false); }}
            onSave={function(data, onSuccess) { setCustomPayload(data.body); setUseCustom(true); setAttackType(data.category); onSuccess(); }}
            onInsert={function(text) { setCustomPayload(text); setUseCustom(true); }}
            initialName={''}
            initialBody={useCustom ? customPayload : resolvePayload()}
            initialCategory={attackType}
            initialHelpMd={''}
            isNew={false}
            t={t}
          />

          {/* Sub-tabs: FORGE | CATALOGUE | AIDE */}
          <div className="flex border-b border-neutral-800">
            <button
              onClick={function() { setP1SubTab('forge'); }}
              className={'flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ' +
                (p1SubTab === 'forge' ? 'border-b-2 border-red-500 text-red-400 bg-red-950/10' : 'text-neutral-600 hover:text-neutral-400 border-b-2 border-transparent')}
            >
              <Crosshair size={10} /> {t('redteam.studio.v2.forge.tab_forge')}
            </button>
            <button
              onClick={function() { setP1SubTab('catalog'); }}
              className={'flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ' +
                (p1SubTab === 'catalog' ? 'border-b-2 border-cyan-500 text-cyan-400 bg-cyan-950/10' : 'text-neutral-600 hover:text-neutral-400 border-b-2 border-transparent')}
            >
              <Database size={10} /> {t('redteam.studio.v2.forge.tab_catalog')}
            </button>
            <button
              onClick={function() { setP1SubTab('aide'); }}
              className={'flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ' +
                (p1SubTab === 'aide' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-950/10' : 'text-neutral-600 hover:text-neutral-400 border-b-2 border-transparent')}
            >
              <FileText size={10} /> {t('redteam.studio.v2.forge.tab_aide')}
            </button>
          </div>

          {/* Catalog CRUD sub-tab */}
          {p1SubTab === 'catalog' && (
            <div className="p-3" style={{maxHeight: '400px', overflowY: 'auto'}}>
              <CatalogCrudTab onInsert={function(text) { setCustomPayload(text); setUseCustom(true); }} t={t} />
            </div>
          )}

          {/* AIDE sub-tab — Markdown editor for template help */}
          {p1SubTab === 'aide' && (
            <div className="border-t border-neutral-800">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 bg-neutral-950/50 border-b border-neutral-800">
                {/* Formatting buttons */}
                {[
                  { label: 'B', insert: '**bold**', title: 'Bold' },
                  { label: 'I', insert: '*italic*', title: 'Italic' },
                  { label: 'H1', insert: '# ', title: 'Heading 1' },
                  { label: 'H2', insert: '## ', title: 'Heading 2' },
                  { label: 'H3', insert: '### ', title: 'Heading 3' },
                  { label: '|T|', insert: '| Col1 | Col2 |\n|------|------|\n| val  | val  |', title: 'Table' },
                  { label: '<>', insert: '```\ncode\n```', title: 'Code block' },
                  { label: '[-]', insert: '- ', title: 'List' },
                ].map(function(btn) {
                  return (
                    <button
                      key={btn.label}
                      title={btn.title}
                      onClick={function() {
                        setHelpDraft(helpDraft + '\n' + btn.insert);
                      }}
                      className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-mono text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                    >
                      {btn.label}
                    </button>
                  );
                })}
                <div className="flex-1" />
                {/* View mode buttons */}
                {['edit', 'split', 'preview'].map(function(mode) {
                  return (
                    <button
                      key={mode}
                      onClick={function() { setHelpEditMode(mode); }}
                      className={'px-2 py-1 rounded text-[9px] font-mono font-bold border transition-colors ' +
                        (helpEditMode === mode ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                    >
                      {mode.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* Editor content area */}
              <div className="flex" style={{ minHeight: '350px' }}>
                {/* Raw editor */}
                {(helpEditMode === 'edit' || helpEditMode === 'split') && (
                  <div className={'border-r border-neutral-800 ' + (helpEditMode === 'split' ? 'w-1/2' : 'w-full')}>
                    <textarea
                      value={helpDraft}
                      onChange={function(e) { setHelpDraft(e.target.value); }}
                      className="w-full h-full min-h-[350px] bg-black p-4 font-mono text-[11px] text-emerald-300/80 outline-none resize-none"
                      placeholder="# Prompt Help&#10;&#10;Write markdown documentation here..."
                    />
                  </div>
                )}
                {/* Rendered preview */}
                {(helpEditMode === 'preview' || helpEditMode === 'split') && (
                  <div className={(helpEditMode === 'split' ? 'w-1/2' : 'w-full') + ' overflow-y-auto bg-neutral-950/50 p-4'} style={{ minHeight: '350px', maxHeight: '500px' }}>
                    <div className="prose prose-invert prose-sm max-w-none text-[11px] font-mono"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(helpDraft || '*No documentation yet*') }}
                    />
                  </div>
                )}
              </div>

              {/* Footer with save */}
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950/50 border-t border-neutral-800">
                <button
                  onClick={function() {
                    var tpl = filteredTemplates[selectedTemplate] || templates[0];
                    if (!tpl) return;
                    setHelpSaveStatus('saving');
                    fetch('/api/redteam/templates/' + tpl.id + '/help', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: helpDraft })
                    })
                    .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
                    .then(function() { setHelpContent(helpDraft); setHelpSaveStatus('success'); setTimeout(function() { setHelpSaveStatus(null); }, 2000); })
                    .catch(function() { setHelpSaveStatus('error'); setTimeout(function() { setHelpSaveStatus(null); }, 2000); });
                  }}
                  className="px-3 py-1.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                >
                  {t('redteam.studio.v2.aide.save')}
                </button>
                <button
                  onClick={function() { setHelpDraft(helpContent); }}
                  className="px-2 py-1.5 rounded text-[10px] font-mono text-neutral-600 border border-neutral-800 hover:border-neutral-600 transition-colors"
                >
                  {t('redteam.studio.v2.reset')}
                </button>
                {helpSaveStatus === 'success' && <span className="text-[10px] text-green-400 font-mono">{t('redteam.studio.v2.saved')}</span>}
                {helpSaveStatus === 'error' && <span className="text-[10px] text-red-400 font-mono">{t('redteam.studio.v2.failed')}</span>}
                <div className="flex-1" />
                <span className="text-[8px] text-neutral-700 font-mono">
                  {helpFilename + ' | ' + (helpDraft || '').length + ' chars | ' + (helpDraft || '').split('\n').length + ' lines'}
                </span>
              </div>

              {/* TEST δ⁰ section */}
              <div className="px-3 py-2 bg-neutral-950/50 border-t border-neutral-800 space-y-2">
                <button
                  disabled={delta0Loading}
                  onClick={function() {
                    var tpl = filteredTemplates[selectedTemplate] || templates[0];
                    if (!tpl) return;
                    setDelta0Loading(true);
                    setDelta0Result(null);
                    var payload = useCustom ? customPayload : resolvePayload();
                    fetch('/api/redteam/delta0-protocol', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ template_id: tpl.id, attack_message: payload })
                    })
                    .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                    .then(function(data) { setDelta0Result(data); setDelta0Loading(false); })
                    .catch(function(err) { setDelta0Result({ error: err.message || 'Error' }); setDelta0Loading(false); });
                  }}
                  className="px-3 py-1.5 rounded text-[10px] font-mono font-bold bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
                >
                  {delta0Loading ? t('redteam.studio.v2.delta0.testing') : t('redteam.studio.v2.delta0.test')}
                </button>

                {delta0Result && !delta0Result.error && (
                  <div className="p-2 bg-black/50 border border-purple-500/20 rounded space-y-1">
                    <div className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                      {t('redteam.studio.v2.delta0.result')}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                      <div>
                        <span className="text-neutral-600">{t('redteam.studio.v2.delta0.protection')}: </span>
                        <span className="text-purple-300">{delta0Result.delta0_protection != null ? delta0Result.delta0_protection.toFixed(4) : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">{t('redteam.studio.v2.delta0.contribution')}: </span>
                        <span className="text-cyan-300">{delta0Result.delta1_contribution != null ? delta0Result.delta1_contribution.toFixed(4) : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">{t('redteam.studio.v2.delta0.residual')}: </span>
                        <span className="text-amber-300">{delta0Result.residual != null ? delta0Result.residual.toFixed(4) : 'N/A'}</span>
                      </div>
                    </div>
                    {delta0Result.interpretation && (
                      <div className="text-[9px] font-mono text-neutral-500 mt-1 italic">
                        {delta0Result.interpretation}
                      </div>
                    )}
                  </div>
                )}

                {delta0Result && delta0Result.error && (
                  <div className="p-2 bg-red-950/30 border border-red-500/20 rounded text-[10px] font-mono text-red-400">
                    {'Error: ' + delta0Result.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Forge sub-tab content */}
          {p1SubTab === 'forge' && (
          <div className="p-4 space-y-4">

          {/* NEW TEMPLATE button */}
          <div className="flex items-center gap-2">
            <button
              onClick={function() {
                var newId = 'custom_' + Date.now();
                fetch('/api/redteam/templates', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: newId,
                    name: 'New Template',
                    category: 'injection',
                    chain_id: null,
                    target_delta: 'delta1',
                    conjecture: null,
                    template: '',
                    variables: {},
                    help_content: '# New Template\n\n## AEGIS Audit\n\nWrite documentation here.'
                  })
                }).then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
                .then(function() { loadTemplates(); });
              }}
              className="px-2.5 py-1 rounded text-[9px] font-mono font-bold border border-dashed border-neutral-700 text-neutral-500 hover:border-red-500/50 hover:text-red-400 transition-colors"
            >
              + NEW
            </button>
            <div className="flex-1" />
          </div>

          {/* Category filter + Search */}
          <div className="flex gap-2 items-center">
            <div className="flex gap-1">
              <button
                onClick={function() { setCategoryFilter('all'); }}
                className={'px-2 py-1 rounded text-[9px] font-mono font-bold border transition-colors ' +
                  (categoryFilter === 'all' ? 'border-neutral-500 bg-neutral-800 text-white' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
              >
                ALL
              </button>
              {CATEGORIES.map(function(c) {
                var active = categoryFilter === c;
                var catColor = c === 'injection' ? 'border-red-500/50 bg-red-500/10 text-red-400'
                  : c === 'rule_bypass' ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                  : 'border-purple-500/50 bg-purple-500/10 text-purple-400';
                return (
                  <button
                    key={c}
                    onClick={function() { setCategoryFilter(c); }}
                    className={'px-2 py-1 rounded text-[9px] font-mono font-bold border transition-colors ' +
                      (active ? catColor : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                  >
                    {c.toUpperCase().replace('_', ' ')}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={function(e) { setSearchQuery(e.target.value); }}
                placeholder={t('redteam.studio.v2.search')}
                className="w-full pl-7 pr-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-neutral-600"
              />
            </div>
            <span className="text-[9px] text-neutral-600 font-mono">{filteredTemplates.length} {t('redteam.studio.v2.results')}</span>
          </div>

          {/* Template selector */}
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {filteredTemplates.map(function(tpl, i) {
              var isActive = selectedTemplate === i && !useCustom;
              var catBorder = tpl.category === 'injection' ? 'border-l-red-500'
                : tpl.category === 'rule_bypass' ? 'border-l-orange-500'
                : 'border-l-purple-500';
              return (
                <button
                  key={i}
                  onClick={function() {
                    setSelectedTemplate(i);
                    setUseCustom(false);
                    setVariables(tpl.variables || {});
                    setAttackType(tpl.category || 'injection');
                    setEditingMeta({
                      name: tpl.name,
                      category: tpl.category,
                      chain_id: tpl.chain_id || '',
                      target_delta: tpl.target_delta || 'delta1',
                      conjecture: tpl.conjecture || ''
                    });
                    loadTemplateHelp(tpl.id);
                  }}
                  className={'text-left p-2 rounded border-l-2 border border-neutral-800 transition-all text-[10px] ' +
                    catBorder + ' ' +
                    (isActive ? 'bg-neutral-800/60 border-neutral-600' : 'bg-black/20 hover:bg-neutral-900')}
                >
                  <div className={'font-mono font-bold truncate ' + (isActive ? 'text-white' : 'text-neutral-400')}>{tpl.name}</div>
                  <div className="text-neutral-600 truncate mt-0.5">{tpl.category} {tpl.chainId ? '| ' + tpl.chainId : ''}</div>
                </button>
              );
            })}
          </div>

          {/* Custom toggle + Variable editor */}
          <div className="flex items-center gap-3">
            <button
              onClick={function() { setUseCustom(!useCustom); }}
              className={'px-2.5 py-1 rounded text-[9px] font-mono font-bold border transition-colors ' +
                (useCustom ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
            >
              {useCustom ? t('redteam.studio.v2.custom_mode') : t('redteam.studio.v2.switch_custom')}
            </button>
            {!useCustom && Object.keys(variables).length > 0 && (
              <div className="flex gap-2 flex-1 overflow-x-auto">
                {Object.keys(variables).map(function(k) {
                  return (
                    <div key={k} className="flex items-center gap-1 shrink-0">
                      <span className="text-[8px] text-cyan-500 font-mono">{'{{' + k + '}}'}</span>
                      <input
                        type="text"
                        value={variables[k] || ''}
                        onChange={function(e) {
                          var updated = Object.assign({}, variables);
                          updated[k] = e.target.value;
                          setVariables(updated);
                        }}
                        className="w-32 px-1.5 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Compare toggle - only show if template has versions */}
          {!useCustom && filteredTemplates[selectedTemplate] && (filteredTemplates[selectedTemplate].versions || []).length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={function() { setShowCompare(!showCompare); }}
                className={'px-3 py-1.5 rounded text-[9px] font-mono font-bold border transition-colors flex items-center gap-1.5 ' +
                  (showCompare ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
              >
                {showCompare ? t('redteam.studio.v2.forge.hide_compare') : t('redteam.studio.v2.forge.show_compare')}
              </button>
              {showCompare && (
                <div className="flex gap-1">
                  {(filteredTemplates[selectedTemplate].versions || []).map(function(v, idx) {
                    return (
                      <button
                        key={idx}
                        onClick={function() { setSelectedVersion(idx); setCompareVariables(v.variables || {}); }}
                        className={'px-2 py-1 rounded text-[8px] font-mono border transition-colors ' +
                          (selectedVersion === idx ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-neutral-800 text-neutral-600')}
                      >
                        {v.version_label || ('V' + (idx + 2))}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Payload editor */}
          {showCompare && !useCustom && filteredTemplates[selectedTemplate] && (filteredTemplates[selectedTemplate].versions || []).length > 0 ? (
            /* SPLIT VIEW A/B with word diff */
            function() {
              var baselineText = resolvePayload();
              var ver = (filteredTemplates[selectedTemplate].versions || [])[selectedVersion];
              var evolvedText = '';
              if (ver) {
                evolvedText = ver.template || '';
                Object.keys(compareVariables).forEach(function(k) {
                  evolvedText = evolvedText.split('{{' + k + '}}').join(compareVariables[k] || '');
                });
              }
              var diffParts = computeWordDiff(baselineText, evolvedText);
              var diffHtml = diffParts.map(function(part) {
                var escaped = part.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                if (part.type === 'added') {
                  return '<span style="background:#166534;color:#4ade80;">' + escaped + '</span>';
                } else if (part.type === 'removed') {
                  return '<span style="background:#991b1b;color:#f87171;text-decoration:line-through;">' + escaped + '</span>';
                }
                return '<span style="color:#a3a3a3;">' + escaped + '</span>';
              }).join('');

              return (
                <div className="space-y-3">
                  {/* Diff legend */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[8px] font-mono">
                      <span className="inline-block w-3 h-2 rounded" style={{background: '#991b1b'}} />
                      <span className="text-red-400">{t('redteam.studio.v2.diff.removed')}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-mono">
                      <span className="inline-block w-3 h-2 rounded" style={{background: '#166534'}} />
                      <span className="text-green-400">{t('redteam.studio.v2.diff.added')}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* LEFT: Baseline (V1) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[8px] font-mono font-bold rounded border border-blue-500/30">
                          {t('redteam.studio.v2.forge.baseline')}
                        </span>
                        <span className="text-[8px] text-neutral-600 font-mono">
                          {(filteredTemplates[selectedTemplate] || {}).name || ''}
                        </span>
                      </div>
                      <div
                        className="w-full h-48 bg-black border border-blue-500/20 rounded p-3 font-mono text-xs overflow-y-auto whitespace-pre-wrap cursor-default"
                        dangerouslySetInnerHTML={{ __html: diffHtml }}
                      />
                      {/* Baseline variables (read-only display) */}
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(variables).map(function(k) {
                          return (
                            <span key={k} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-mono rounded border border-blue-500/20">
                              {'{{' + k + '}}=' + (variables[k] || '')}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT: Evolved (selected version) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 text-[8px] font-mono font-bold rounded border border-amber-500/30">
                          {((filteredTemplates[selectedTemplate].versions || [])[selectedVersion] || {}).version_label || 'V2'}
                        </span>
                      </div>
                      <div
                        className="w-full h-48 bg-black border border-amber-500/20 rounded p-3 font-mono text-xs overflow-y-auto whitespace-pre-wrap cursor-default"
                        dangerouslySetInnerHTML={{ __html: diffHtml }}
                      />
                      {/* Version variables (editable) */}
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(compareVariables).map(function(k) {
                          return (
                            <div key={k} className="flex items-center gap-1">
                              <span className="text-[8px] text-amber-500 font-mono">{'{{' + k + '}}'}</span>
                              <input
                                type="text"
                                value={compareVariables[k] || ''}
                                onChange={function(e) {
                                  var updated = Object.assign({}, compareVariables);
                                  updated[k] = e.target.value;
                                  setCompareVariables(updated);
                                }}
                                className="w-28 px-1.5 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-amber-500/50"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }()
          ) : (
          /* SINGLE VIEW (existing payload editor) */
          <div className="relative group">
            <textarea
              value={useCustom ? customPayload : resolvePayload()}
              onChange={function(e) {
                if (useCustom) setCustomPayload(e.target.value);
              }}
              readOnly={!useCustom}
              className={'w-full h-36 bg-black border border-neutral-800 rounded p-3 font-mono text-xs text-[#00ff41] outline-none resize-none transition-colors ' +
                (useCustom ? 'focus:border-red-500/50' : 'cursor-default')}
              placeholder={t('redteam.studio.v2.select_template')}
            />
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={function() { setAdvModalOpen(true); }}
                className="p-1 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 transition-colors"
                title={t('redteam.attack.modal.fullscreen')}
              >
                <Maximize2 size={10} className="text-cyan-400" />
              </button>
              <button
                onClick={function() {
                  navigator.clipboard.writeText(resolvePayload());
                }}
                className="p-1 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 transition-colors"
                title="Copy payload"
              >
                <Copy size={10} className="text-neutral-400" />
              </button>
              <span className={'px-1.5 py-0.5 text-[8px] font-mono font-bold rounded border ' +
                (attackType === 'injection' ? 'bg-red-500/15 text-red-400 border-red-500/30'
                  : attackType === 'rule_bypass' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                  : 'bg-purple-500/15 text-purple-400 border-purple-500/30')}>
                {attackType.toUpperCase().replace('_', ' ')}
              </span>
            </div>
          </div>
          )}

          {/* Defense Analysis Table (visible in compare mode) */}
          {showCompare && !useCustom && filteredTemplates[selectedTemplate] && (filteredTemplates[selectedTemplate].versions || []).length > 0 && (
            <div className="mt-3 p-3 bg-neutral-950/50 border border-neutral-800 rounded space-y-2">
              <div className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                {t('redteam.studio.v2.forge.defense_analysis')}
              </div>
              <table className="w-full text-[9px] font-mono">
                <thead>
                  <tr className="text-neutral-600 border-b border-neutral-800">
                    <th className="text-left py-1.5 px-2">Pattern</th>
                    <th className="text-center py-1.5 px-2">{t('redteam.studio.v2.forge.p_detect_base')}</th>
                    <th className="text-center py-1.5 px-2">{t('redteam.studio.v2.forge.p_detect_evolved')}</th>
                    <th className="text-center py-1.5 px-2">{t('redteam.studio.v2.forge.delta')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(function() {
                    var baseProfile = { caps: 0.98, negation: 0.95, token_fictif: 0.80, tool_direct: 0.85, coercion: 0.90, xml_fictif: 0.70 };
                    var ver = (filteredTemplates[selectedTemplate].versions || [])[selectedVersion] || {};
                    var evolvedProfile = ver.detection_profile || {};
                    var patterns = Object.keys(baseProfile);
                    var patternLabels = {
                      caps: 'CAPS / Urgency',
                      negation: 'Explicit Negation',
                      token_fictif: 'Fictitious Token',
                      tool_direct: 'Direct Tool Invoke',
                      coercion: 'Coercive Framing',
                      xml_fictif: 'Fictitious XML/HL7'
                    };
                    return patterns.map(function(p) {
                      var pBase = baseProfile[p];
                      var pEvol = evolvedProfile[p] !== undefined ? evolvedProfile[p] : pBase;
                      var delta = pEvol - pBase;
                      var deltaColor = delta < 0 ? 'text-green-400' : delta > 0 ? 'text-red-400' : 'text-neutral-600';
                      return (
                        <tr key={p} className="border-b border-neutral-900">
                          <td className="py-1.5 px-2 text-neutral-400">{patternLabels[p] || p}</td>
                          <td className="py-1.5 px-2 text-center text-blue-400">{(pBase * 100).toFixed(0) + '%'}</td>
                          <td className="py-1.5 px-2 text-center text-amber-400">{(pEvol * 100).toFixed(0) + '%'}</td>
                          <td className={'py-1.5 px-2 text-center font-bold ' + deltaColor}>
                            {(delta >= 0 ? '+' : '') + (delta * 100).toFixed(0) + '%'}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                <tfoot>
                  <tr className="border-t border-neutral-700">
                    <td className="py-2 px-2 text-neutral-400 font-bold">{t('redteam.studio.v2.forge.p_detect_cumul')}</td>
                    <td className="py-2 px-2 text-center text-blue-400 font-bold">
                      {(function() {
                        var bp = { caps: 0.98, negation: 0.95, token_fictif: 0.80, tool_direct: 0.85, coercion: 0.90, xml_fictif: 0.70 };
                        var product = 1;
                        Object.keys(bp).forEach(function(k) { product *= (1 - bp[k]); });
                        return ((1 - product) * 100).toFixed(4) + '%';
                      })()}
                    </td>
                    <td className="py-2 px-2 text-center text-amber-400 font-bold">
                      {(function() {
                        var ver = (filteredTemplates[selectedTemplate].versions || [])[selectedVersion] || {};
                        var ep = ver.detection_profile || {};
                        var bp = { caps: 0.98, negation: 0.95, token_fictif: 0.80, tool_direct: 0.85, coercion: 0.90, xml_fictif: 0.70 };
                        var product = 1;
                        Object.keys(bp).forEach(function(k) { product *= (1 - (ep[k] !== undefined ? ep[k] : bp[k])); });
                        return ((1 - product) * 100).toFixed(2) + '%';
                      })()}
                    </td>
                    <td className="py-2 px-2 text-center text-neutral-500 font-bold">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Send to Campaign button */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
            <button
              onClick={function() {
                var tpl = filteredTemplates[selectedTemplate];
                if (!tpl) return;
                window.location.href = '/llm_robot_medical/redteam/campaign?template_id=' + encodeURIComponent(tpl.id) + '&compare=true';
              }}
              className="px-3 py-1.5 rounded text-[9px] font-mono font-bold border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
            >
              {t('redteam.studio.v2.forge.send_campaign')}
            </button>
          </div>

          {/* Template metadata editor (when a template is selected) */}
          {!useCustom && filteredTemplates[selectedTemplate] && (
            <div className="mt-3 p-3 bg-neutral-950/50 border border-neutral-800 rounded space-y-2">
              <div className="text-[9px] font-mono text-neutral-600 font-bold uppercase tracking-wider">
                {t('redteam.studio.v2.forge.metadata')}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-neutral-600 font-mono">Name</label>
                  <input
                    type="text"
                    value={editingMeta.name || ''}
                    onChange={function(e) { setEditingMeta(Object.assign({}, editingMeta, { name: e.target.value })); }}
                    className="w-full px-2 py-1 bg-black border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-red-500/50"
                  />
                </div>
                <div>
                  <label className="text-[8px] text-neutral-600 font-mono">Category</label>
                  <select
                    value={editingMeta.category || 'injection'}
                    onChange={function(e) { setEditingMeta(Object.assign({}, editingMeta, { category: e.target.value })); }}
                    className="w-full px-2 py-1 bg-black border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-red-500/50"
                  >
                    <option value="injection">injection</option>
                    <option value="rule_bypass">rule_bypass</option>
                    <option value="prompt_leak">prompt_leak</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8px] text-neutral-600 font-mono">Chain ID</label>
                  <input
                    type="text"
                    value={editingMeta.chain_id || ''}
                    onChange={function(e) { setEditingMeta(Object.assign({}, editingMeta, { chain_id: e.target.value || null })); }}
                    className="w-full px-2 py-1 bg-black border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-red-500/50"
                    placeholder="null"
                  />
                </div>
                <div>
                  <label className="text-[8px] text-neutral-600 font-mono">Target Delta</label>
                  <select
                    value={editingMeta.target_delta || 'delta1'}
                    onChange={function(e) { setEditingMeta(Object.assign({}, editingMeta, { target_delta: e.target.value })); }}
                    className="w-full px-2 py-1 bg-black border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-red-500/50"
                  >
                    <option value="delta1">delta1</option>
                    <option value="delta2">delta2</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8px] text-neutral-600 font-mono">Conjecture</label>
                  <select
                    value={editingMeta.conjecture || ''}
                    onChange={function(e) { setEditingMeta(Object.assign({}, editingMeta, { conjecture: e.target.value || null })); }}
                    className="w-full px-2 py-1 bg-black border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-red-500/50"
                  >
                    <option value="">None</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={function() {
                    var tpl = filteredTemplates[selectedTemplate];
                    if (!tpl) return;
                    fetch('/api/redteam/templates/' + tpl.id, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingMeta)
                    }).then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
                    .then(function() { loadTemplates(); });
                  }}
                  className="px-3 py-1.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                >
                  {t('redteam.studio.v2.forge.save_meta')}
                </button>
                <button
                  onClick={function() {
                    var tpl = filteredTemplates[selectedTemplate];
                    if (!tpl || !confirm('Delete this template?')) return;
                    fetch('/api/redteam/templates/' + tpl.id, { method: 'DELETE' })
                    .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
                    .then(function() { loadTemplates(); setSelectedTemplate(0); });
                  }}
                  className="px-3 py-1.5 rounded text-[10px] font-mono font-bold text-neutral-600 border border-neutral-800 hover:border-red-500/50 hover:text-red-400 transition-colors"
                >
                  DELETE
                </button>
              </div>
            </div>
          )}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
