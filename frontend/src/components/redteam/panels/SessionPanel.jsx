import { History, Download, Trash2 } from 'lucide-react';

export default function SessionPanel({
  panels, togglePanel, sessionHistory, setSessionHistory, showRetex, setShowRetex,
  retexPatterns, exportSession, t, PanelHeader
}) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <PanelHeader
        isOpen={panels.p5}
        onToggle={function() { togglePanel('p5'); }}
        icon={<History size={14} className="text-purple-500" />}
        title={t('redteam.studio.v2.panel.session')}
        subtitle={t('redteam.studio.v2.panel.session.desc') + ' — ' + sessionHistory.length + ' entries'}
        tag={sessionHistory.length + ' RUNS'}
        tagColor="bg-purple-500/15 text-purple-400"
      />
      {panels.p5 && (
        <div className="p-4 bg-black/30 border-t border-neutral-800 space-y-3">

          {/* Tab toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={function() { setShowRetex(false); }}
              className={'px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors ' +
                (!showRetex ? 'border-purple-500/50 bg-purple-500/10 text-purple-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
            >
              {t('redteam.studio.v2.history')}
            </button>
            <button
              onClick={function() { setShowRetex(true); }}
              className={'px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors ' +
                (showRetex ? 'border-purple-500/50 bg-purple-500/10 text-purple-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
            >
              {t('redteam.studio.v2.retex')}
            </button>
            <div className="flex-1" />
            <button
              onClick={exportSession}
              className="px-2 py-1 rounded text-[9px] font-mono text-neutral-600 border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-1"
            >
              <Download size={10} /> {t('redteam.studio.v2.export')}
            </button>
            <button
              onClick={function() {
                setSessionHistory([]);
                localStorage.removeItem('redteam_studio_v2_history');
              }}
              className="px-2 py-1 rounded text-[9px] font-mono text-neutral-600 border border-neutral-800 hover:border-red-500/30 transition-colors flex items-center gap-1"
            >
              <Trash2 size={10} /> {t('redteam.studio.v2.clear')}
            </button>
          </div>

          {/* History table */}
          {!showRetex && (
            <div className="max-h-48 overflow-y-auto">
              {sessionHistory.length === 0 ? (
                <div className="text-center py-6 text-neutral-600 text-[10px] font-mono">
                  {t('redteam.studio.v2.no_history')}
                </div>
              ) : (
                <table className="w-full text-[9px] font-mono">
                  <thead>
                    <tr className="text-neutral-600 border-b border-neutral-800">
                      <th className="text-left py-1 px-2">{t('redteam.studio.v2.col.time')}</th>
                      <th className="text-left py-1 px-2">{t('redteam.studio.v2.col.mode')}</th>
                      <th className="text-left py-1 px-2">{t('redteam.studio.v2.col.type')}</th>
                      <th className="text-left py-1 px-2">{t('redteam.studio.v2.col.payload')}</th>
                      <th className="text-right py-1 px-2">SVC</th>
                      <th className="text-right py-1 px-2">{t('redteam.studio.v2.col.threat_score')}</th>
                      <th className="text-center py-1 px-2">{t('redteam.studio.v2.col.risk_level')}</th>
                      <th className="text-center py-1 px-2">{t('redteam.studio.v2.col.result')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionHistory.map(function(entry, i) {
                      return (
                        <tr key={i} className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors">
                          <td className="py-1 px-2 text-neutral-500">{new Date(entry.date).toLocaleTimeString()}</td>
                          <td className="py-1 px-2 text-yellow-400">{(entry.mode || 'single').toUpperCase()}</td>
                          <td className="py-1 px-2 text-neutral-400">{(entry.attackType || '').replace('_', ' ')}</td>
                          <td className="py-1 px-2 text-neutral-400 max-w-[200px] truncate">{entry.payload}</td>
                          <td className="py-1 px-2 text-right text-cyan-400">{entry.svc !== null ? entry.svc.toFixed(2) : '-'}</td>
                          <td className="py-1 px-2 text-right text-orange-400">{entry.threat_score !== null && entry.threat_score !== undefined ? entry.threat_score.toFixed(4) : '-'}</td>
                          <td className="py-1 px-2 text-center">
                            {entry.risk_level === 'CRITICAL' ? <span className="text-red-500 font-bold">{entry.risk_level}</span>
                              : entry.risk_level === 'HIGH' ? <span className="text-red-400">{entry.risk_level}</span>
                              : entry.risk_level === 'MEDIUM' ? <span className="text-yellow-400">{entry.risk_level}</span>
                              : entry.risk_level === 'LOW' ? <span className="text-green-400">{entry.risk_level}</span>
                              : <span className="text-neutral-600">{entry.risk_level || '-'}</span>}
                          </td>
                          <td className="py-1 px-2 text-center">
                            {entry.breach === true ? <span className="text-red-400">BREACH</span>
                              : entry.breach === false ? <span className="text-green-400">SECURE</span>
                              : <span className="text-neutral-600">-</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* RETEX patterns */}
          {showRetex && (
            <div className="space-y-3">
              <div className="text-[9px] text-neutral-600 font-mono">
                {t('redteam.studio.v2.retex_desc')}
              </div>
              <table className="w-full text-[9px] font-mono">
                <thead>
                  <tr className="text-neutral-600 border-b border-neutral-800">
                    <th className="text-left py-1.5 px-2">{t('redteam.studio.v2.col.pattern')}</th>
                    <th className="text-center py-1.5 px-2">{t('redteam.studio.v2.col.effectiveness')}</th>
                    <th className="text-center py-1.5 px-2">ASR</th>
                    <th className="text-left py-1.5 px-2">{t('redteam.studio.v2.col.reference')}</th>
                  </tr>
                </thead>
                <tbody>
                  {retexPatterns.map(function(row, i) {
                    var effColor = row.eff === 'High' ? 'text-red-400 bg-red-500/10'
                      : row.eff === 'Medium' ? 'text-yellow-400 bg-yellow-500/10'
                      : 'text-neutral-500 bg-neutral-800/50';
                    return (
                      <tr key={i} className="border-b border-neutral-900">
                        <td className="py-1.5 px-2 text-neutral-300">{row.pattern}</td>
                        <td className="py-1.5 px-2 text-center">
                          <span className={'px-1.5 py-0.5 rounded text-[8px] font-bold ' + effColor}>{row.eff}</span>
                        </td>
                        <td className="py-1.5 px-2 text-center text-cyan-400">{row.asr}</td>
                        <td className="py-1.5 px-2 text-neutral-500">{row.ref}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Formal framework reference */}
              <div className="p-2.5 bg-blue-500/5 border border-blue-500/20 rounded text-[9px] font-mono text-neutral-500 space-y-1">
                <div className="text-blue-400 font-bold">Formal Framework References</div>
                <div>Integrity(S) := forall i in Inputs: Reachable(M,i) &sube; Allowed(i) — DY-AGENT Def. 7</div>
                <div>Sep(M) := |P(violation|data) - P(violation|instruction)| — Zverev et al. (ICLR 2025)</div>
                <div>SVC = sum(w_k * d_k) for k in [d1..d6] — Original thesis contribution (Ch. 4)</div>
                <div>Cosine drift: all-MiniLM-L6-v2 embedding distance — Reimers &amp; Gurevych (2019)</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
