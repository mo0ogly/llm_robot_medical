// frontend/src/components/redteam/CatalogTab.jsx
import { useState, useEffect } from 'react';
import { Play, Pencil, Trash2, Plus, PlayCircle, Upload, FileSearch, ChevronDown, ChevronRight, GitBranch, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfectionDiff from './InfectionDiff';
import robotEventBus from '../../utils/robotEventBus';
import useFetchWithCache from '../../hooks/useFetchWithCache';

var CATEGORY_COLORS = {
  prompt_leak: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
  rule_bypass: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
  injection: 'text-red-400 border-red-500/30 bg-red-500/5',
};

var CLASS_THEME = {
  overt: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400', dot: 'bg-red-500' },
  indirect: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400', dot: 'bg-blue-500' },
  social_cognitive: { border: 'border-orange-500/30', bg: 'bg-orange-500/5', text: 'text-orange-400', dot: 'bg-orange-500' },
  evasive: { border: 'border-purple-500/30', bg: 'bg-purple-500/5', text: 'text-purple-400', dot: 'bg-purple-500' },
};

export default function CatalogTab({ onSwitchToPlayground, onLaunchCampaign }) {
  var { t } = useTranslation();
  var [catalog, setCatalog] = useState({});
  var [results, setResults] = useState({});
  var [loading, setLoading] = useState(true);
  var [runningAttack, setRunningAttack] = useState(null);
  var [offline, setOffline] = useState(false);
  var [expandedCats, setExpandedCats] = useState({});
  var [diffTarget, setDiffTarget] = useState(null);
  var [baseRecord, setBaseRecord] = useState("");
  var [viewMode, setViewMode] = useState('legacy');
  var [taxonomyTree, setTaxonomyTree] = useState(null);
  var [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    // Fetch base record for diffing
    fetch('/api/content')
      .then(r => r.json())
      .then(data => setBaseRecord(data.record_safe || ""))
      .catch(() => setBaseRecord("MSH|^~\\&|DA_VINCI|OR1|PACS|HOSPITAL|202603111116||ADT^A08|489201|P|2.5\nPID|||489201-A||SMITH^JOHN||19580412|M\nPV1||I|SURG|||||MILLER^M\nOBR|1||489201-A^DA_VINCI|SurgProc^General|||202603110830\nOBX|1|TX|GDT^General Diagnosis||Patient stable for surgery. Ischemia risk assessed."));
  }, []);

  const getInfectedRecord = (attackMessage) => {
    const lines = baseRecord.split('\n');
    return lines.map(line => {
      if (line.startsWith('OBX|')) {
        const parts = line.split('|');
        parts[5] = parts[5] + ' ' + attackMessage;
        return parts.join('|');
      }
      return line;
    }).join('\n');
  };

  var { data: _catalogData, error: catalogError } = useFetchWithCache('/api/redteam/catalog');
  var { data: _taxTree } = useFetchWithCache(viewMode === 'taxonomy' ? '/api/redteam/taxonomy/tree' : null);

  useEffect(function() {
    if (_catalogData) {
      setCatalog(_catalogData);
      var init = {};
      Object.keys(_catalogData).forEach(function(k) { init[k] = true; });
      setExpandedCats(init);
      setLoading(false);
    }
    if (catalogError) { setOffline(true); setLoading(false); }
  }, [_catalogData, catalogError]);

  useEffect(function() {
    if (_taxTree) setTaxonomyTree(_taxTree);
  }, [_taxTree]);

  var toggleNode = function(nodeId) {
    setExpandedNodes(function(prev) {
      var next = Object.assign({}, prev);
      next[nodeId] = !prev[nodeId];
      return next;
    });
  };

  const toggleCategory = (cat) => {
    setExpandedCats(function(prev) {
      var next = Object.assign({}, prev);
      next[cat] = !prev[cat];
      return next;
    });
  };

  const runSingleAttack = async (attackType, attackMessage, index) => {
    var key = attackType + '-' + index;
    setRunningAttack(key);
    robotEventBus.emit('redteam:attack_start', { attack_type: attackType, message: attackMessage });
    try {
      const res = await fetch('/api/redteam/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: attackType, attack_message: attackMessage }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      setResults((prev) => ({ ...prev, [key]: data }));
      robotEventBus.emit('redteam:attack_result', data);
    } catch (e) {
      setResults((prev) => ({ ...prev, [key]: { error: e.message } }));
    } finally {
      setRunningAttack(null);
    }
  };

  const deleteAttack = async (category, index) => {
    await fetch('/api/redteam/catalog/' + category + '/' + index, { method: 'DELETE' });
    setCatalog((prev) => {
      const updated = { ...prev };
      updated[category] = [...updated[category]];
      updated[category].splice(index, 1);
      return updated;
    });
  };

  const getResultBadge = (key) => {
    const r = results[key];
    if (!r) return null;
    if (r.error) return <span className="text-yellow-500 text-xs">ERR</span>;
    const s = r.scores || {};
    if (s.prompt_leak) return <span className="text-purple-400 text-xs font-bold">LEAK</span>;
    if (s.rule_bypass) return <span className="text-orange-400 text-xs font-bold">BYPASS</span>;
    if (s.injection_success) return <span className="text-red-400 text-xs font-bold">INJECTED</span>;
    return <span className="text-[#00ff41] text-xs font-bold">BLOCKED</span>;
  };

  if (loading) return <p className="text-gray-600 animate-pulse">{t('redteam.catalog.loading')}</p>;

  if (offline) return (
    <div className="border border-yellow-500/30 rounded p-4 bg-yellow-500/5 text-center">
      <div className="text-yellow-400 font-mono text-xs font-bold mb-2">{t('redteam.catalog.offline.title')}</div>
      <p className="text-[11px] text-gray-400">{t('redteam.catalog.offline.desc')}</p>
      <p className="text-[10px] text-gray-600 mt-1">Run: <code className="text-gray-400">cd backend && python3 server.py</code></p>
    </div>
  );

  // Render taxonomy tree view
  var renderTaxonomyTree = function() {
    if (!taxonomyTree || !taxonomyTree.classes) {
      return <p className="text-neutral-500 text-xs animate-pulse">Loading taxonomy...</p>;
    }
    return (
      <div className="space-y-2">
        {taxonomyTree.classes.map(function(cls) {
          var theme = CLASS_THEME[cls.id] || CLASS_THEME.overt;
          var clsKey = 'cls_' + cls.id;
          var isExpanded = expandedNodes[clsKey];
          return (
            <div key={cls.id} className={'border rounded-lg ' + theme.border + ' ' + theme.bg}>
              <button
                onClick={function() { toggleNode(clsKey); }}
                className="w-full px-3 py-2 font-bold text-xs tracking-wider flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className={'flex items-center gap-2 ' + theme.text}>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className={'w-2 h-2 rounded-full ' + theme.dot} />
                  {t('redteam.taxonomy.class.' + cls.id, { defaultValue: cls.label })}
                </span>
                <span className="text-neutral-500 text-[10px] font-mono">
                  {(cls.template_count || 0) + ' templates'}
                </span>
              </button>
              {isExpanded && (
                <div className="pl-4 pb-2 space-y-1">
                  {(cls.categories || []).map(function(cat) {
                    var catKey = 'cat_' + cat.id;
                    var catExpanded = expandedNodes[catKey];
                    var hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    var directTechs = cat.techniques || [];
                    return (
                      <div key={cat.id}>
                        <button
                          onClick={function() { toggleNode(catKey); }}
                          className="w-full px-2 py-1 text-[11px] text-neutral-300 flex items-center gap-1 hover:bg-white/5 rounded cursor-pointer"
                        >
                          {catExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-neutral-600 ml-1">({cat.template_count || 0})</span>
                        </button>
                        {catExpanded && (
                          <div className="pl-4 space-y-0.5">
                            {hasSubs && cat.subcategories.map(function(sub) {
                              var subKey = 'sub_' + sub.id;
                              var subExpanded = expandedNodes[subKey];
                              return (
                                <div key={sub.id}>
                                  <button
                                    onClick={function() { toggleNode(subKey); }}
                                    className="w-full px-2 py-0.5 text-[10px] text-neutral-400 flex items-center gap-1 hover:bg-white/5 rounded cursor-pointer"
                                  >
                                    {subExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                    <span>{sub.label}</span>
                                    <span className="text-neutral-600 ml-1">({sub.template_count || 0})</span>
                                  </button>
                                  {subExpanded && (
                                    <div className="pl-4">
                                      {(sub.techniques || []).map(function(tech) {
                                        var hasTemplates = tech.templates && tech.templates.length > 0;
                                        return (
                                          <div key={tech.id} className="flex items-center gap-2 px-2 py-0.5 group">
                                            <span className={'w-1.5 h-1.5 rounded-full flex-shrink-0 ' + (hasTemplates ? 'bg-emerald-500' : 'bg-neutral-700')} />
                                            <span className={'text-[10px] font-mono flex-1 ' + (hasTemplates ? 'text-neutral-300' : 'text-neutral-600')}>
                                              {tech.label}
                                            </span>
                                            {!hasTemplates && (
                                              <span className="text-[9px] font-mono text-neutral-700 bg-neutral-800 px-1 rounded">
                                                {t('redteam.taxonomy.coverage.gap')}
                                              </span>
                                            )}
                                            {hasTemplates && tech.templates.map(function(tpl) {
                                              return (
                                                <span key={tpl.id} className="text-[9px] text-emerald-500/70 font-mono truncate max-w-32" title={tpl.name}>
                                                  {tpl.name}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {directTechs.map(function(tech) {
                              var hasTemplates = tech.templates && tech.templates.length > 0;
                              return (
                                <div key={tech.id} className="flex items-center gap-2 px-2 py-0.5 group">
                                  <span className={'w-1.5 h-1.5 rounded-full flex-shrink-0 ' + (hasTemplates ? 'bg-emerald-500' : 'bg-neutral-700')} />
                                  <span className={'text-[10px] font-mono flex-1 ' + (hasTemplates ? 'text-neutral-300' : 'text-neutral-600')}>
                                    {tech.label}
                                  </span>
                                  {!hasTemplates && (
                                    <span className="text-[9px] font-mono text-neutral-700 bg-neutral-800 px-1 rounded">
                                      {t('redteam.taxonomy.coverage.gap')}
                                    </span>
                                  )}
                                  {hasTemplates && tech.templates.map(function(tpl) {
                                    return (
                                      <span key={tpl.id} className="text-[9px] text-emerald-500/70 font-mono truncate max-w-32" title={tpl.name}>
                                        {tpl.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* View mode toggle */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={function() { setViewMode('legacy'); }}
          className={'flex items-center gap-1 px-3 py-1 text-[10px] font-mono rounded transition-colors ' + (viewMode === 'legacy' ? 'bg-neutral-700 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300')}
        >
          <List size={12} /> {t('redteam.taxonomy.view.legacy')}
        </button>
        <button
          onClick={function() { setViewMode('taxonomy'); }}
          className={'flex items-center gap-1 px-3 py-1 text-[10px] font-mono rounded transition-colors ' + (viewMode === 'taxonomy' ? 'bg-neutral-700 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300')}
        >
          <GitBranch size={12} /> {t('redteam.taxonomy.view.tree')}
        </button>
      </div>

      {/* Taxonomy tree view */}
      {viewMode === 'taxonomy' && renderTaxonomyTree()}

      {/* Legacy category view */}
      {viewMode === 'legacy' && Object.entries(catalog).map(([category, attacks]) => (
        <div key={category} className={'border rounded-lg ' + (CATEGORY_COLORS[category] || 'border-gray-700')}>
          <button
            onClick={() => toggleCategory(category)}
            className="w-full px-3 py-2 font-bold text-xs tracking-wider flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-1">
              {expandedCats[category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {t('redteam.category.' + category, { defaultValue: category.toUpperCase() })} ({attacks.length})
            </span>
          </button>
          {expandedCats[category] && <div className="divide-y divide-gray-800/50">
            {attacks.map((attack, i) => {
              var key = category + '-' + i;
              var isRunning = runningAttack === key;
              return (
                <div key={category + '-' + i} className="px-3 py-2 flex items-center gap-2 hover:bg-white/5 group">
                  <button
                    onClick={() => runSingleAttack(category, attack, i)}
                    disabled={isRunning}
                    className="text-gray-600 hover:text-[#00ff41] transition-colors disabled:animate-spin"
                    title={t('redteam.catalog.tooltip.launch')}
                  >
                    <Play size={12} />
                  </button>
                  <span className="flex-1 text-xs text-gray-400 truncate">{attack}</span>
                  {getResultBadge(key)}
                  <button
                    onClick={() => setDiffTarget({ 
                      attack: attack, 
                      category: category, 
                      safe: baseRecord, 
                      infected: getInfectedRecord(attack) 
                    })}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                    title={t('redteam.catalog.tooltip.scan')}
                  >
                    <FileSearch size={12} />
                  </button>
                  <button
                    onClick={() => onSwitchToPlayground?.(category, attack)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-blue-400 transition-all"
                    title={t('redteam.catalog.tooltip.edit')}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => deleteAttack(category, i)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                    title={t('redteam.catalog.tooltip.delete')}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>}
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-800">
        <button
          onClick={() => onSwitchToPlayground?.('injection', '')}
          className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                     text-gray-400 hover:text-[#00ff41] border border-gray-700
                     hover:border-[#00ff41]/30 rounded transition-colors"
        >
          <Plus size={12} /> {t('redteam.catalog.btn.new')}
        </button>
        <button
          onClick={() => onLaunchCampaign?.()}
          className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                     text-[#00ff41] border border-[#00ff41]/30
                     hover:bg-[#00ff41]/10 rounded transition-colors"
        >
          <PlayCircle size={12} /> {t('redteam.catalog.btn.launch_all')}
        </button>
        <label className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold text-gray-400
                         border border-gray-700 rounded hover:border-gray-500 transition-colors cursor-pointer">
          <Upload size={12} /> {t('redteam.catalog.btn.import')}
          <input type="file" accept=".json" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            const data = JSON.parse(text);
            await fetch('/api/redteam/catalog/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ catalog: data }),
            });
            setCatalog(data);
          }} />
        </label>
      </div>

      <InfectionDiff 
        isOpen={!!diffTarget}
        onClose={() => setDiffTarget(null)}
        safeRecord={diffTarget?.safe}
        infectedRecord={diffTarget?.infected}
        attackType={diffTarget?.category}
      />
    </div>
  );
}
