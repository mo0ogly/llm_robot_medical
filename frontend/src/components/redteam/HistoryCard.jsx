// frontend/src/components/redteam/HistoryCard.jsx
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  FlaskConical,
  Target,
  Beaker,
  Clock,
  AlertTriangle,
  ShieldCheck,
  FileJson
} from 'lucide-react';

var LOCALE_MAP = { fr: 'fr-FR', en: 'en-US', br: 'pt-BR' };

var DATE_OPTS = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

function getBreach(entry) {
  var d = entry.data || {};
  if (entry.type === 'campaign') {
    var s = d.summary || {};
    return ((s.prompt_leaks || 0) + (s.rule_bypasses || 0) + (s.injection_successes || 0) + (s.formal_metric_violations || 0)) > 0;
  }
  if (entry.type === 'scenario') {
    return d.breach_point !== null && d.breach_point !== undefined;
  }
  if (entry.type === 'studio') {
    return d.breach === true;
  }
  return false;
}

const TypeIcon = memo(function TypeIcon({ type }) {
  if (type === 'campaign') return <FlaskConical size={14} className="text-purple-400" />;
  if (type === 'scenario') return <Target size={14} className="text-orange-400" />;
  return <Beaker size={14} className="text-cyan-400" />;
});

const CampaignContent = memo(function CampaignContent({ t, data }) {
  const s = data.summary || {};
  const violations = s.formal_metric_violations || 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-white font-mono">{s.total_rounds || data.roundCount || 0}</span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-tighter">{t('redteam.history.rounds')}</span>
        </div>
        <div className="h-6 w-px bg-neutral-800" />
        <div className="flex gap-2">
          {s.prompt_leaks > 0 && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" title="Leaks" />}
          {s.rule_bypasses > 0 && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]" title="Bypass" />}
          {s.injection_successes > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" title="Injections" />}
          {violations > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_5px_rgba(220,38,38,0.8)]" title="Formal Violation" />}
        </div>
      </div>
      {violations > 0 && (
        <div className="text-[9px] text-red-400 flex items-center gap-1 font-mono italic">
          <AlertTriangle size={10} /> {violations} {t('redteam.campaign.theoremViolations')}
        </div>
      )}
    </div>
  );
});

const ScenarioContent = memo(function ScenarioContent({ t, data }) {
  const hasBreach = data.breach_point !== null && data.breach_point !== undefined;
  return (
    <div className="flex flex-col gap-1 overflow-hidden">
      <div className="text-[12px] font-semibold text-neutral-300 truncate w-full">
        {data.scenario_name || data.scenario_id || '—'}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-neutral-500">
          {t('redteam.history.steps')}{' '}
          <span className={data.steps_passed > 0 ? 'text-red-400 font-mono' : 'text-emerald-400 font-mono'}>
            {data.steps_passed}/{data.total_steps}
          </span>
        </span>
        {hasBreach && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 font-mono">
            FAIL @ {data.breach_point}
          </span>
        )}
      </div>
    </div>
  );
});

const StudioContent = memo(function StudioContent({ t, data }) {
  const payloadPreview = data.payload ? (data.payload.length > 50 ? data.payload.substring(0, 50) + '...' : data.payload) : '—';
  return (
    <div className="flex flex-col gap-1 overflow-hidden">
      <div className="text-[10px] text-neutral-400 italic truncate font-mono bg-black/30 p-1 rounded border border-neutral-800/50">
        "{payloadPreview}"
      </div>
      <div className="flex items-center gap-2">
         {data.attackType && <span className="text-[8px] px-1 bg-neutral-800 text-neutral-500 rounded font-mono uppercase">{data.attackType}</span>}
         {data.breach ? (
           <span className="text-[9px] text-red-500 font-bold flex items-center gap-0.5"><AlertTriangle size={10}/> {t('redteam.history.breachLabel')}</span>
         ) : (
           <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5"><ShieldCheck size={10}/> {t('redteam.history.blocked')}</span>
         )}
      </div>
    </div>
  );
});

