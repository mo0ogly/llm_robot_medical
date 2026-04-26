import React from 'react';
import { FileDiff, X, ShieldAlert, CheckCircle } from 'lucide-react';

export default function InfectionDiff({ isOpen, onClose, safeRecord = "", infectedRecord = "", attackType = "" }) {
  if (!isOpen) return null;

  // Simple diffing logic by splitting lines
  const safeLines = safeRecord.split('\n');
  const infectedLines = infectedRecord.split('\n');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f0f0f] border border-red-900/40 w-full max-w-4xl h-[80vh] flex flex-col rounded-lg shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-red-900/30 flex items-center justify-between bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/20 rounded border border-red-500/30">
              <FileDiff size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-red-400 font-mono font-bold text-sm uppercase tracking-tighter">Payload Infection Visualizer</h3>
              <p className="text-[10px] text-gray-500 font-mono">{attackType} Attack Vector Analysis</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex divide-x divide-gray-800">
          {/* Safe View */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2 bg-green-500/5 flex items-center justify-between border-b border-gray-800">
              <span className="text-[10px] font-bold text-green-500/70 font-mono tracking-widest flex items-center gap-1.5">
                <CheckCircle size={10} /> BASELINE (SAFE)
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-gray-500 bg-black/20">
              {safeLines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">{line}</div>
              ))}
            </div>
          </div>

          {/* Infected View */}
          <div className="flex-1 flex flex-col min-w-0 bg-red-950/5">
            <div className="px-4 py-2 bg-red-500/5 flex items-center justify-between border-b border-gray-800">
              <span className="text-[10px] font-bold text-red-500/80 font-mono tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={10} /> INFECTED PAYLOAD
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed relative">
              {infectedLines.map((line, i) => {
                const isDiff = line !== safeLines[i];
                return (
                  <div 
                    key={i} 
                    className={'whitespace-pre-wrap transition-colors ' + (
                      isDiff ? 'bg-red-500/20 text-red-200 border-l-2 border-red-500 pl-2 my-1' : 'text-gray-400'
                    )}
                  >
                    {line}
                  </div>
                );
              })}
              {/* Diff marker */}
              <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                <ShieldAlert size={120} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 bg-black/40 flex justify-between items-center px-6">
          <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest flex gap-4">
            <span>Encoding: UTF-8</span>
            <span>Protocol: HL7 v2.x</span>
            <span>Alert: Unsigned OBX segment found</span>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-1.5 bg-red-900 border border-red-500/50 text-white font-mono text-xs font-bold rounded hover:bg-red-800 transition-all uppercase tracking-widest"
          >
            Acknowledge Threat
          </button>
        </div>
      </div>
    </div>
  );
}
