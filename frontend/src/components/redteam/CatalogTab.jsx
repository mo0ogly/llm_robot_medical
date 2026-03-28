// frontend/src/components/redteam/CatalogTab.jsx
import { useState, useEffect } from 'react';
import { Play, Pencil, Trash2, Plus, PlayCircle, Upload, FileSearch, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfectionDiff from './InfectionDiff';
import robotEventBus from '../../utils/robotEventBus';

const CATEGORY_COLORS = {
  prompt_leak: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
  rule_bypass: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
  injection: 'text-red-400 border-red-500/30 bg-red-500/5',
};

export default function CatalogTab({ onSwitchToPlayground, onLaunchCampaign }) {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [runningAttack, setRunningAttack] = useState(null);
  const [offline, setOffline] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});
  const [diffTarget, setDiffTarget] = useState(null); // { attack, category, safe, infected }
  const [baseRecord, setBaseRecord] = useState("");

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
        parts[5] = `${parts[5]} ${attackMessage}`;
        return parts.join('|');
      }
      return line;
    }).join('\n');
  };

  useEffect(() => {
    fetch('/api/redteam/catalog')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        setCatalog(data);
        const init = {};
        Object.keys(data).forEach(function(k) { init[k] = true; });
        setExpandedCats(init);
        setLoading(false);
      })
      .catch(() => { setOffline(true); setLoading(false); });
  }, []);

  const toggleCategory = (cat) => {
    setExpandedCats(function(prev) {
      var next = Object.assign({}, prev);
      next[cat] = !prev[cat];
      return next;
    });
  };

  const runSingleAttack = async (attackType, attackMessage, index) => {
    const key = `${attackType}-${index}`;
    setRunningAttack(key);
    robotEventBus.emit('redteam:attack_start', { attack_type: attackType, message: attackMessage });
    try {
      const res = await fetch('/api/redteam/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: attackType, attack_message: attackMessage }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    await fetch(`/api/redteam/catalog/${category}/${index}`, { method: 'DELETE' });
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

  return (
    <div className="space-y-4">
      {Object.entries(catalog).map(([category, attacks]) => (
        <div key={category} className={`border rounded-lg ${CATEGORY_COLORS[category] || 'border-gray-700'}`}>
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
              const key = `${category}-${i}`;
              const isRunning = runningAttack === key;
              return (
                <div key={`${category}-${i}`} className="px-3 py-2 flex items-center gap-2 hover:bg-white/5 group">
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
