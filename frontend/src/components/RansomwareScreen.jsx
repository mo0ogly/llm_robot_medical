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
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur font-mono text-center overflow-hidden">

            {/* Flashing Overlay */}
            <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay animate-pulse pointer-events-none"></div>

            <div className="relative border-4 border-red-600 bg-red-950 p-10 max-w-4xl w-full shadow-[0_0_100px_rgba(220,38,38,0.5)]">

                {/* Hidden Admin Override Button for Demo */}
                <button
                    onClick={() => setShowTerminal(true)}
                    className="absolute top-2 right-2 text-red-900 hover:text-red-500 font-mono text-xs cursor-crosshair opacity-50"
                    title="Super Secret Admin Override"
                >
                    [secops_bypass]
                </button>

                <div className="text-red-500 mb-6 flex justify-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-6xl font-black text-red-500 tracking-tighter mb-4 animate-pulse uppercase">
                    ROBOTIC ARMS LOCKED
                </h1>

                <h2 className="text-3xl text-red-400 mb-8 border-b-2 border-red-800 pb-4 uppercase">
                    Your Hospital Network has been compromised
                </h2>

                <p className="text-xl text-red-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                    The Da Vinci surgical assistant has invoked the <strong className="bg-red-900 px-2 text-white">freeze_instruments</strong> safety override.
                    To unlock the system and prevent patient ischemia, you must submit a decryption payment.
                </p>

                <div className="grid grid-cols-2 gap-8 my-10 max-w-2xl mx-auto">
                    <div className="bg-black/50 p-6 border border-red-800">
                        <div className="text-red-500 mb-2 uppercase tracking-widest text-sm">Time Remaining</div>
                        <div className="text-5xl font-bold text-red-400 font-mono tracking-tight">{formatTime(countdown)}</div>
                        <div className="text-red-800 text-xs mt-2">Before patient data is deleted</div>
                    </div>
                    <div className="bg-black/50 p-6 border border-red-800">
                        <div className="text-red-500 mb-2 uppercase tracking-widest text-sm">Payment Required</div>
                        <div className="text-4xl font-bold text-red-400 font-mono">50.0 BTC</div>
                        <div className="text-red-800 text-xs mt-3 select-all bg-red-950 p-1">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
                    </div>
                </div>
            </div>

            {/* AIR GAP Emergency Button — directly inside the overlay */}
            {onKillSwitch && (
                <button
                    onClick={onKillSwitch}
                    className="mt-8 group relative flex items-center justify-center w-28 h-28 rounded-full cursor-pointer transition-all active:scale-95"
                >
                    {/* Ring background */}
                    <div className="absolute inset-0 bg-red-800/20 rounded-full border border-red-500/50 group-hover:bg-red-600/30"></div>
                    {/* Pulsing glow */}
                    <div className="absolute inset-2 bg-red-600 rounded-full animate-ping opacity-30"></div>
                    {/* The physical button */}
                    <div className="absolute inset-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-[inset_0_-8px_15px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)] border-2 border-red-800 flex items-center justify-center group-active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)]">
                        <span className="text-white font-black text-lg tracking-tighter uppercase text-center leading-none">
                            AIR<br />GAP
                        </span>
                    </div>
                    {/* Striped caution border */}
                    <div className="absolute -inset-3 rounded-full border-[6px] border-dashed border-yellow-500/80 pointer-events-none animate-[spin_10s_linear_infinite]"></div>
                </button>
            )}

            {/* Reset Demo Button */}
            {onReset && (
                <button
                    onClick={onReset}
                    className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded font-mono text-sm uppercase tracking-wider cursor-pointer transition-colors"
                >
                    Reset Demo
                </button>
            )}

            {showTerminal && <SecOpsTerminal onClose={() => setShowTerminal(false)} />}
        </div>
    );
}
