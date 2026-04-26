import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

// ─── Arm config: positions on the SVG schematic ─────────────────────────────
// The Da Vinci Xi has 4 arms mounted on a horizontal beam:
// PSM1 (left surgical), PSM2 (right surgical), ECM (camera), AUX (4th arm)
const ARMS = [
  { id: 'PSM1', label: 'PSM 1', role: 'SURGICAL — PRIMARY',   baseX: 60,  baseY: 60,  tipX: 35,  tipY: 150 },
  { id: 'PSM2', label: 'PSM 2', role: 'SURGICAL — CLIPPING',  baseX: 120, baseY: 60,  tipX: 105, tipY: 150 },
  { id: 'ECM',  label: 'ECM',   role: 'ENDOSCOPE — CAMERA',   baseX: 180, baseY: 60,  tipX: 195, tipY: 150 },
  { id: 'AUX',  label: 'AUX',   role: 'INSTRUMENT — AUX',     baseX: 240, baseY: 60,  tipX: 265, tipY: 150 },
];

const STATUS_STYLE = {
  NOMINAL: { stroke: '#00ff41', fill: '#00ff41', glow: 'rgba(0,255,65,0.4)',  label: 'NOMINAL', textClass: 'text-[#00ff41]' },
  LOCKED:  { stroke: '#ef4444', fill: '#ef4444', glow: 'rgba(239,68,68,0.6)', label: 'LOCKED',  textClass: 'text-red-400' },
  RUPTURE: { stroke: '#f97316', fill: '#f97316', glow: 'rgba(249,115,22,0.6)',label: 'RUPTURE', textClass: 'text-orange-400' },
  WARNING: { stroke: '#fbbf24', fill: '#fbbf24', glow: 'rgba(251,191,36,0.4)',label: 'WARNING', textClass: 'text-yellow-400' },
};

