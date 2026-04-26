import { Settings, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

var AGENT_NAMES = ['MedicalRobotAgent', 'RedTeamAgent', 'SecurityAuditAgent'];
var LEVELS = ['easy', 'normal', 'hard'];

export default function SystemPromptPanel({
  panels, togglePanel, allPrompts, activeAgent, setActiveAgent,
  activeLevel, setActiveLevel, promptDraft, setPromptDraft,
  isSavingPrompt, promptSaveStatus, savePrompt, t, PanelHeader
}) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <PanelHeader
        isOpen={panels.p2}
        onToggle={function() { togglePanel('p2'); }}
        icon={<Settings size={14} className="text-cyan-500" />}
        title={t('redteam.studio.v2.panel.sysprompt')}
        subtitle={t('redteam.studio.v2.panel.sysprompt.desc')}
        tag={t('redteam.studio.v2.agents')}
        tagColor="bg-cyan-500/15 text-cyan-400"
      />
      {panels.p2 && (
        <div className="p-4 bg-black/30 border-t border-neutral-800 space-y-3">

          {/* Agent selector */}
          <div className="flex gap-2">
            {AGENT_NAMES.map(function(name) {
              var isActive = activeAgent === name;
              var shortName = name.replace('Agent', '');
              return (
                <button
                  key={name}
                  onClick={function() { setActiveAgent(name); }}
                  className={'px-3 py-1.5 rounded text-[10px] font-mono font-bold border transition-colors ' +
                    (isActive ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                >
                  {shortName}
                </button>
              );
            })}
            <div className="flex-1" />
            {/* Level selector */}
            {LEVELS.map(function(lvl) {
              var isActive = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={function() { setActiveLevel(lvl); }}
                  className={'px-2 py-1 rounded text-[9px] font-mono font-bold border transition-colors ' +
                    (isActive ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                >
                  {lvl.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Prompt editor */}
          <textarea
            value={promptDraft}
            onChange={function(e) { setPromptDraft(e.target.value); }}
            className="w-full h-48 bg-black border border-neutral-800 rounded p-3 font-mono text-[11px] text-cyan-300/80 outline-none resize-none focus:border-cyan-500/30"
            placeholder={t('redteam.studio.v2.select_template')}
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={savePrompt}
              disabled={isSavingPrompt}
              className={'px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all ' +
                (isSavingPrompt ? 'bg-neutral-800 text-neutral-500' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30')}
            >
              {isSavingPrompt ? t('redteam.studio.v2.saving') : t('redteam.studio.v2.save_prompt') + ' ' + activeLevel.toUpperCase()}
            </button>
            <button
              onClick={function() {
                if (allPrompts[activeAgent] && allPrompts[activeAgent][activeLevel]) {
                  setPromptDraft(allPrompts[activeAgent][activeLevel]);
                }
              }}
              className="px-2 py-1.5 rounded text-[10px] font-mono text-neutral-600 border border-neutral-800 hover:border-neutral-600 transition-colors"
            >
              <RotateCcw size={10} className="inline mr-1" />{t('redteam.studio.v2.reset')}
            </button>
            {promptSaveStatus === 'success' && (
              <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                <CheckCircle size={10} /> {t('redteam.studio.v2.saved')}
              </span>
            )}
            {promptSaveStatus === 'error' && (
              <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                <XCircle size={10} /> {t('redteam.studio.v2.failed')}
              </span>
            )}
            <div className="flex-1" />
            <span className="text-[9px] text-neutral-700 font-mono">
              AllowedOutputSpec: max_tension=800g | forbidden=[freeze_instruments]
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
