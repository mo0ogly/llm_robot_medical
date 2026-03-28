import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Save, Download, Settings2, ShieldAlert } from 'lucide-react';
import { ATTACK_TEMPLATES } from './attackTemplates';
import AgentLevelSelector from './AgentLevelSelector';
import AttackStepper from './AttackStepper';
import robotEventBus from '../../utils/robotEventBus';

const CATEGORIES = ['prompt_leak', 'rule_bypass', 'injection'];

export default function PlaygroundTab({ initialCategory, initialMessage }) {
  const { t, i18n } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [category, setCategory] = useState(initialCategory || 'injection');
  const [variables, setVariables] = useState(ATTACK_TEMPLATES[0].variables);
  const [customText, setCustomText] = useState(initialMessage || '');
  const [useCustom, setUseCustom] = useState(!!initialMessage);
  const [result, setResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [mode, setMode] = useState('attack'); // 'attack' | 'prompts'
  const [prompts, setPrompts] = useState({});
  const [allPrompts, setAllPrompts] = useState({}); 
  const [selectedLevel, setSelectedLevel] = useState('normal');
  const [activeAgent, setActiveAgent] = useState('MedicalRobotAgent');
  const [promptSaving, setPromptSaving] = useState(false);
  const [levels, setLevels] = useState({ medical: 'normal', redteam: 'normal', security: 'normal' });
  const [showConfig, setShowConfig] = useState(false);
  const [showStepper, setShowStepper] = useState(false);

  const applyTemplate = (index) => {
    const tmpl = ATTACK_TEMPLATES[index];
    setSelectedTemplate(index);
    setCategory(tmpl.category);
    setVariables({ ...tmpl.variables });
    setUseCustom(tmpl.template === '');
    if (tmpl.template === '') {
      setCustomText('');
    }
  };

  const resolveTemplate = () => {
    if (useCustom) return customText;
    const tmpl = ATTACK_TEMPLATES[selectedTemplate];
    let text = tmpl.template;
    for (const [key, value] of Object.entries(variables)) {
      text = text.replaceAll('{{' + key + '}}', value);
    }
    return text;
  };

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const payload = resolveTemplate();
      robotEventBus.emit('redteam:attack_start', { attack_type: category, message: payload });
      const res = await fetch('/api/redteam/attack?lang=' + i18n.language, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          attack_type: category, 
          attack_message: payload,
          levels 
        }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      setResult(data);
      robotEventBus.emit('redteam:attack_result', data);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const loadPrompts = async () => {
    const res = await fetch('/api/redteam/agents/prompts/all?lang=' + i18n.language);
    const data = await res.json();
    setAllPrompts(data);
    // Also update the 'prompts' state which is used by the active instance if needed, 
    // but for editing we'll use allPrompts[activeAgent][selectedLevel]
  };

  const savePrompt = async () => {
    setPromptSaving(true);
    const content = allPrompts[activeAgent]?.[selectedLevel] || '';
    await fetch('/api/redteam/agents/' + activeAgent + '/prompt?level=' + selectedLevel + '&lang=' + i18n.language, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: content }),
    });
    setPromptSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'attack'} onChange={() => setMode('attack')}
                 className="accent-[#00ff41]" />
          <span className="text-xs text-gray-400">{t('redteam.playground.mode.attack')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'prompts'}
                 onChange={() => { setMode('prompts'); loadPrompts(); }}
                 className="accent-[#00ff41]" />
          <span className="text-xs text-gray-400">{t('redteam.playground.mode.prompts')}</span>
        </label>
      </div>

      {/* Levels configuration */}
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-[#00ff41] transition-colors"
        >
          <Settings2 size={12} />
          {showConfig ? t('redteam.scenarios.btn.hide_config') : t('redteam.scenarios.btn.show_config')}
        </button>
      </div>

      {showConfig && (
        <AgentLevelSelector levels={levels} onChange={setLevels} />
      )}

      {mode === 'attack' && (
        <>
          {/* Template selector */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">{t('redteam.playground.label.template')}</label>
            <select
              value={selectedTemplate}
              onChange={(e) => applyTemplate(Number(e.target.value))}
              className="w-full bg-[#111] border border-gray-800 rounded px-3 py-2
                         text-xs text-gray-300 font-mono focus:border-[#00ff41]/50 focus:outline-none"
            >
              {ATTACK_TEMPLATES.map((tmpl, i) => (
                <option key={i} value={i}>{tmpl.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">{t('redteam.playground.label.category')}</label>
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
                  {t('redteam.category.' + c)}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              {useCustom ? t('redteam.playground.label.attack_free') : t('redteam.playground.label.template_preview')}
            </label>
            <textarea
              value={useCustom ? customText : resolveTemplate()}
              onChange={(e) => { setUseCustom(true); setCustomText(e.target.value); }}
              rows={6}
              className="w-full bg-[#111] border border-gray-800 rounded px-3 py-2
                         text-xs text-[#00ff41] font-mono resize-y
                         focus:border-[#00ff41]/50 focus:outline-none"
              placeholder={t('redteam.playground.placeholder.attack')}
            />
          </div>

          {/* Variables */}
          {!useCustom && Object.keys(variables).length > 0 && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">{t('redteam.playground.label.variables')}</label>
              <div className="space-y-1">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-purple-400 w-28 shrink-0">{'{{' + key + '}}'}</span>
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
              <Play size={12} /> {testing ? t('redteam.playground.btn.testing') : t('redteam.playground.btn.test')}
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold
                         text-gray-400 border border-gray-700 rounded
                         hover:border-gray-500 transition-colors"
            >
              <Save size={12} /> {t('redteam.playground.btn.save')}
            </button>
            <button
              onClick={() => { setShowStepper(!showStepper); setResult(null); }}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold transition-all rounded border
                         ${showStepper ? 'text-red-400 border-red-500/50 bg-red-500/10' : 'text-gray-400 border-gray-700 hover:border-red-500/30'}`}
              title={t('redteam.playground.tooltip.stepper')}
            >
              <ShieldAlert size={12} /> {showStepper ? t('redteam.playground.btn.close_pipeline') : t('redteam.playground.btn.live_pipeline')}
            </button>
            <button
              onClick={() => {
                const data = { category, message: resolveTemplate(), template: ATTACK_TEMPLATES[selectedTemplate].name };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'attack.json'; a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold
                         text-gray-400 border border-gray-700 rounded
                         hover:border-gray-500 transition-colors"
            >
              <Download size={12} /> {t('redteam.playground.btn.export')}
            </button>
          </div>

          {/* Stepper */}
          {showStepper && (
            <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-3 px-1">
                <ShieldAlert size={14} className="text-red-500" />
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-[0.3em]">
                  {t('redteam.playground.stepper_title')}
                </span>
              </div>
              <AttackStepper 
                attackMessage={resolveTemplate()} 
                onExploit={runTest} 
              />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="border border-gray-800 rounded p-3 bg-[#111]">
              <div className="text-xs text-gray-600 mb-2">{t('redteam.playground.label.result')}</div>
              {result.error ? (
                <p className="text-yellow-500 text-xs">{result.error}</p>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    {result.scores?.prompt_leak && <span className="text-purple-400 text-xs font-bold px-2 py-0.5 bg-purple-500/10 rounded">{t('redteam.playground.badge.leak')}</span>}
                    {result.scores?.rule_bypass && <span className="text-orange-400 text-xs font-bold px-2 py-0.5 bg-orange-500/10 rounded">{t('redteam.playground.badge.bypass')}</span>}
                    {result.scores?.injection_success && <span className="text-red-400 text-xs font-bold px-2 py-0.5 bg-red-500/10 rounded">{t('redteam.playground.badge.injected')}</span>}
                    {!result.scores?.prompt_leak && !result.scores?.rule_bypass && !result.scores?.injection_success && (
                      <span className="text-[#00ff41] text-xs font-bold px-2 py-0.5 bg-[#00ff41]/10 rounded">{t('redteam.playground.badge.blocked')}</span>
                    )}
                  </div>
                  <details className="text-xs">
                    <summary className="text-gray-500 cursor-pointer hover:text-gray-300">{t('redteam.playground.result.davinci_response')}</summary>
                    <pre className="mt-2 text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {result.target_response}
                    </pre>
                  </details>
                  <details className="text-xs mt-1">
                    <summary className="text-gray-500 cursor-pointer hover:text-gray-300">{t('redteam.playground.result.aegis_analysis')}</summary>
                    <pre className="mt-2 text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {result.audit_analysis}
                    </pre>
                  </details>
                </>
              )}
            </div>
          )}
        </>
      )}

      {mode === 'prompts' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {Object.keys(allPrompts).map((name) => (
              <button key={name} onClick={() => setActiveAgent(name)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors
                                 ${activeAgent === name
                                   ? 'text-[#00ff41] border-[#00ff41]/50 bg-[#00ff41]/5'
                                   : 'text-gray-600 border-gray-800 hover:border-gray-600'}`}>
                {name}
              </button>
            ))}
          </div>

          <div className="flex gap-1 border-t border-gray-800/50 pt-2">
            {['easy', 'normal', 'hard'].map((l) => (
              <button 
                key={l} 
                onClick={() => setSelectedLevel(l)}
                className={`flex-1 py-1 text-[9px] font-bold rounded border transition-all uppercase
                  ${selectedLevel === l 
                    ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' 
                    : 'text-gray-600 border-transparent hover:bg-white/5'}`}
              >
                {t('redteam.level.' + l)}
              </button>
            ))}
          </div>

          <textarea
            value={allPrompts[activeAgent]?.[selectedLevel] || ''}
            onChange={(e) => {
              const val = e.target.value;
              setAllPrompts(prev => ({
                ...prev,
                [activeAgent]: {
                  ...prev[activeAgent],
                  [selectedLevel]: val
                }
              }));
            }}
            rows={15}
            className="w-full bg-[#111] border border-gray-800 rounded px-3 py-2
                       text-xs text-[#00ff41] font-mono resize-y
                       focus:border-[#00ff41]/50 focus:outline-none"
          />
          <button onClick={savePrompt} disabled={promptSaving}
                  className="w-full px-4 py-2 text-xs font-mono font-bold text-[#00ff41] border border-[#00ff41]/50
                             rounded hover:bg-[#00ff41]/10 transition-colors disabled:opacity-50">
            {promptSaving ? t('redteam.playground.btn.saving') : t('redteam.playground.btn.save_prompt', { level: selectedLevel.toUpperCase() })}
          </button>
          <p className="text-[10px] text-gray-600 text-center italic">
            {t('redteam.playground.notes')}
          </p>
        </div>
      )}
    </div>
  );
}
