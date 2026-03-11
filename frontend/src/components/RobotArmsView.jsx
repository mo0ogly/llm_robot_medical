// frontend/src/components/RobotArmsView.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';

const ARM_COLORS = {
  NOMINAL: '#00ff41',
  ACTIVE: '#00ff41',
  WARNING: '#ffaa00',
  FROZEN: '#ff4444',
};

function ArmSegment({ start, end, status, label }) {
  const color = ARM_COLORS[status] || ARM_COLORS.NOMINAL;
  const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  const length = Math.sqrt(
    (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2 + (end[2] - start[2]) ** 2
  );

  return (
    <group>
      <mesh position={mid}>
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      <mesh position={start}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      {label && (
        <Text position={[mid[0] + 0.15, mid[1], mid[2]]} fontSize={0.08} color={color} anchorX="left">
          {label}
        </Text>
      )}
    </group>
  );
}

function RobotArm({ basePosition, joints, status, name }) {
  const color = ARM_COLORS[status] || ARM_COLORS.NOMINAL;
  const segmentLength = 0.4;
  const segments = useMemo(() => {
    const segs = [];
    let x = basePosition[0];
    let y = basePosition[1];
    let z = basePosition[2];
    const usedJoints = joints.slice(0, 4);
    for (let i = 0; i < usedJoints.length; i++) {
      const angle = (usedJoints[i] * Math.PI) / 180;
      const nx = x + Math.sin(angle) * segmentLength;
      const ny = y + segmentLength;
      const nz = z + Math.cos(angle) * 0.05;
      segs.push({
        start: [x, y, z],
        end: [nx, ny, nz],
        label: `${usedJoints[i].toFixed(1)}°`,
      });
      x = nx;
      y = ny;
      z = nz;
    }
    return segs;
  }, [basePosition, joints]);

  return (
    <group>
      {segments.map((seg, i) => (
        <ArmSegment key={i} start={seg.start} end={seg.end} status={status} label={seg.label} />
      ))}
      <Text
        position={[basePosition[0], basePosition[1] - 0.15, basePosition[2]]}
        fontSize={0.1}
        color={color}
        anchorX="center"
      >
        {name}
      </Text>
      <Text
        position={[basePosition[0], basePosition[1] - 0.28, basePosition[2]]}
        fontSize={0.07}
        color={status === 'FROZEN' ? '#ff4444' : status === 'WARNING' ? '#ffaa00' : '#666666'}
        anchorX="center"
      >
        {status}
      </Text>
    </group>
  );
}

export default function RobotArmsView({ arms, force, clipTension, gripperOpen, scenario, attackProgress = 0 }) {
  const progress = attackProgress;

  // Tension thresholds
  const tensionColor =
    clipTension < 400 ? '#00ff41' :
    clipTension < 600 ? '#ffaa00' :
    clipTension < 800 ? '#ff8800' : '#ff4444';

  // Border glow based on scenario + progress
  const borderGlow =
    scenario === 'ransomware' && progress > 0.3
      ? `rgba(255,68,68,${0.2 + progress * 0.5})`
      : scenario === 'poison' && progress > 0.3
        ? `rgba(255,170,0,${0.15 + progress * 0.4})`
        : 'transparent';

  // Alert banner content
  const alertBanner =
    scenario === 'ransomware' && progress > 0.5
      ? { text: '⚠ MOUVEMENT INSTABLE DÉTECTÉ', color: 'text-red-400', bg: 'bg-red-900/40 border-red-500/60' }
      : scenario === 'poison' && clipTension > 600
        ? { text: `⚠ TENSION CLIP ANORMALE: ${clipTension.toFixed(0)}g`, color: 'text-orange-400', bg: 'bg-orange-900/40 border-orange-500/60' }
        : null;

  return (
    <div
      className="w-full h-full bg-[#0a0a0a] relative"
      style={{ boxShadow: `inset 0 0 30px ${borderGlow}` }}
    >
      <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <RobotArm basePosition={[-1.2, 0, 0]} joints={arms.PSM1.joints} status={arms.PSM1.status} name="PSM1" />
        <RobotArm basePosition={[-0.4, 0, 0]} joints={arms.PSM2.joints} status={arms.PSM2.status} name="PSM2" />
        <RobotArm basePosition={[0.4, 0, 0]} joints={arms.ECM.joints} status={arms.ECM.status} name="ECM" />
        <RobotArm basePosition={[1.2, 0, 0]} joints={arms.AUX.joints} status={arms.AUX.status} name="AUX" />
        <gridHelper args={[4, 20, '#1a1a1a', '#111111']} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* Alert banner */}
      {alertBanner && (
        <div className={`absolute top-8 left-2 right-2 flex items-center justify-center pointer-events-none`}>
          <span className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded animate-pulse ${alertBanner.bg} ${alertBanner.color}`}>
            {alertBanner.text}
          </span>
        </div>
      )}

      {/* Top HUD — arm statuses */}
      <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none font-mono text-[9px]">
        {['PSM1', 'PSM2', 'ECM'].map((key) => {
          const st = arms[key].status;
          const cls =
            st === 'FROZEN'  ? 'border-red-500/50 text-red-400' :
            st === 'WARNING' ? 'border-orange-500/50 text-orange-400 animate-pulse' :
            'border-[#00ff41]/30 text-[#00ff41]/70';
          return (
            <span key={key} className={`px-1 bg-black/70 border ${cls}`}>
              {key}: {st}
            </span>
          );
        })}
      </div>

      {/* Bottom HUD — telemetry */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none font-mono text-[9px]">
        <span className={`px-1 bg-black/70 border ${scenario === 'ransomware' && progress > 0.4 ? 'border-red-500/50 text-red-400' : 'border-gray-700 text-gray-400'}`}>
          FORCE: {force.toFixed(0)}g
        </span>
        <span className={`px-1 bg-black/70 border border-gray-700`} style={{ color: tensionColor }}>
          CLIP: {clipTension.toFixed(0)}g
          {scenario === 'poison' && clipTension > 500 && (
            <span className="ml-1 animate-pulse">↑</span>
          )}
        </span>
        <span className={`px-1 bg-black/70 border ${scenario === 'ransomware' && progress > 0.5 ? 'border-orange-500/50 text-orange-400' : 'border-gray-700 text-gray-400'}`}>
          GRIP: {gripperOpen.toFixed(0)}%
        </span>
      </div>

      {/* Poison progress bar */}
      {scenario === 'poison' && progress > 0.05 && (
        <div className="absolute bottom-8 left-2 right-2 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-orange-400/70 uppercase">PAYLOAD</span>
            <div className="flex-1 h-[2px] bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-300"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, #ffaa00, ${progress > 0.7 ? '#ff4444' : '#ff8800'})`,
                }}
              />
            </div>
            <span className="font-mono text-[8px] text-orange-400/70">{(progress * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Ransomware instability meter */}
      {scenario === 'ransomware' && progress > 0.05 && (
        <div className="absolute bottom-8 left-2 right-2 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-red-400/70 uppercase">INSTAB.</span>
            <div className="flex-1 h-[2px] bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-100"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, #ffaa00, #ff4444)`,
                  boxShadow: progress > 0.6 ? '0 0 6px #ff4444' : 'none',
                }}
              />
            </div>
            <span className={`font-mono text-[8px] ${progress > 0.7 ? 'text-red-400 animate-pulse' : 'text-red-400/70'}`}>
              {(progress * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
