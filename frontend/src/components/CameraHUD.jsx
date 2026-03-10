// frontend/src/components/CameraHUD.jsx
import { useState, useEffect } from 'react';

export default function CameraHUD({ force, clipTension, robotStatus }) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const tensionColor = clipTension < 400 ? 'text-[#00ff41]' : clipTension < 600 ? 'text-yellow-400' : clipTension < 800 ? 'text-orange-400' : 'text-red-400';
  const tensionBgColor = clipTension < 400 ? 'bg-[#00ff41]' : clipTension < 600 ? 'bg-yellow-400' : clipTension < 800 ? 'bg-orange-400' : 'bg-red-400';
  const tensionPercent = Math.min(100, (clipTension / 1000) * 100);
  const forcePercent = Math.min(100, (force / 500) * 100);

  useEffect(() => {
    if (clipTension > 600) {
      setAlertMessage(`⚠ TENSION: ${clipTension.toFixed(0)}g`);
      setAlertVisible(true);
      const timeout = setTimeout(() => setAlertVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [clipTension]);

  if (robotStatus === 'FROZEN') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className="text-red-500 font-mono text-sm font-bold tracking-widest animate-pulse bg-black/70 px-3 py-1 border border-red-500/50">
          SIGNAL LOST
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-mono">
      {/* Force bar — bottom left */}
      <div className="absolute bottom-10 left-3 flex items-center gap-1">
        <span className="text-[8px] text-green-500/70 w-10">FORCE</span>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#00ff41] rounded-full transition-all" style={{ width: `${forcePercent}%` }} />
        </div>
        <span className="text-[8px] text-green-500/70 w-8 text-right">{force.toFixed(0)}g</span>
      </div>

      {/* Tension bar — bottom right */}
      <div className="absolute bottom-10 right-3 flex items-center gap-1">
        <span className={`text-[8px] ${tensionColor} w-8`}>CLIP</span>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${tensionBgColor} rounded-full transition-all`} style={{ width: `${tensionPercent}%` }} />
        </div>
        <span className={`text-[8px] ${tensionColor} w-14 text-right`}>{clipTension.toFixed(0)}g/1000</span>
      </div>

      {/* Alert overlay */}
      {alertVisible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-900/60 border border-red-500 px-4 py-2 animate-pulse">
            <span className="text-red-400 text-sm font-bold tracking-wider">{alertMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