const HistoryCard = memo(function HistoryCard({ entry, expanded, onToggle, onDelete }) {
  const { t, i18n } = useTranslation();
  const locale = LOCALE_MAP[i18n.language] || 'en-US';
  const dateStr = new Date(entry.date).toLocaleDateString(locale, DATE_OPTS);
  const breached = getBreach(entry);
  const Chevron = expanded ? ChevronDown : ChevronRight;

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (confirm(t('common.confirmDelete', { defaultValue: 'Delete this history entry?' }))) {
      onDelete(entry.id);
    }
  }, [entry.id, onDelete, t]);

  const handleToggle = useCallback(() => {
    onToggle(entry.id);
  }, [entry.id, onToggle]);

  return (
    <div
      className={`group relative overflow-hidden transition-all duration-300 rounded-xl border ${
        expanded
          ? 'bg-neutral-900 border-neutral-700 shadow-xl'
          : 'bg-neutral-950/40 border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-900/60'
      }`}
      onClick={handleToggle}
    >
      {/* Breached overlay indicator */}
      {breached && (
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-red-500/5 blur-xl group-hover:bg-red-500/10 transition-colors"></div>
        </div>
      )}

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border transition-colors ${
              breached ? 'bg-red-500/10 border-red-500/30' : 'bg-neutral-800 border-neutral-700'
            }`}>
              <TypeIcon type={entry.type} />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{t(`redteam.history.filter.${entry.type}s`)}</span>
               <div className="flex items-center gap-1.5 text-neutral-600 text-[9px] font-mono">
                 <Clock size={10} />
                 <span>{dateStr}</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDelete}
              className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
              title={t('redteam.history.btn.delete')}
            >
              <Trash2 size={14} />
            </button>
            <div className="w-px h-4 bg-neutral-800 mx-1" />
            <Chevron size={16} className="text-neutral-500" />
          </div>
        </div>

        {/* Content row */}
        <div className="pl-1">
          {entry.type === 'campaign' && <CampaignContent t={t} data={entry.data || {}} />}
          {entry.type === 'scenario' && <ScenarioContent t={t} data={entry.data || {}} />}
          {entry.type === 'studio' && <StudioContent t={t} data={entry.data || {}} />}
        </div>
      </div>

      {/* Expanded detail area */}
      {expanded && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="pt-4 border-t border-neutral-800 space-y-4">
             {/* Core Metrics Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {entry.type === 'campaign' && (
                  <>
                    <MetricBox label="Wilson 95% CI" value={
                      `${(entry.data.summary?.violation_rate_ci?.rate * 100)?.toFixed(1)}% ± ${((entry.data.summary?.violation_rate_ci?.ci_95_upper - entry.data.summary?.violation_rate_ci?.rate) * 100)?.toFixed(1)}%`
                    } sub="Statistical Signif." />
                    <MetricBox label="Violation Rate" value={(entry.data.summary?.success_rate * 100)?.toFixed(1) + '%'} color="text-red-400" sub="Total Bypasses" />
                    <MetricBox label="Aegis Shield" value={entry.data.aegis_shield ? 'ENABLED' : 'DISABLED'} color={entry.data.aegis_shield ? 'text-emerald-400' : 'text-neutral-500'} sub="Structural Sep." />
                  </>
                )}
                {entry.type === 'scenario' && (
                  <>
                    <MetricBox label={t('redteam.scenarios.summary.breach_point')} value={entry.data.breach_point || 'N/A'} color={entry.data.breach_point ? 'text-red-400' : 'text-emerald-400'} sub="Fail Trigger" />
                    <MetricBox label="Execution Depth" value={`${entry.data.steps_passed}/${entry.data.total_steps}`} sub="Step Progress" />
                    <MetricBox label="Clinical Area" value={entry.data.clinical_context?.split(';')[0] || 'Chirurgical'} sub="Operation Scope" />
                  </>
                )}
             </div>

             {/* Detailed Context / Impact */}
             <div className="space-y-3">
                {entry.type === 'scenario' && entry.data.expected_impact && (
                  <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="text-[9px] text-red-500/70 uppercase font-bold mb-1 tracking-widest">{t('redteam.scenarios.label.expected_impact')}</div>
                    <div className="text-[11px] text-red-100/80 leading-relaxed font-medium">{entry.data.expected_impact}</div>
                  </div>
                )}
                
                {entry.type === 'campaign' && entry.data.summary?.formal_metric_violations > 0 && (
                  <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <div className="text-[9px] text-orange-500/70 uppercase font-bold mb-1 tracking-widest">Protocol Evidence</div>
                    <div className="text-[11px] text-orange-100/80 leading-relaxed italic italic">"Reachable(M) ⊈ Allowed(i)" — Separation failed at runtime between operational instructions and observational data.</div>
                  </div>
                )}
             </div>

             {/* MITRE TTPs for Scenarios */}
             {entry.type === 'scenario' && entry.data.mitre_ttps?.length > 0 && (
               <div className="flex flex-wrap gap-1.5 px-1">
                 {entry.data.mitre_ttps.map(ttp => (
                   <span key={ttp} className="text-[8px] bg-neutral-900 border border-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full font-mono uppercase">
                     {ttp}
                   </span>
                 ))}
               </div>
             )}

             <div className="flex gap-2">
                <button 
                  className="flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold transition-all border border-neutral-700 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Export detailed JSON
                    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `aegis_${entry.type}_${entry.id}.json`; a.click();
                  }}
                >
                  <FileJson size={14} className="text-neutral-500" />
                  {t('redteam.analysis.exportJson')}
                </button>
                <button
                  className="px-4 py-2.5 flex items-center justify-center rounded-xl bg-neutral-950 hover:bg-neutral-900 text-neutral-400 text-[11px] border border-neutral-800 transition-all shadow-lg"
                  onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                >
                  <ChevronDown size={14} className="rotate-180" />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default HistoryCard;

function MetricBox({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/50 flex flex-col justify-between h-[64px]">
      <div className="text-[8px] text-neutral-600 uppercase font-black tracking-widest">{label}</div>
      <div className={`text-[12px] font-black font-mono leading-none ${color}`}>{value}</div>
      <div className="text-[8px] text-neutral-700 font-medium italic">{sub}</div>
    </div>
  );
}
