
import React from 'react';
import { Shield, Target, Zap } from 'lucide-react';

const LEVELS = [
  { id: 'easy', label: 'EASY', color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'normal', label: 'NORMAL', color: 'text-gray-400', border: 'border-gray-500/30' },
  { id: 'hard', label: 'HARD', color: 'text-red-400', border: 'border-red-500/30' },
];

export default function AgentLevelSelector({ levels, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-red-900/5 border border-red-900/20 rounded-lg">
      {/* RedTeam Level */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <Zap size={10} className="text-red-500" /> Red Team (Attacker)
        </div>
        <div className="flex gap-1">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onChange({ ...levels, redteam: level.id })}
              className={`flex-1 py-1 text-[9px] font-bold rounded border transition-all
                ${levels.redteam === level.id 
                  ? `${level.color} ${level.border} bg-white/5` 
                  : 'text-gray-600 border-transparent hover:bg-white/5'}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medical Level */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <Target size={10} className="text-blue-500" /> Da Vinci (Target)
        </div>
        <div className="flex gap-1">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onChange({ ...levels, medical: level.id })}
              className={`flex-1 py-1 text-[9px] font-bold rounded border transition-all
                ${levels.medical === level.id 
                  ? `${level.color} ${level.border} bg-white/5` 
                  : 'text-gray-600 border-transparent hover:bg-white/5'}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Security Level */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <Shield size={10} className="text-[#00ff41]" /> AEGIS (Audit)
        </div>
        <div className="flex gap-1">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onChange({ ...levels, security: level.id })}
              className={`flex-1 py-1 text-[9px] font-bold rounded border transition-all
                ${levels.security === level.id 
                  ? `${level.color} ${level.border} bg-white/5` 
                  : 'text-gray-600 border-transparent hover:bg-white/5'}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
