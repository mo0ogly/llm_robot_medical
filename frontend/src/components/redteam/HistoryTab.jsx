// frontend/src/components/redteam/HistoryTab.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2 } from 'lucide-react';

export default function HistoryTab() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const [studioHistory, setStudioHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('redteam_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
    const savedScenarios = localStorage.getItem('redteam_scenario_history');
    if (savedScenarios) {
      try { setScenarioHistory(JSON.parse(savedScenarios)); } catch {}
    }
    const savedStudio = localStorage.getItem('redteam_studio_history');
    if (savedStudio) {
      try { setStudioHistory(JSON.parse(savedStudio)); } catch {}
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('redteam_history');
    localStorage.removeItem('redteam_scenario_history');
    localStorage.removeItem('redteam_studio_history');
    setHistory([]);
    setScenarioHistory([]);
    setStudioHistory([]);
  };

  const exportAll = () => {
    const data = { campaigns: history, scenarios: scenarioHistory, studio: studioHistory };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'redteam-history.json'; a.click();
  };

  if (history.length === 0 && scenarioHistory.length === 0 && studioHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-xs">{t('redteam.history.empty')}</p>
        <p className="text-gray-700 text-[10px] mt-2">
          {t('redteam.history.emptyDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          {history.length} {t('redteam.history.camp')}, {scenarioHistory.length} {t('redteam.history.scen')}, {studioHistory.length} {t('redteam.history.studio')}
        </span>
        <div className="flex gap-2">
          <button onClick={exportAll} className="text-gray-600 hover:text-gray-300 transition-colors">
            <Download size={14} />
          </button>
          <button onClick={clearHistory} className="text-gray-600 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Campaigns */}
      {history.length > 0 && (
        <>
          <div className="text-[10px] text-gray-600 tracking-wider">{t('redteam.history.campaigns')}</div>
          {history.map((campaign, i) => (
            <div key={'c-' + i} className="border border-gray-800 rounded p-3 bg-[#111]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-mono">{campaign.date}</span>
                <span className="text-[10px] text-gray-600">{campaign.summary?.total_rounds} {t('redteam.history.rounds')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-purple-400">{campaign.summary?.prompt_leaks || 0}</div>
                  <div className="text-[8px] text-gray-600">{t('redteam.history.leaks')}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-orange-400">{campaign.summary?.rule_bypasses || 0}</div>
                  <div className="text-[8px] text-gray-600">{t('redteam.history.bypass')}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-red-400">{campaign.summary?.injection_successes || 0}</div>
                  <div className="text-[8px] text-gray-600">{t('redteam.history.inject')}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Scenarios */}
      {scenarioHistory.length > 0 && (
        <>
          <div className="text-[10px] text-gray-600 tracking-wider mt-2">{t('redteam.history.scenarios')}</div>
          {scenarioHistory.map((entry, i) => (
            <div key={'s-' + i} className="border border-gray-800 rounded p-3 bg-[#111]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-mono">{entry.date}</span>
                <span className="text-xs text-gray-300 font-bold">{entry.scenario_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <span className="text-gray-500">{t('redteam.history.steps')}</span>
                <span className={entry.steps_passed > 0 ? "text-red-400" : "text-[#00ff41]"}>
                  {entry.steps_passed}/{entry.total_steps} {t('redteam.history.successful')}
                </span>
                <span className="text-gray-500">{t('redteam.history.breach')}</span>
                <span className="text-gray-300">
                  {entry.breach_point !== null ? t('redteam.history.step') + ' ' + (entry.breach_point + 1) : t('redteam.history.none')}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
      {/* Studio Sessions */}
      {studioHistory.length > 0 && (
        <>
          <div className="text-[10px] text-gray-600 tracking-wider mt-2">{t('redteam.history.studioExploits')}</div>
          {studioHistory.map((session, i) => (
            <div key={'st-' + i} className="border border-gray-800 rounded p-3 bg-[#111]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-mono">{session.date?.slice(0, 16).replace('T', ' ')}</span>
                <span className={'text-[10px] font-bold ' + (session.result?.scores?.injection_success ? 'text-red-500' : 'text-[#00ff41]')}>
                    {session.result?.scores?.injection_success ? t('redteam.history.breachLabel') : t('redteam.history.blocked')}
                </span>
              </div>
              <div className="text-[10px] text-gray-300 mb-1 flex justify-between">
                <span>{session.template}</span>
                <span className="text-gray-600">{session.technique}</span>
              </div>
              <div className="text-[9px] text-gray-500 truncate italic">
                {session.payload}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
