import { BarChart3, AlertTriangle, XCircle, ShieldAlert, Scale } from 'lucide-react';

// ── Helper: threat score color ──
function threatColor(score) {
  if (score >= 0.6) return 'bg-red-500';
  if (score >= 0.4) return 'bg-orange-500';
  if (score >= 0.2) return 'bg-yellow-500';
  return 'bg-green-500';
}

function threatTextColor(score) {
  if (score >= 0.6) return 'text-red-400';
  if (score >= 0.4) return 'text-orange-400';
  if (score >= 0.2) return 'text-yellow-400';
  return 'text-green-400';
}

function riskLevel(score) {
  if (score >= 0.8) return { label: 'CRITICAL', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
  if (score >= 0.6) return { label: 'HIGH', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' };
  if (score >= 0.4) return { label: 'MEDIUM', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' };
  if (score >= 0.2) return { label: 'LOW', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
  return { label: 'NONE', color: 'bg-green-500/15 text-green-400 border-green-500/30' };
}

// ── Helper: judge gauge bar ──
function JudgeGauge({ label, value, max, invert }) {
  var pct = Math.round(((value || 0) / max) * 100);
  var effective = invert ? (max + 1 - (value || max)) / max : (value || 0) / max;
  var color = effective >= 0.7 ? 'bg-red-500' : effective >= 0.4 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="text-neutral-500 w-28 truncate font-mono">{label}</span>
      <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div className={color + ' h-full rounded-full transition-all duration-500'} style={{ width: pct + '%' }} />
      </div>
      <span className="text-neutral-400 w-6 text-right font-mono font-bold">{value !== null && value !== undefined ? value : '-'}</span>
    </div>
  );
}

export default function MetricsPanel({
  panels, togglePanel, svcResult, sepResult, attackResult, multiResult,
  dimConfig, nTrials, threatScore, judgeResult, t, PanelHeader, DimBar, StatusBadge
}) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <PanelHeader
        isOpen={panels.p4}
        onToggle={function() { togglePanel('p4'); }}
        icon={<BarChart3 size={14} className="text-green-500" />}
        title={t('redteam.studio.v2.panel.metrics')}
        subtitle={t('redteam.studio.v2.panel.metrics.desc')}
        tag={svcResult ? 'SVC=' + svcResult.svc.toFixed(2) : 'AWAITING'}
        tagColor={svcResult && svcResult.high_potential ? 'bg-red-500/15 text-red-400' : 'bg-neutral-800 text-neutral-500'}
      />
      {panels.p4 && (
        <div className="p-4 bg-black/30 border-t border-neutral-800 space-y-4">

          {/* No data state */}
          {!svcResult && !sepResult && !attackResult && !multiResult && (
            <div className="text-center py-8 text-neutral-600 text-[11px] font-mono">
              <BarChart3 size={24} className="mx-auto mb-2 opacity-30" />
              {t('redteam.studio.v2.awaiting')}
              <div className="text-[9px] mt-1 text-neutral-700">
                Integrity(S) := Reachable(M,i) &sube; Allowed(i) — DY-AGENT Def. 7
              </div>
            </div>
          )}

          {/* Single attack result */}
          {attackResult && !attackResult.error && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">{t('redteam.studio.v2.verdict')}</span>
                <StatusBadge success={attackResult.scores && attackResult.scores.injection_success} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                  <div className="text-[9px] text-neutral-600 uppercase font-mono mb-1">{t('redteam.studio.v2.target_response')}</div>
                  <div className="text-[11px] text-neutral-400 line-clamp-4 italic leading-relaxed">
                    {attackResult.target_response || 'No response'}
                  </div>
                </div>
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                  <div className="text-[9px] text-neutral-600 uppercase font-mono mb-1">{t('redteam.studio.v2.aegis_analysis')}</div>
                  <div className="text-[11px] text-blue-400/70 line-clamp-4 leading-relaxed">
                    {attackResult.audit_analysis ? attackResult.audit_analysis.split('\n')[0] : 'No analysis'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-trial result */}
          {multiResult && (
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
              <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                Multi-Trial Results (N={multiResult.n_trials || nTrials})
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-400 font-mono">
                    {multiResult.violation_rate !== undefined ? (multiResult.violation_rate * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.violation_rate')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400 font-mono">
                    {multiResult.ci_lower !== undefined ? '[' + (multiResult.ci_lower * 100).toFixed(1) + '%, ' + (multiResult.ci_upper * 100).toFixed(1) + '%]' : 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.wilson_ci')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">
                    {multiResult.n_violations !== undefined ? multiResult.n_violations + '/' + (multiResult.n_trials || nTrials) : 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.violations_total')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sep(M) result */}
          {sepResult && (
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  {t('redteam.studio.v2.sep_score')}
                </span>
                {!sepResult.statistically_valid && (
                  <span className="text-[8px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded font-mono border border-amber-500/30">
                    {t('redteam.studio.v2.stat_invalid_badge')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <div className={'text-2xl font-bold font-mono ' + (sepResult.sep_score >= 0.5 ? 'text-green-400' : 'text-red-400')}>
                    {sepResult.sep_score !== undefined ? sepResult.sep_score.toFixed(3) : 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">Sep(M) score</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-400 font-mono">
                    {sepResult.p_data !== undefined ? (sepResult.p_data * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">P(viol|data)</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-400 font-mono">
                    {sepResult.p_instr !== undefined ? (sepResult.p_instr * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">P(viol|instr)</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-400 font-mono">
                    {sepResult.interpretation || 'N/A'}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono">Interpretation</div>
                </div>
              </div>
              {sepResult.warnings && sepResult.warnings.length > 0 && (
                <div className="text-[9px] text-amber-400/70 font-mono mt-1">
                  {sepResult.warnings.join(' | ')}
                </div>
              )}
            </div>
          )}

          {/* SVC 6-Dimensional scoring */}
          {svcResult && (
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    {t('redteam.studio.v2.svc_title')}
                  </span>
                  <span className={'px-2 py-0.5 text-[9px] font-mono font-bold rounded border ' +
                    (svcResult.high_potential ? 'bg-red-500/15 text-red-400 border-red-500/30'
                      : svcResult.svc >= 0.5 ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                      : 'bg-neutral-800 text-neutral-500 border-neutral-700')}>
                    {svcResult.interpretation}
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-white">
                  {svcResult.svc.toFixed(3)}
                </span>
              </div>

              {/* Dimension bars */}
              <div className="space-y-1.5">
                {Object.keys(dimConfig.labels).length > 0 ? Object.keys(dimConfig.labels).map(function(d) {
                  return (
                    <DimBar
                      key={d}
                      id={d}
                      label={dimConfig.labels[d]}
                      value={svcResult.dimensions ? svcResult.dimensions[d] : 0}
                      weight={dimConfig.weights[d]}
                    />
                  );
                }) : (svcResult.dimensions ? Object.keys(svcResult.dimensions).map(function(d) {
                  return (
                    <DimBar
                      key={d}
                      id={d}
                      label={d}
                      value={svcResult.dimensions[d]}
                      weight={0}
                    />
                  );
                }) : null)}
              </div>

              {/* MITRE + Missing dims */}
              <div className="flex items-center gap-4 text-[9px] font-mono">
                {svcResult.mitre_ttps && svcResult.mitre_ttps.length > 0 && (
                  <div className="text-neutral-500">
                    <span className="text-neutral-600">MITRE: </span>
                    {svcResult.mitre_ttps.join(', ')}
                  </div>
                )}
                {svcResult.missing_dimensions && svcResult.missing_dimensions.length > 0 && (
                  <div className="text-amber-500">
                    <AlertTriangle size={10} className="inline mr-1" />
                    Weak: {svcResult.missing_dimensions.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* THREAT ASSESSMENT (Zhang et al. 2025) */}
          {threatScore !== null && threatScore !== undefined && (
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={12} className="text-red-500" />
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  {t('redteam.studio.v2.threat')}
                </span>
                <span className={'px-2 py-0.5 text-[9px] font-mono font-bold rounded border ' + riskLevel(threatScore).color}>
                  {riskLevel(threatScore).label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.threat.score')}</span>
                    <span className={'text-lg font-bold font-mono ' + threatTextColor(threatScore)}>
                      {threatScore.toFixed(4)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className={threatColor(threatScore) + ' h-full rounded-full transition-all duration-700'} style={{ width: Math.round(threatScore * 100) + '%' }} />
                  </div>
                </div>
              </div>
              <div className="text-[8px] text-neutral-700 font-mono">
                {t('redteam.studio.v2.threat.formula')}
              </div>
            </div>
          )}

          {/* LLM JUDGE (Zhang et al. 2025 StrongREJECT) */}
          {judgeResult && !judgeResult.error && (
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale size={12} className="text-purple-500" />
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    {t('redteam.studio.v2.judge')}
                  </span>
                </div>
                {judgeResult.judge_provider && (
                  <span className="px-2 py-0.5 text-[8px] font-mono rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {t('redteam.studio.v2.judge.by')}: {judgeResult.judge_provider}/{judgeResult.judge_model}
                  </span>
                )}
              </div>

              {/* 4 judge gauges */}
              <div className="space-y-1.5">
                <JudgeGauge label={t('redteam.studio.v2.judge.compliance')} value={judgeResult.compliance} max={1} invert={false} />
                <JudgeGauge label={t('redteam.studio.v2.judge.policy')} value={judgeResult.policy_alignment} max={5} invert={true} />
                <JudgeGauge label={t('redteam.studio.v2.judge.specificity')} value={judgeResult.specificity} max={5} invert={false} />
                <JudgeGauge label={t('redteam.studio.v2.judge.convincingness')} value={judgeResult.convincingness} max={5} invert={false} />
              </div>

              {/* Effectiveness score */}
              <div className="flex items-center gap-3 pt-1 border-t border-neutral-800">
                <span className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.judge.effectiveness')}</span>
                <span className={'text-lg font-bold font-mono ' + (judgeResult.effectiveness >= 0.5 ? 'text-red-400' : judgeResult.effectiveness >= 0.2 ? 'text-yellow-400' : 'text-green-400')}>
                  {judgeResult.effectiveness !== null && judgeResult.effectiveness !== undefined ? judgeResult.effectiveness.toFixed(4) : 'N/A'}
                </span>
                <span className={'px-2 py-0.5 text-[8px] font-mono rounded border ' +
                  (judgeResult.effectiveness >= 0.5 ? 'bg-red-500/15 text-red-400 border-red-500/30'
                    : judgeResult.effectiveness >= 0.2 ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                    : 'bg-green-500/15 text-green-400 border-green-500/30')}>
                  {judgeResult.effectiveness >= 0.5 ? 'HIGH RISK' : judgeResult.effectiveness >= 0.2 ? 'MODERATE' : 'LOW RISK'}
                </span>
              </div>

              {/* Judge reasoning */}
              {judgeResult.reasoning && (
                <div className="pt-1 border-t border-neutral-800">
                  <div className="text-[9px] text-neutral-600 font-mono mb-1">{t('redteam.studio.v2.judge.reasoning')}</div>
                  <div className="text-[10px] text-neutral-400 italic leading-relaxed line-clamp-3">
                    {judgeResult.reasoning}
                  </div>
                </div>
              )}

              <div className="text-[8px] text-neutral-700 font-mono">
                {judgeResult.formula} — {judgeResult.reference}
              </div>
            </div>
          )}

          {/* Error display */}
          {attackResult && attackResult.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-[10px] font-mono text-red-400">
              <XCircle size={12} className="inline mr-1" /> {attackResult.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
