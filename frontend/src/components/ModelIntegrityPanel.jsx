import React from 'react';
import { Skull } from 'lucide-react';

export default function ModelIntegrityPanel() {
  return (
    <div className="bg-purple-900/20 border border-purple-500/50 rounded p-2 flex flex-col gap-1 text-purple-400 font-mono text-[9px] uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
      <span className="font-bold flex items-center gap-1"><Skull size={10} /> Supply Chain Compromise</span>
      <span>System Prompt Checksum: INVALID</span>
      <span>Safety Guardrails: OVERRIDDEN AT SOURCE</span>
    </div>
  );
}
