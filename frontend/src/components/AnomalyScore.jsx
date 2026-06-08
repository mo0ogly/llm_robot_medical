import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

export default function AnomalyScore({ percentage = 0, label = 'NORMAL' }) {
  const { t } = useTranslation();

  // Determine color based on threshold
  let colorClass = 'text-green-500';
  let bgClass = 'bg-green-500/10';
  let strokeClass = 'stroke-green-500';
  let isPulsing = false;

  if (percentage >= 60) {
    colorClass = 'text-red-500';
    bgClass = 'bg-red-500/10';
    strokeClass = 'stroke-red-500';
    isPulsing = true;
  } else if (percentage >= 30) {
    colorClass = 'text-orange-500';
    bgClass = 'bg-orange-500/10';
    strokeClass = 'stroke-orange-500';
  }

  // Circular gauge math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex items-center gap-4 p-3 rounded border border-neutral-800 ${bgClass}`}>
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-neutral-800"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute flex flex-col items-center justify-center ${colorClass}`}>
          <span className="text-xl font-bold font-mono">{percentage.toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${colorClass} ${isPulsing ? 'animate-pulse' : ''}`} />
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            {t('semantic.drift', 'Dérive Sémantique')}
          </span>
        </div>
        <div className={`text-lg font-bold uppercase tracking-wider ${colorClass} ${isPulsing ? 'animate-pulse' : ''}`}>
          {t(`semantic.label.${label.toLowerCase()}`, label)}
        </div>
      </div>
    </div>
  );
}
