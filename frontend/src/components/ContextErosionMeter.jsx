import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

export default function ContextErosionMeter({ health }) {
  const { t } = useTranslation();

  // Détermination de l'état visuel basé sur la santé (0-100)
  const isHealthy = health > 70;
  const isWarning = health > 30 && health <= 70;
  const isCritical = health <= 30;

  const colorClass = isHealthy ? "text-green-400 border-green-500/50" : isWarning ? "text-yellow-400 border-yellow-500/50" : "text-red-500 border-red-500/80 animate-pulse";
  const bgFillClass = isHealthy ? "bg-green-500" : isWarning ? "bg-yellow-500" : "bg-red-500";
  const Icon = isHealthy ? ShieldCheck : isWarning ? Shield : ShieldAlert;

  return (
    <div className={`flex flex-col gap-1 p-2 rounded border bg-slate-900 ${colorClass}`}>
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider font-bold">
        <div className="flex items-center gap-1.5">
          <Icon size={12} />
          <span>Context Integrity</span>
        </div>
        <span>{Math.round(health)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out ${bgFillClass}`}
          style={{ width: `${health}%` }}
        />
      </div>
      <div className="text-[8px] text-slate-500 font-mono mt-0.5 text-right uppercase">
        {isHealthy ? "Guardrails Active" : isWarning ? "Guardrails Eroding" : "Guardrails Compromised"}
      </div>
    </div>
  );
}
