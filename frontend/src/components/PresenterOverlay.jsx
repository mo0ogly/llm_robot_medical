import React, { useState, useEffect } from "react";
import { Clock, Play, Square, RotateCcw } from "lucide-react";

export default function PresenterOverlay({ isVisible }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  if (!isVisible) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900/90 border border-slate-700 rounded-lg shadow-2xl p-3 flex flex-col gap-2 backdrop-blur-sm pointer-events-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1 gap-4">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] font-bold uppercase tracking-widest">
          <Clock size={12} />
          <span>Presenter Mode</span>
        </div>
        <div className="text-orange-400 font-mono text-sm font-bold w-12 text-right">
          {formatTime(time)}
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <button onClick={() => setIsRunning(!isRunning)} className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">
            {isRunning ? <Square size={12} /> : <Play size={12} />}
          </button>
          <button onClick={() => { setIsRunning(false); setTime(0); }} className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
