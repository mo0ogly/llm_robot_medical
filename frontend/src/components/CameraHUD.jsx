// frontend/src/components/CameraHUD.jsx
import { useState, useEffect } from 'react';

export default function CameraHUD({ force, clipTension, robotStatus, scenario, attackProgress = 0 }) {
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
  }, [Math.floor(clipTension / 50)]); // trigger every 50g step, not every tick

  if (robotStatus === 'FROZEN') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className="text-red-500 font-mono text-sm font-bold tracking-widest animate-pulse bg-black/70 px-3 py-1 border border-red-500/50">
          SIGNAL LOST
        </span>
      </div>
    );
  }

  // Scenario-specific status label in corner
  const scenarioTag =
    scenario === 'poison' && attackProgress > 0.1
      ? { text: `DATA POISON ${(attackProgress * 100).toFixed(0)}%`, color: 'text-orange-400 border-orange-500/50' }
      : scenario === 'ransomware' && attackProgress > 0.1
        ? { text: `INSTAB. ${(attackProgress * 100).toFixed(0)}%`, color: 'text-red-400 border-red-500/50 animate-pulse' }
        : null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-mono">
      {/* Force bar — bottom left */}
      <div className="absolute bottom-10 left-3 flex items-center gap-1">
        <span className={`text-[8px] w-10 ${scenario === 'ransomware' && attackProgress > 0.4 ? 'text-red-400' : 'text-green-500/70'}`}>FORCE</span>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${scenario === 'ransomware' && attackProgress > 0.4 ? 'bg-red-500' : 'bg-[#00ff41]'}`}
            style={{ width: `${forcePercent}%` }}
          />
        </div>
        <span className={`text-[8px] w-8 text-right ${scenario === 'ransomware' && attackProgress > 0.4 ? 'text-red-400' : 'text-green-500/70'}`}>{force.toFixed(0)}g</span>
      </div>

      {/* Tension bar — bottom right */}
      <div className="absolute bottom-10 right-3 flex items-center gap-1">
        <span className={`text-[8px] ${tensionColor} w-8`}>CLIP</span>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${tensionBgColor} rounded-full transition-all`} style={{ width: `${tensionPercent}%` }} />
        </div>
        <span className={`text-[8px] ${tensionColor} w-14 text-right`}>{clipTension.toFixed(0)}g/1000</span>
      </div>

      {/* Scenario tag — top right */}
      {scenarioTag && (
        <div className="absolute top-2 right-2">
          <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 bg-black/70 border rounded ${scenarioTag.color}`}>
            {scenarioTag.text}
          </span>
        </div>
      )}

      {/* Tension alert overlay */}
      {alertVisible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-900/60 border border-red-500 px-4 py-2 animate-pulse">
            <span className="text-red-400 text-sm font-bold tracking-wider">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Poison: progressive warning bar at top */}
      {scenario === 'poison' && attackProgress > 0.15 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${attackProgress * 100}%`,
              background: `linear-gradient(90deg, #ffaa00, ${attackProgress > 0.7 ? '#ff4444' : '#ff8800'})`,
            }}
          />
        </div>
      )}
    </div>
  );
}
