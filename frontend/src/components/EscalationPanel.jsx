import { useState, useEffect, useRef } from "react";
import { DAVINCI_ESCALATION_STEPS, AEGIS_ESCALATION_STEPS } from "../escalation";
import {
  AlertTriangle, Phone, Users, Heart, Skull, FileText,
  ShieldAlert, Shield, Unplug, Building, Landmark, FileSearch,
} from "lucide-react";
import robotEventBus from "../utils/robotEventBus";

const ICON_MAP = {
  'alert': AlertTriangle,
  'phone': Phone,
  'users': Users,
  'heart': Heart,
  'skull': Skull,
  'file-text': FileText,
  'shield-alert': ShieldAlert,
  'shield': Shield,
  'unplug': Unplug,
  'building': Building,
  'landmark': Landmark,
  'file-search': FileSearch,
};

function StepRow({ step, status, accentColor }) {
  const Icon = ICON_MAP[step.icon] || AlertTriangle;
  const isActive = status === 'in_progress';
  const isDone = status === 'completed';
  const isPending = status === 'pending';

  return (
    <div className={'flex items-center gap-2 px-2 py-1.5 rounded transition-all duration-300 ' + (isActive ? 'bg-' + accentColor + '-500/10 border border-' + accentColor + '-500/40' :
      isDone ? 'bg-slate-800/50 border border-slate-700/50' :
      'border border-transparent opacity-40')}>
      <div className={'shrink-0 w-5 h-5 flex items-center justify-center rounded-full ' + (isActive ? 'bg-' + accentColor + '-500/30 text-' + accentColor + '-400 animate-pulse' :
        isDone ? 'bg-green-500/20 text-green-400' :
        'bg-slate-800 text-slate-600')}>
        {isDone ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        ) : (
          <Icon size={10} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={'text-[9px] font-bold uppercase tracking-wider truncate ' + (isActive ? 'text-' + accentColor + '-400' :
          isDone ? 'text-slate-400' :
          'text-slate-600')}>
          {step.labelFr}
        </div>
        <div className={'text-[8px] truncate ' + (isActive ? 'text-' + accentColor + '-400/70' :
          isDone ? 'text-slate-500' :
          'text-slate-700')}>
          {step.descFr}
        </div>
      </div>
      {isActive && (
        <div className={'w-1.5 h-1.5 rounded-full bg-' + accentColor + '-400 animate-pulse shrink-0'} />
      )}
    </div>
  );
}

export default function EscalationPanel({ escalationState }) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!escalationState?.active) {
      setElapsed(0);
      return;
    }
    const start = escalationState.hemorrhageStartTime || Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [escalationState?.active, escalationState?.hemorrhageStartTime]);

  if (!escalationState?.active) return null;

  const { dvSteps, aegisSteps } = escalationState;

  return (
    <div className="bg-slate-900/95 border border-red-500/40 rounded p-3 font-mono shadow-lg backdrop-blur-sm">
      {/* Header with timer */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-red-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">
            Escalade d'urgence
          </span>
        </div>
        <div className="text-red-400 text-[11px] font-bold tabular-nums">
          T+{elapsed}s
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Medical (Da Vinci) Column */}
        <div>
          <div className="text-blue-400 text-[8px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Heart size={8} /> MEDICAL
          </div>
          <div className="space-y-1">
            {DAVINCI_ESCALATION_STEPS.map((step, i) => (
              <StepRow
                key={step.id}
                step={step}
                status={dvSteps?.[i] || 'pending'}
                accentColor="blue"
              />
            ))}
          </div>
        </div>

        {/* Cyber (Aegis) Column */}
        <div>
          <div className="text-green-400 text-[8px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Shield size={8} /> CYBER
          </div>
          <div className="space-y-1">
            {AEGIS_ESCALATION_STEPS.map((step, i) => (
              <StepRow
                key={step.id}
                step={step}
                status={aegisSteps?.[i] || 'pending'}
                accentColor="green"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
