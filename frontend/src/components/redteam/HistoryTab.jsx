// frontend/src/components/redteam/HistoryTab.jsx
import { useState, useEffect } from 'react';
import { Download, Trash2 } from 'lucide-react';

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [scenarioHistory, setScenarioHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('redteam_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
    const savedScenarios = localStorage.getItem('redteam_scenario_history');
    if (savedScenarios) {
      try { setScenarioHistory(JSON.parse(savedScenarios)); } catch {}
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('redteam_history');
    localStorage.removeItem('redteam_scenario_history');
    setHistory([]);
    setScenarioHistory([]);
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'redteam-history.json'; a.click();
  };

  if (history.length === 0 && scenarioHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-xs">Aucun historique enregistre.</p>
        <p className="text-gray-700 text-[10px] mt-2">
          Les campagnes et scenarios seront sauvegardes ici automatiquement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          {history.length} campagne(s), {scenarioHistory.length} scenario(s)
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
          <div className="text-[10px] text-gray-600 tracking-wider">CAMPAGNES</div>
          {history.map((campaign, i) => (
            <div key={`c-${i}`} className="border border-gray-800 rounded p-3 bg-[#111]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-mono">{campaign.date}</span>
                <span className="text-[10px] text-gray-600">{campaign.summary?.total_rounds} rounds</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-purple-400">{campaign.summary?.prompt_leaks || 0}</div>
                  <div className="text-[8px] text-gray-600">LEAKS</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-orange-400">{campaign.summary?.rule_bypasses || 0}</div>
                  <div className="text-[8px] text-gray-600">BYPASS</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-red-400">{campaign.summary?.injection_successes || 0}</div>
                  <div className="text-[8px] text-gray-600">INJECT</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Scenarios */}
      {scenarioHistory.length > 0 && (
        <>
          <div className="text-[10px] text-gray-600 tracking-wider mt-2">SCENARIOS</div>
          {scenarioHistory.map((entry, i) => (
            <div key={`s-${i}`} className="border border-gray-800 rounded p-3 bg-[#111]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-mono">{entry.date}</span>
                <span className="text-xs text-gray-300 font-bold">{entry.scenario_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <span className="text-gray-500">Etapes:</span>
                <span className={entry.steps_passed > 0 ? "text-red-400" : "text-[#00ff41]"}>
                  {entry.steps_passed}/{entry.total_steps} reussies
                </span>
                <span className="text-gray-500">Breach:</span>
                <span className="text-gray-300">
                  {entry.breach_point !== null ? `Etape ${entry.breach_point + 1}` : "Aucun"}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
