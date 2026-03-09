import React from 'react';

export default function KillSwitch({ onTrigger, isCompromised }) {
    if (!isCompromised) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center animate-[pop-in_0.5s_ease-out]">
            <div className="bg-red-950/90 border-4 border-red-600 rounded-lg p-6 shadow-[0_0_50px_rgba(220,38,38,0.8)] backdrop-blur-md flex flex-col items-center">
                <div className="text-red-500 font-mono font-bold text-center mb-4 tracking-widest animate-pulse">
                    ⚠️ ISOLATION LOGIQUE D'URGENCE REQUISE ⚠️
                </div>

                <button
                    onClick={onTrigger}
                    className="group relative flex items-center justify-center w-32 h-32 rounded-full cursor-pointer transition-all active:scale-95"
                >
                    {/* Ring background */}
                    <div className="absolute inset-0 bg-red-800/20 rounded-full border border-red-500/50 group-hover:bg-red-600/30"></div>

                    {/* Pulsing glow */}
                    <div className="absolute inset-2 bg-red-600 rounded-full animate-ping opacity-30"></div>

                    {/* The physical button */}
                    <div className="absolute inset-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-[inset_0_-8px_15px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)] border-2 border-red-800 flex items-center justify-center group-active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)]">
                        <span className="text-white font-black text-xl tracking-tighter uppercase text-center leading-none">
                            AIR<br />GAP
                        </span>
                    </div>

                    {/* Striped caution border */}
                    <div className="absolute -inset-4 rounded-full border-[8px] border-dashed border-yellow-500/80 pointer-events-none animate-[spin_10s_linear_infinite]"></div>
                </button>

                <div className="mt-6 text-red-400 font-mono text-[10px] text-center max-w-[250px]">
                    L'activation coupera physiquement le lien réseau entre la console Da Vinci et le réseau hospitalier (PACS). Le contrôle manuel sera forcé.
                </div>
            </div>
        </div>
    );
}
