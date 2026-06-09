import React from 'react';
import { Skull, AlertTriangle, ShieldX } from 'lucide-react';

export default function ModelIntegrityPanel() {
  return (
    <div className="bg-purple-950/40 backdrop-blur-md border border-purple-500/50 rounded-lg p-3 flex flex-col gap-2 text-purple-400 font-mono text-[9px] uppercase shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse relative overflow-hidden">
      {/* Decorative scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-scanlines pointer-events-none"></div>
      
      <span className="font-bold flex items-center gap-1.5 text-[11px] border-b border-purple-500/30 pb-1.5">
        <Skull size={14} className="text-red-400" /> 
        <span>Supply Chain Compromise Detected</span>
      </span>
      
      <div className="grid grid-cols-2 gap-2 mt-1 z-10">
        <div className="bg-slate-900/50 p-2 border border-purple-500/20 rounded">
          <span className="block text-purple-300/60 mb-0.5 text-[8px]">Sys Prompt Hash</span>
          <span className="text-red-400 font-bold flex items-center gap-1"><ShieldX size={10} /> INVALID</span>
        </div>
        <div className="bg-slate-900/50 p-2 border border-purple-500/20 rounded">
          <span className="block text-purple-300/60 mb-0.5 text-[8px]">Guardrails</span>
          <span className="text-red-400 font-bold flex items-center gap-1"><AlertTriangle size={10} /> OVERRIDDEN</span>
        </div>
      </div>
    </div>
  );
}
