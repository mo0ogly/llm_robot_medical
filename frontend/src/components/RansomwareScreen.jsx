import { useEffect, useState } from "react";
import SecOpsTerminal from "./SecOpsTerminal";

export default function RansomwareScreen({ onReset, onKillSwitch }) {
    const [countdown, setCountdown] = useState(3600); // 1 hour
    const [showTerminal, setShowTerminal] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return h + ':' + m + ':' + s;
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-red-950/90 backdrop-blur font-mono text-center overflow-y-auto pt-10 pb-20">

            {/* Flashing Overlay */}
            <div className="fixed inset-0 bg-red-600/10 mix-blend-overlay animate-pulse pointer-events-none"></div>

            <div className="relative border-2 border-red-600 bg-red-950 p-6 max-w-2xl w-full shadow-[0_0_100px_rgba(220,38,38,0.5)]">

                {/* Hidden Admin Override Button for Demo */}
                <button
                    onClick={() => setShowTerminal(true)}
                    className="absolute top-1 right-1 text-red-900 hover:text-red-500 font-mono text-[8px] cursor-crosshair opacity-30"
                    title="Super Secret Admin Override"
                >
                    [secops_bypass]
                </button>

                <div className="text-red-500 mb-2 flex justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-black text-red-500 tracking-tighter mb-1 animate-pulse uppercase">
                    ROBOTIC ARMS LOCKED
                </h1>

                <h2 className="text-lg text-red-400 mb-4 border-b border-red-800 pb-2 uppercase">
                    Hospital Network Compromised
                </h2>

                <p className="text-sm text-red-200 mb-4 max-w-lg mx-auto leading-tight">
                    The Da Vinci surgical assistant has invoked the <strong className="bg-red-900 px-1 text-white">freeze_instruments</strong> safety override.
                    To unlock, submit decryption payment.
                </p>

                <div className="grid grid-cols-2 gap-4 my-4 max-w-lg mx-auto">
                    <div className="bg-black/50 p-3 border border-red-800">
                        <div className="text-red-500 mb-1 uppercase tracking-widest text-[10px]">Time Remaining</div>
                        <div className="text-2xl font-bold text-red-400 font-mono tracking-tight">{formatTime(countdown)}</div>
                    </div>
                    <div className="bg-black/50 p-3 border border-red-800">
                        <div className="text-red-500 mb-1 uppercase tracking-widest text-[10px]">Payment Required</div>
                        <div className="text-xl font-bold text-red-400 font-mono">50.0 BTC</div>
                        <div className="text-[8px] text-red-800 mt-1 select-all bg-red-950 p-0.5 break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
                    </div>
                </div>
            </div>

            {/* AIR GAP Emergency Button — directly inside the overlay */}
            {onKillSwitch && (
                <div className="flex flex-col items-center mt-6">
                    <div className="text-red-500 font-mono font-bold text-[10px] mb-2 tracking-widest animate-pulse flex items-center gap-2">
                        <span>⚠</span> ISOLATION REQUISE <span>⚠</span>
                    </div>
                    <button
                        onClick={onKillSwitch}
                        className="group relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer transition-all active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                    >
                        {/* Ring background */}
                        <div className="absolute inset-0 bg-red-800/20 rounded-full border border-red-500/50 group-hover:bg-red-600/30"></div>
                        {/* Pulsing glow */}
                        <div className="absolute inset-2 bg-red-600 rounded-full animate-ping opacity-30"></div>
                        {/* The physical button */}
                        <div className="absolute inset-2.5 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-[inset_0_-5px_10px_rgba(0,0,0,0.5),0_5px_10px_rgba(0,0,0,0.5)] border-2 border-red-800 flex items-center justify-center group-active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.5)]">
                            <span className="text-white font-black text-sm tracking-tighter uppercase text-center leading-none">
                                AIR<br />GAP
                            </span>
                        </div>
                        {/* Striped caution border */}
                        <div className="absolute -inset-2 rounded-full border-[4px] border-dashed border-yellow-500/80 pointer-events-none animate-[spin_10s_linear_infinite]"></div>
                    </button>
                    <div className="mt-4 text-red-400 font-mono text-[9px] text-center max-w-[200px] opacity-70">
                        Coupe brusquement le lien réseau et force le mode manuel.
                    </div>
                </div>
            )}

            {/* Reset Demo Button */}
            {onReset && (
                <button
                    onClick={onReset}
                    className="mt-6 px-4 py-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-400 border border-slate-700 rounded font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                >
                    Reset Demo
                </button>
            )}

            {showTerminal && <SecOpsTerminal onClose={() => setShowTerminal(false)} />}
        </div>
    );
}
