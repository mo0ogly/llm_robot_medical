// frontend/src/components/redteam/CatalogTab.jsx
import { useState, useEffect } from 'react';
import { Play, Pencil, Trash2, Plus, PlayCircle, Upload, FileSearch,
         ChevronDown, ChevronRight, X, Copy, ArrowRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfectionDiff from './InfectionDiff';
import robotEventBus from '../../utils/robotEventBus';

var CATEGORY_COLORS = {
  prompt_leak: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
  rule_bypass: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
  injection: 'text-red-400 border-red-500/30 bg-red-500/5',
};

var CAT_BADGE_COLORS = {
  prompt_leak: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  rule_bypass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  injection: 'bg-red-500/20 text-red-400 border-red-500/40',
};

// ── Detail Modal ─────────────────────────────────────────────────────────────
function AttackDetailModal({ attack, category, meta, onClose, onInsertToForge, t }) {
  if (!attack) return null;
  var name = (meta && meta.name) || t('redteam.catalog.detail.unnamed');
  var chainId = meta && (meta.chain_id || meta.chainId);
  var variables = (meta && meta.variables) || {};
  var varKeys = Object.keys(variables);
  var badgeCls = CAT_BADGE_COLORS[category] || 'bg-neutral-800 text-neutral-400 border-neutral-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4 bg-neutral-950 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
           onClick={function(e) { e.stopPropagation(); }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={'px-2 py-0.5 text-[9px] font-bold uppercase border rounded ' + badgeCls}>
              {category.replace('_', ' ')}
            </span>
            <span className="font-bold text-sm text-white truncate">{name}</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors shrink-0 ml-2">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto" style={{maxHeight: '70vh'}}>
          {/* Chain ID */}
          {chainId && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">{t('redteam.catalog.detail.chain_id')}:</span>
              <code className="text-[11px] text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 rounded px-2 py-0.5 font-mono">{chainId}</code>
            </div>
          )}

          {/* Variables */}
          {varKeys.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">{t('redteam.catalog.detail.variables')}</div>
              <div className="space-y-1">
                {varKeys.map(function(k) {
                  return (
                    <div key={k} className="flex items-start gap-2 text-xs font-mono">
                      <span className="text-yellow-500 shrink-0">{'{{' + k + '}}'}</span>
                      <span className="text-neutral-400">=</span>
                      <span className="text-neutral-300 break-all">{variables[k]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full template text */}
          <div>
            <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">{t('redteam.catalog.detail.full_template')}</div>
            <pre className="bg-black/40 border border-neutral-800 rounded p-3 text-[11px] text-neutral-300 font-mono whitespace-pre-wrap break-all leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
              {attack}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 flex justify-between">
          <button
            onClick={function() {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(attack);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors"
          >
            <Copy size={12} /> {t('redteam.catalog.detail.copy')}
          </button>
          <button
            onClick={function() { onInsertToForge && onInsertToForge(category, attack); onClose(); }}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <ArrowRight size={12} /> {t('redteam.catalog.detail.insert_forge')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Import Help Tooltip ──────────────────────────────────────────────────────
function ImportHelpTooltip({ onClose, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg mx-4 bg-neutral-950 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
           onClick={function(e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900">
          <span className="font-bold text-sm text-white">{t('redteam.catalog.import_help.title')}</span>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3 text-xs font-mono">
          <p className="text-neutral-400">{t('redteam.catalog.import_help.desc')}</p>
          <pre className="bg-black/50 border border-neutral-800 rounded p-3 text-[10px] text-green-400 whitespace-pre-wrap overflow-x-auto">
{`{
  "injection": [
    "Your injection payload text here...",
    "Another injection payload..."
  ],
  "rule_bypass": [
    "Your rule bypass payload..."
  ],
  "prompt_leak": [
    "Your prompt leak payload..."
  ]
}`}
          </pre>
          <p className="text-neutral-500 text-[10px]">{t('redteam.catalog.import_help.note')}</p>
        </div>
        <div className="px-5 py-3 border-t border-neutral-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors">
            {t('redteam.catalog.import_help.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main CatalogTab ──────────────────────────────────────────────────────────
export default function CatalogTab({ onSwitchToPlayground, onLaunchCampaign }) {
  var { t } = useTranslation();
  var [catalog, setCatalog] = useState({});
  var [templates, setTemplates] = useState([]);
  var [results, setResults] = useState({});
  var [loading, setLoading] = useState(true);
  var [runningAttack, setRunningAttack] = useState(null);
  var [offline, setOffline] = useState(false);
  var [diffTarget, setDiffTarget] = useState(null);
  var [baseRecord, setBaseRecord] = useState('');
  var [expanded, setExpanded] = useState({});
  var [detailTarget, setDetailTarget] = useState(null); // { attack, category, index }
  var [showImportHelp, setShowImportHelp] = useState(false);

  function toggleCategory(cat) {
    setExpanded(function(prev) {
      var next = Object.assign({}, prev);
      next[cat] = !next[cat];
      return next;
    });
  }

  useEffect(function() {
    fetch('/api/content')
      .then(function(r) { return r.json(); })
      .then(function(data) { setBaseRecord(data.record_safe || ''); })
      .catch(function() {
        setBaseRecord('MSH|^~\\&|DA_VINCI|OR1|PACS|HOSPITAL|202603111116||ADT^A08|489201|P|2.5\nPID|||489201-A||SMITH^JOHN||19580412|M\nPV1||I|SURG|||||MILLER^M\nOBR|1||489201-A^DA_VINCI|SurgProc^General|||202603110830\nOBX|1|TX|GDT^General Diagnosis||Patient stable for surgery. Ischemia risk assessed.');
      });
  }, []);

  function getInfectedRecord(attackMessage) {
    var lines = baseRecord.split('\n');
    return lines.map(function(line) {
      if (line.startsWith('OBX|')) {
        var parts = line.split('|');
        parts[5] = parts[5] + ' ' + attackMessage;
        return parts.join('|');
      }
      return line;
    }).join('\n');
  }

  useEffect(function() {
    // Fetch both catalog and templates in parallel
    Promise.all([
      fetch('/api/redteam/catalog').then(function(r) { if (!r.ok) throw new Error(); return r.json(); }),
      fetch('/api/redteam/templates').then(function(r) { return r.json(); }).catch(function() { return []; })
    ])
      .then(function(results) {
        var catData = results[0];
        var tplData = results[1];
        setCatalog(catData);
        setTemplates(Array.isArray(tplData) ? tplData : []);
        setLoading(false);
        var initExpanded = {};
        Object.keys(catData).forEach(function(cat) { initExpanded[cat] = true; });
        setExpanded(initExpanded);
      })
      .catch(function() { setOffline(true); setLoading(false); });
  }, []);

  // Build a lookup: for each category, map index -> template metadata
  function getTemplateMeta(category, index) {
    var catCount = 0;
    for (var i = 0; i < templates.length; i++) {
      var tpl = templates[i];
      if ((tpl.category || 'injection') === category && tpl.template) {
        if (catCount === index) return tpl;
        catCount++;
      }
    }
    return null;
  }

  function runSingleAttack(attackType, attackMessage, index) {
    var key = attackType + '-' + index;
    setRunningAttack(key);
    robotEventBus.emit('redteam:attack_start', { attack_type: attackType, message: attackMessage });
    fetch('/api/redteam/attack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attack_type: attackType, attack_message: attackMessage }),
    })
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        setResults(function(prev) { var next = Object.assign({}, prev); next[key] = data; return next; });
        robotEventBus.emit('redteam:attack_result', data);
      })
      .catch(function(e) {
        setResults(function(prev) { var next = Object.assign({}, prev); next[key] = { error: e.message }; return next; });
      })
      .finally(function() { setRunningAttack(null); });
  }

  function deleteAttack(category, index) {
    fetch('/api/redteam/catalog/' + category + '/' + index, { method: 'DELETE' })
      .then(function() {
        setCatalog(function(prev) {
          var updated = Object.assign({}, prev);
          updated[category] = [].concat(updated[category]);
          updated[category].splice(index, 1);
          return updated;
        });
      });
  }

  function getResultBadge(key) {
    var r = results[key];
    if (!r) return null;
    if (r.error) return <span className="text-yellow-500 text-xs">{t('redteam.catalog.badge.err')}</span>;
    var s = r.scores || {};
    if (s.prompt_leak) return <span className="text-purple-400 text-xs font-bold">{t('redteam.catalog.badge.leak')}</span>;
    if (s.rule_bypass) return <span className="text-orange-400 text-xs font-bold">{t('redteam.catalog.badge.bypass')}</span>;
    if (s.injection_success) return <span className="text-red-400 text-xs font-bold">{t('redteam.catalog.badge.injected')}</span>;
    return <span className="text-[#00ff41] text-xs font-bold">{t('redteam.catalog.badge.blocked')}</span>;
  }

  // Total count across all categories
  var totalCount = 0;
  Object.values(catalog).forEach(function(arr) { totalCount += arr.length; });

  if (loading) return <p className="text-gray-600 animate-pulse">{t('redteam.catalog.loading')}</p>;

  if (offline) return (
    <div className="border border-yellow-500/30 rounded p-4 bg-yellow-500/5 text-center">
      <div className="text-yellow-400 font-mono text-xs font-bold mb-2">{t('redteam.catalog.offline.title')}</div>
      <p className="text-[11px] text-gray-400">{t('redteam.catalog.offline.desc')}</p>
      <p className="text-[10px] text-gray-600 mt-1">{t('redteam.catalog.offline.run')} <code className="text-gray-400">cd backend && python3 server.py</code></p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Dynamic total count */}
      <div className="text-[10px] text-neutral-500 font-mono">
        {totalCount + ' ' + t('redteam.view.catalog.badge_templates')}
      </div>

      {Object.entries(catalog).map(function(entry) {
        var category = entry[0];
        var attacks = entry[1];
        return (
          <div key={category} className={'border rounded-lg ' + (CATEGORY_COLORS[category] || 'border-gray-700')}>
            <button
              onClick={function() { toggleCategory(category); }}
              className="w-full px-3 py-2 font-bold text-xs tracking-wider flex items-center justify-between hover:bg-white/5 transition-colors rounded-t-lg"
            >
              <span className="flex items-center gap-2">
                {expanded[category]
                  ? <ChevronDown size={12} />
                  : <ChevronRight size={12} />}
                {t('redteam.category.' + category, { defaultValue: category.toUpperCase().replace('_', ' ') })}
                <span className="ml-1 font-mono opacity-60">({attacks.length})</span>
              </span>
            </button>
            {expanded[category] && (
            <div className="divide-y divide-gray-800/50 border-t border-gray-800/50">
              {attacks.map(function(attack, i) {
                var key = category + '-' + i;
                var isRunning = runningAttack === key;
                var meta = getTemplateMeta(category, i);
                var displayName = (meta && meta.name) || '';
                return (
                  <div key={key} className="px-3 py-2 hover:bg-white/5 group">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={function() { runSingleAttack(category, attack, i); }}
                        disabled={isRunning}
                        className="text-gray-600 hover:text-[#00ff41] transition-colors disabled:animate-spin shrink-0"
                        title={t('redteam.catalog.tooltip.launch')}
                      >
                        <Play size={12} />
                      </button>
                      <button
                        onClick={function() { setDetailTarget({ attack: attack, category: category, index: i }); }}
                        className="flex-1 text-left min-w-0"
                        title={t('redteam.catalog.tooltip.detail')}
                      >
                        {displayName && (
                          <div className="text-[10px] font-bold text-neutral-300 truncate">{displayName}</div>
                        )}
                        <div className="text-xs text-gray-400 truncate">{attack.substring(0, 80) + (attack.length > 80 ? '...' : '')}</div>
                      </button>
                      {getResultBadge(key)}
                      <button
                        onClick={function() {
                          setDiffTarget({
                            attack: attack,
                            category: category,
                            safe: baseRecord,
                            infected: getInfectedRecord(attack)
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all shrink-0"
                        title={t('redteam.catalog.tooltip.scan')}
                      >
                        <FileSearch size={12} />
                      </button>
                      <button
                        onClick={function() { onSwitchToPlayground && onSwitchToPlayground(category, attack); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-blue-400 transition-all shrink-0"
                        title={t('redteam.catalog.tooltip.edit')}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={function() { deleteAttack(category, i); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all shrink-0"
                        title={t('redteam.catalog.tooltip.delete')}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        );
      })}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-800 flex-wrap">
        <button
          onClick={function() { onSwitchToPlayground && onSwitchToPlayground('injection', ''); }}
          className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                     text-gray-400 hover:text-[#00ff41] border border-gray-700
                     hover:border-[#00ff41]/30 rounded transition-colors"
        >
          <Plus size={12} /> {t('redteam.catalog.btn.new')}
        </button>
        <button
          onClick={function() { onLaunchCampaign && onLaunchCampaign(); }}
          className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                     text-[#00ff41] border border-[#00ff41]/30
                     hover:bg-[#00ff41]/10 rounded transition-colors"
        >
          <PlayCircle size={12} /> {t('redteam.catalog.btn.launch_all')}
        </button>
        <div className="flex items-center gap-1">
          <label className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold text-gray-400
                           border border-gray-700 rounded hover:border-gray-500 transition-colors cursor-pointer">
            <Upload size={12} /> {t('redteam.catalog.btn.import')}
            <input type="file" accept=".json" className="hidden" onChange={function(e) {
              var file = e.target.files && e.target.files[0];
              if (!file) return;
              file.text().then(function(text) {
                var data = JSON.parse(text);
                return fetch('/api/redteam/catalog/import', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ catalog: data }),
                }).then(function() { setCatalog(data); });
              });
            }} />
          </label>
          <button
            onClick={function() { setShowImportHelp(true); }}
            className="text-gray-600 hover:text-gray-400 transition-colors p-1"
            title={t('redteam.catalog.import_help.title')}
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {detailTarget && (
        <AttackDetailModal
          attack={detailTarget.attack}
          category={detailTarget.category}
          meta={getTemplateMeta(detailTarget.category, detailTarget.index)}
          onClose={function() { setDetailTarget(null); }}
          onInsertToForge={onSwitchToPlayground}
          t={t}
        />
      )}

      {/* Import help modal */}
      {showImportHelp && (
        <ImportHelpTooltip
          onClose={function() { setShowImportHelp(false); }}
          t={t}
        />
      )}

      <InfectionDiff
        isOpen={!!diffTarget}
        onClose={function() { setDiffTarget(null); }}
        safeRecord={diffTarget && diffTarget.safe}
        infectedRecord={diffTarget && diffTarget.infected}
        attackType={diffTarget && diffTarget.category}
      />
    </div>
  );
}
