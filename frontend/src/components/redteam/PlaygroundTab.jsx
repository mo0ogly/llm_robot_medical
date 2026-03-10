// frontend/src/components/redteam/PlaygroundTab.jsx
import { useState } from 'react';
import { Play, Save, Download } from 'lucide-react';
import { ATTACK_TEMPLATES } from './attackTemplates';

const CATEGORIES = ['prompt_leak', 'rule_bypass', 'injection'];

export default function PlaygroundTab({ initialCategory, initialMessage }) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [category, setCategory] = useState(initialCategory || 'injection');
  const [variables, setVariables] = useState(ATTACK_TEMPLATES[0].variables);
  const [customText, setCustomText] = useState(initialMessage || '');
  const [useCustom, setUseCustom] = useState(!!initialMessage);
  const [result, setResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const applyTemplate = (index) => {
    const t = ATTACK_TEMPLATES[index];
    setSelectedTemplate(index);
    setCategory(t.category);
    setVariables({ ...t.variables });
    setUseCustom(t.template === '');
    if (t.template === '') {
      setCustomText('');
    }
  };

  const resolveTemplate = () => {
    if (useCustom) return customText;
    const t = ATTACK_TEMPLATES[selectedTemplate];
    let text = t.template;
    for (const [key, value] of Object.entries(variables)) {
      text = text.replaceAll(`{{${key}}}`, value);
    }
    return text;
  };

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch('/api/redteam/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: category, attack_message: resolveTemplate() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult(await res.json());
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Template selector */}
      <div>
        <label className="text-xs text-gray-600 block mb-1">TEMPLATE</label>
        <select
          value={selectedTemplate}
          onChange={(e) => applyTemplate(Number(e.target.value))}
          className="w-full bg-[#111] border border-gray-800 rounded px-3 py-2
                     text-xs text-gray-300 font-mono focus:border-[#00ff41]/50 focus:outline-none"
        >
          {ATTACK_TEMPLATES.map((t, i) => (
            <option key={i} value={i}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs text-gray-600 block mb-1">CATEGORIE</label>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors
                         ${category === c
                           ? 'text-[#00ff41] border-[#00ff41]/50 bg-[#00ff41]/5'
                           : 'text-gray-600 border-gray-800 hover:border-gray-600'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div>
        <label className="text-xs text-gray-600 block mb-1">
          {useCustom ? 'ATTAQUE (texte libre)' : 'TEMPLATE (preview)'}
        </label>
        <textarea
          value={useCustom ? customText : resolveTemplate()}
          onChange={(e) => { setUseCustom(true); setCustomText(e.target.value); }}
          rows={6}
          className="w-full bg-[#111] border border-gray-800 rounded px-3 py-2
                     text-xs text-[#00ff41] font-mono resize-y
                     focus:border-[#00ff41]/50 focus:outline-none"
          placeholder="Ecris ton attaque ici..."
        />
      </div>

      {/* Variables */}
      {!useCustom && Object.keys(variables).length > 0 && (
        <div>
          <label className="text-xs text-gray-600 block mb-1">VARIABLES</label>
          <div className="space-y-1">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-purple-400 w-28 shrink-0">{`{{${key}}}`}</span>
                <input
                  value={value}
                  onChange={(e) => setVariables((v) => ({ ...v, [key]: e.target.value }))}
                  className="flex-1 bg-[#111] border border-gray-800 rounded px-2 py-1
                             text-xs text-gray-300 font-mono focus:border-purple-500/50 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-800">
        <button
          onClick={runTest}
          disabled={testing}
          className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                     text-[#00ff41] border border-[#00ff41]/50 rounded
                     hover:bg-[#00ff41]/10 transition-colors disabled:opacity-50"
        >
          <Play size={12} /> {testing ? 'TESTING...' : 'TESTER'}
        </button>
        <button
          className="flex items-center gap-1 px-3 py-2 text-xs font-mono
                     text-gray-400 border border-gray-700 rounded
                     hover:border-gray-500 transition-colors"
        >
          <Save size={12} /> SAUVER
        </button>
        <button
          onClick={() => {
            const data = { category, message: resolveTemplate(), template: ATTACK_TEMPLATES[selectedTemplate].name };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'attack.json'; a.click();
          }}
          className="flex items-center gap-1 px-3 py-2 text-xs font-mono
                     text-gray-400 border border-gray-700 rounded
                     hover:border-gray-500 transition-colors"
        >
          <Download size={12} /> EXPORT
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="border border-gray-800 rounded p-3 bg-[#111]">
          <div className="text-xs text-gray-600 mb-2">RESULTAT</div>
          {result.error ? (
            <p className="text-yellow-500 text-xs">{result.error}</p>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                {result.scores?.prompt_leak && <span className="text-purple-400 text-xs font-bold px-2 py-0.5 bg-purple-500/10 rounded">LEAK</span>}
                {result.scores?.rule_bypass && <span className="text-orange-400 text-xs font-bold px-2 py-0.5 bg-orange-500/10 rounded">BYPASS</span>}
                {result.scores?.injection_success && <span className="text-red-400 text-xs font-bold px-2 py-0.5 bg-red-500/10 rounded">INJECTED</span>}
                {!result.scores?.prompt_leak && !result.scores?.rule_bypass && !result.scores?.injection_success && (
                  <span className="text-[#00ff41] text-xs font-bold px-2 py-0.5 bg-[#00ff41]/10 rounded">BLOCKED</span>
                )}
              </div>
              <details className="text-xs">
                <summary className="text-gray-500 cursor-pointer hover:text-gray-300">Reponse Da Vinci</summary>
                <pre className="mt-2 text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {result.target_response}
                </pre>
              </details>
              <details className="text-xs mt-1">
                <summary className="text-gray-500 cursor-pointer hover:text-gray-300">Analyse AEGIS</summary>
                <pre className="mt-2 text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {result.audit_analysis}
                </pre>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}
