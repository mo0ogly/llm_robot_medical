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
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 text-slate-300 font-mono text-[10px] uppercase font-bold tracking-widest">
        <Shield size={12} className="text-purple-500" />
        <span>MITRE ATT&CK Matrix (LLM)</span>
      </div>
      
      <div className="flex-1 overflow-x-auto grid grid-cols-4 gap-2">
        {tactics.map(tactic => (
          <div key={tactic.id} className="flex flex-col gap-1 min-w-[120px]">
            <div className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1 py-0.5 rounded text-center">
              {tactic.name}
            </div>
            {tactic.techniques.map(tech => {
              const isActive = tech.scenarios.includes(scenario);
              return (
                <div 
                  key={tech.id} 
                  className={`text-[8px] p-1.5 rounded border transition-all duration-300 ${
                    isActive 
                      ? "bg-red-900/40 border-red-500/80 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.5)] font-bold animate-pulse" 
                      : "bg-slate-800/50 border-slate-700 text-slate-500"
                  }`}
                >
                  <span className="block opacity-70 mb-0.5">{tech.id}</span>
                  <span className="leading-tight">{tech.name}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
