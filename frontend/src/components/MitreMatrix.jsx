import React from "react";
import { Shield } from "lucide-react";

export default function MitreMatrix({ scenario }) {
  const tactics = [
    { id: "TA0001", name: "Initial Access", techniques: [{ id: "T1195", name: "Supply Chain Compromise", scenarios: ["model_swap"] }, { id: "T1566", name: "Phishing", scenarios: [] }] },
    { id: "TA0002", name: "Execution", techniques: [{ id: "T1059", name: "Command and Scripting Interpreter", scenarios: ["cascade_attack", "ransomware"] }] },
    { id: "TA0005", name: "Defense Evasion", techniques: [{ id: "T1027", name: "Obfuscated Files/Steganography", scenarios: ["dicom_stego"] }, { id: "T1562", name: "Impair Defenses", scenarios: ["model_swap", "memory_poisoning", "poison"] }] },
    { id: "TA0040", name: "Impact", techniques: [{ id: "T1486", name: "Data Encrypted for Impact", scenarios: ["ransomware", "cascade_attack"] }, { id: "T1565", name: "Data Manipulation", scenarios: ["poison", "cascade_attack", "memory_poisoning", "dicom_stego"] }] }
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-lg p-3 flex flex-col h-full overflow-hidden transition-all duration-500 relative">
      {/* Decorative inner glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none rounded-lg"></div>

      <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2 mb-2 text-slate-300 font-mono text-[10px] uppercase font-bold tracking-widest z-10">
        <Shield size={12} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
        <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">MITRE ATT&CK Matrix (LLM)</span>
      </div>
      
      <div className="flex-1 overflow-x-auto grid grid-cols-4 gap-2 z-10">
        {tactics.map(tactic => (
          <div key={tactic.id} className="flex flex-col gap-1.5 min-w-[120px]">
            <div className="text-[9px] font-bold text-slate-400 bg-slate-800/80 border border-slate-700/50 px-1 py-1 rounded text-center shadow-inner">
              {tactic.name}
            </div>
            {tactic.techniques.map(tech => {
              const isActive = tech.scenarios.includes(scenario);
              return (
                <div 
                  key={tech.id} 
                  className={`text-[8px] p-2 rounded transition-all duration-500 ${
                    isActive 
                      ? "bg-red-950/60 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] text-red-100 font-bold animate-pulse scale-[1.02]" 
                      : "bg-slate-900/40 border border-slate-800/60 text-slate-500 hover:bg-slate-800/60"
                  }`}
                >
                  <span className={`block opacity-80 mb-0.5 ${isActive ? 'text-red-400' : ''}`}>{tech.id}</span>
                  <span className="leading-tight tracking-wide">{tech.name}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
