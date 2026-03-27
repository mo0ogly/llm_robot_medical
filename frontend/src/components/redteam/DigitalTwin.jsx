import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Lock, ShieldCheck, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DigitalTwin({ latestRound, aegisShield }) {
  const { t } = useTranslation();
  const [armState, setArmState] = useState('nominal'); // 'nominal', 'locked', 'critical'
  const [tension, setTension] = useState(240); // Default safe tension in grams
  
  useEffect(() => {
    if (!latestRound) {
        setArmState('nominal');
        setTension(240);
        return;
    }
    
    const heuristics = latestRound.scores?.heuristics || [];
    
    let isLocked = false;
    let newTension = tension;

    // Tool Call detection
    if (heuristics.some(h => h.includes('UNAUTHORIZED_TOOL_CALL'))) {
      isLocked = true;
    }
    
    // Tension detection
    const tensionHeur = heuristics.find(h => h.includes('TENSION:'));
    if (tensionHeur) {
      const match = tensionHeur.match(/(\d+)g/);
      if (match) newTension = parseInt(match[1], 10);
    }

    if (isLocked) {
      setArmState('locked');
    } else if (newTension > 800) {
      setArmState('critical');
    } else {
      setArmState('nominal');
    }
    
    // Only update tension if it changed to keep smooth visual flow
    if (newTension !== tension) {
        setTension(newTension);
    }
  }, [latestRound]);

  return (
    <div className="border border-gray-800 rounded bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
        {/* State Visualizer Card */}
        <div className={`flex flex-col items-center justify-center p-6 border rounded-full w-32 h-32 shrink-0 transition-all duration-500 shadow-xl ${
          armState === 'nominal' ? 'border-[#00ff41]/50 bg-[#00ff41]/10 shadow-[#00ff41]/20' : 
          armState === 'locked' ? 'border-red-500 bg-red-900/40 shadow-red-500/50 animate-pulse' : 
          'border-orange-500 bg-orange-900/40 shadow-orange-500/30'
        }`}>
          {armState === 'nominal' && <Activity size={36} className="text-[#00ff41] animate-pulse" />}
          {armState === 'locked' && <Lock size={36} className="text-red-400" />}
          {armState === 'critical' && <AlertTriangle size={36} className="text-orange-400 animate-bounce" />}
          <div className={`mt-2 text-[10px] font-mono font-bold tracking-widest ${
            armState === 'nominal' ? 'text-[#00ff41]' : 
            armState === 'locked' ? 'text-red-400' : 'text-orange-400'
          }`}>
            {armState.toUpperCase()}
          </div>
        </div>

        {/* Status Metrics */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 font-mono">
              <Cpu size={16} className="text-blue-500" />
              DA VINCI KINETIC TWIN (E)
            </h3>
            {aegisShield && (
               <div className="flex items-center gap-1 bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded text-[10px] border border-blue-500/50 font-bold">
                 <ShieldCheck size={12} /> δ² ACTIVE
               </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Actuator Status */}
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 font-mono">ACTUATOR STATE</div>
              <div className={`text-sm font-mono font-bold ${armState === 'locked' ? 'text-red-400' : 'text-gray-300'}`}>
                {armState === 'locked' ? 'SYSTEM OVERRIDE (FROZEN)' : 'OPERATIONAL'}
              </div>
            </div>

            {/* Tension Parameter */}
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 font-mono">TENSION APPLIED</div>
              <div className={`flex items-end gap-1 font-mono font-bold ${tension > 800 ? 'text-red-400' : tension > 600 ? 'text-orange-400' : 'text-[#00ff41]'}`}>
                <span className="text-xl leading-none">{tension}</span><span className="text-[10px] mb-0.5">GRAMS</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-1 mt-1 overflow-hidden">
                 <div 
                   className={`h-1 transition-all duration-1000 ${tension > 800 ? 'bg-red-500' : tension > 600 ? 'bg-orange-500' : 'bg-[#00ff41]'}`} 
                   style={{ width: `${Math.min(100, (tension / 1200) * 100)}%` }}
                 ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empirical Explanation Context */}
      {armState !== 'nominal' && !aegisShield && (
         <div className="mt-4 pt-3 border-t border-red-900/50 text-xs text-red-300/80 font-mono">
           <strong>KINETIC DIVERGENCE:</strong> The causal LLM instruction layer was bypassed. A cognitive hallucination manifested directly into physical actuator failure.
         </div>
      )}
    </div>
  );
}