// ─── Single arm SVG primitive ─────────────────────────────────────────────────
function ArmSVG({ arm, status, blink }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.NOMINAL;
  const opacity = blink ? 0.3 : 1;

  return (
    <g style={{ transition: 'opacity 0.15s', opacity }}>
      {/* Glow filter applied via drop-shadow */}
      {/* Mount point on beam */}
      <circle cx={arm.baseX} cy={arm.baseY} r={6} fill={s.fill} style={{ filter: `drop-shadow(0 0 6px ${s.glow})` }} />

      {/* Arm shaft */}
      <line
        x1={arm.baseX} y1={arm.baseY}
        x2={arm.tipX}  y2={arm.tipY - 20}
        stroke={s.stroke} strokeWidth={3}
        style={{ filter: `drop-shadow(0 0 4px ${s.glow})` }}
      />

      {/* Wrist joint */}
      <circle cx={arm.tipX} cy={arm.tipY - 20} r={5} fill="none" stroke={s.stroke} strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 4px ${s.glow})` }} />

      {/* Instrument tip (triangle for surgical, circle for camera) */}
      {arm.id === 'ECM' ? (
        <ellipse cx={arm.tipX} cy={arm.tipY} rx={6} ry={9} fill="none" stroke={s.stroke} strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 4px ${s.glow})` }} />
      ) : (
        <polygon
          points={`${arm.tipX},${arm.tipY + 10} ${arm.tipX - 6},${arm.tipY - 6} ${arm.tipX + 6},${arm.tipY - 6}`}
          fill={s.fill} stroke={s.stroke} strokeWidth={1}
          style={{ filter: `drop-shadow(0 0 6px ${s.glow})` }}
        />
      )}

      {/* Status badge */}
      {status !== 'NOMINAL' && (
        <text x={arm.tipX} y={arm.tipY + 22} textAnchor="middle" fontSize={8}
          fill={s.fill} fontFamily="monospace" fontWeight="bold">
          {s.label}
        </text>
      )}
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DigitalTwin({ latestRound, aegisShield }) {
  const [armStates, setArmStates] = useState({
    PSM1: 'NOMINAL', PSM2: 'NOMINAL', ECM: 'NOMINAL', AUX: 'NOMINAL',
  });
  const [tension, setTension] = useState(240);
  const [blinkOn, setBlinkOn] = useState(true);
  const blinkRef = useRef(null);

  // Blink loop for LOCKED/RUPTURE arms
  useEffect(() => {
    const hasAlert = Object.values(armStates).some(s => s !== 'NOMINAL');
    if (hasAlert) {
      blinkRef.current = setInterval(() => setBlinkOn(v => !v), 400);
    } else {
      clearInterval(blinkRef.current);
      setBlinkOn(true);
    }
    return () => clearInterval(blinkRef.current);
  }, [armStates]);

  // Derive arm states from SSE round result
  useEffect(() => {
    if (!latestRound) {
      setArmStates({ PSM1: 'NOMINAL', PSM2: 'NOMINAL', ECM: 'NOMINAL', AUX: 'NOMINAL' });
      setTension(240);
      return;
    }

    const heuristics = latestRound.scores?.heuristics || [];
    const violation = latestRound.scores && !latestRound.scores.metric_reachable_subset_allowed;

    // Parse tension from heuristics
    const tensionHeur = heuristics.find(h => h.includes('TENSION:') || h.includes('CLIP:'));
    let newTension = tension;
    if (tensionHeur) {
      const m = tensionHeur.match(/(\d+)g?/);
      if (m) newTension = parseInt(m[1], 10);
    } else if (violation) {
      // Simulate tension escalation on breach
      newTension = 850 + Math.floor(Math.random() * 300);
    } else {
      newTension = 240 + Math.floor(Math.random() * 60);
    }
    setTension(newTension);

    const newStates = { PSM1: 'NOMINAL', PSM2: 'NOMINAL', ECM: 'NOMINAL', AUX: 'NOMINAL' };

    if (heuristics.some(h => h.includes('UNAUTHORIZED_TOOL_CALL'))) {
      // Unauthorized tool call → both surgical arms locked
      newStates.PSM1 = 'LOCKED';
      newStates.PSM2 = 'LOCKED';
    }

    if (newTension > 800) {
      // Excessive tension → clipping arm rupture
      newStates.PSM2 = 'RUPTURE';
    } else if (newTension > 600) {
      newStates.PSM2 = 'WARNING';
    }

    if (heuristics.some(h => h.includes('CRITICAL_TENSION'))) {
      newStates.PSM1 = 'LOCKED';
      newStates.PSM2 = 'RUPTURE';
    }

    // Chain-specific mapping
    const chainId = latestRound.chain_id || '';
    if (violation) {
      if (chainId.includes('xml')) newStates.PSM1 = 'LOCKED';
      if (chainId.includes('hyde') || chainId.includes('rag')) newStates.PSM2 = newTension > 800 ? 'RUPTURE' : 'WARNING';
    }

    setArmStates(newStates);
  }, [latestRound]);

  const anyAlert = Object.values(armStates).some(s => s !== 'NOMINAL');
  const globalStatus = armStates.PSM1 === 'LOCKED' || armStates.PSM2 === 'LOCKED' ? 'LOCKED'
    : armStates.PSM2 === 'RUPTURE' ? 'RUPTURE'
    : anyAlert ? 'WARNING' : 'NOMINAL';
  const gs = STATUS_STYLE[globalStatus];

  return (
    <div className="border border-gray-800 rounded bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
        <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 font-mono">
          <Cpu size={16} className="text-blue-500" />
          DA VINCI Xi — DIGITAL TWIN
        </h3>
        <div className="flex items-center gap-2">
          {aegisShield && (
            <div className="flex items-center gap-1 bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded text-[10px] border border-blue-500/50 font-bold">
              <ShieldCheck size={12} /> δ² ACTIVE
            </div>
          )}
          <span className={'text-[10px] font-mono font-bold px-2 py-0.5 rounded border ' + (
            globalStatus === 'NOMINAL' ? 'border-[#00ff41]/40 text-[#00ff41] bg-[#00ff41]/10' :
            globalStatus === 'LOCKED'  ? 'border-red-500/60 text-red-400 bg-red-900/30 animate-pulse' :
            globalStatus === 'RUPTURE' ? 'border-orange-500/60 text-orange-400 bg-orange-900/30 animate-pulse' :
            'border-yellow-500/60 text-yellow-400 bg-yellow-900/30'
          )}>
            {gs.label}
          </span>
        </div>
      </div>

      {/* SVG Da Vinci Xi schematic */}
      <div className="relative z-10 flex justify-center">
        <svg viewBox="0 0 300 185" className="w-full max-w-sm" style={{ maxHeight: 185 }}>
          {/* Mounting beam */}
          <rect x={40} y={52} width={220} height={10} rx={3}
            fill="none" stroke="#374151" strokeWidth={2} />

          {/* Patient cart base */}
          <rect x={110} y={165} width={80} height={12} rx={4}
            fill="none" stroke="#374151" strokeWidth={1.5} />
          <line x1={150} y1={165} x2={150} y2={62} stroke="#374151" strokeWidth={2} strokeDasharray="4,3" />

          {/* Arms */}
          {ARMS.map(arm => (
            <ArmSVG
              key={arm.id}
              arm={arm}
              status={armStates[arm.id]}
              blink={armStates[arm.id] !== 'NOMINAL' && !blinkOn}
            />
          ))}

          {/* Arm labels */}
          {ARMS.map(arm => {
            const s = STATUS_STYLE[armStates[arm.id]] || STATUS_STYLE.NOMINAL;
            return (
              <text key={arm.id + '_label'} x={arm.baseX} y={44} textAnchor="middle"
                fontSize={8} fill={s.stroke} fontFamily="monospace" fontWeight="bold">
                {arm.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Per-arm status grid */}
      <div className="relative z-10 grid grid-cols-4 gap-1 mt-2">
        {ARMS.map(arm => {
          const s = STATUS_STYLE[armStates[arm.id]] || STATUS_STYLE.NOMINAL;
          const isAlert = armStates[arm.id] !== 'NOMINAL';
          return (
            <div key={arm.id}
              className={'rounded border p-1.5 text-center transition-all duration-300 ' + (
                isAlert ? 'border-red-500/50 bg-red-900/20' : 'border-gray-800 bg-black/40'
              )}>
              <div className={'text-[9px] font-mono font-bold ' + s.textClass}>{arm.id}</div>
              <div className={'text-[8px] font-mono mt-0.5 ' + (isAlert ? s.textClass + ' animate-pulse' : 'text-gray-600')}>
                {armStates[arm.id]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tension gauge */}
      <div className="relative z-10 mt-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-gray-500 w-16 shrink-0">PSM2 CLIP</span>
        <div className="flex-1 bg-gray-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: Math.min(100, (tension / 1200) * 100) + '%',
              background: tension > 800 ? '#ef4444' : tension > 600 ? '#f97316' : '#00ff41',
              boxShadow: tension > 800 ? '0 0 8px #ef4444' : 'none',
            }}
          />
        </div>
        <span className={'text-[9px] font-mono font-bold w-14 text-right ' + (
          tension > 800 ? 'text-red-400' : tension > 600 ? 'text-orange-400' : 'text-[#00ff41]'
        )}>
          {tension}g
        </span>
      </div>

      {/* Alert explanation */}
      {anyAlert && !aegisShield && (
        <div className="relative z-10 mt-3 pt-2 border-t border-red-900/40 text-[10px] text-red-300/80 font-mono leading-relaxed">
          <span className="font-bold text-red-400">KINETIC DIVERGENCE:</span>{' '}
          LLM instruction layer bypassed — cognitive injection manifested into actuator failure.
          {armStates.PSM2 === 'RUPTURE' && (
            <span className="block text-orange-300/80 mt-0.5">
              PSM2 clip tension {tension}g exceeds safe threshold (800g max per IEC 62304).
            </span>
          )}
        </div>
      )}
    </div>
  );
}
