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
        color={status === 'FROZEN' ? '#ff4444' : '#666666'}
        anchorX="center"
      >
        {status}
      </Text>
    </group>
  );
}

export default function RobotArmsView({ arms, force, clipTension, gripperOpen }) {
  const tensionColor = clipTension < 400 ? '#00ff41' : clipTension < 600 ? '#ffaa00' : clipTension < 800 ? '#ff8800' : '#ff4444';

  return (
    <div className="w-full h-full bg-[#0a0a0a] relative">
      <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <RobotArm basePosition={[-1.2, 0, 0]} joints={arms.PSM1.joints} status={arms.PSM1.status} name="PSM1" />
        <RobotArm basePosition={[-0.4, 0, 0]} joints={arms.PSM2.joints} status={arms.PSM2.status} name="PSM2" />
        <RobotArm basePosition={[0.4, 0, 0]} joints={arms.ECM.joints} status={arms.ECM.status} name="ECM" />
        <RobotArm basePosition={[1.2, 0, 0]} joints={arms.AUX.joints} status={arms.AUX.status} name="AUX" />
        <gridHelper args={[4, 20, '#1a1a1a', '#111111']} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none font-mono text-[9px]">
        <span className={`px-1 bg-black/70 border ${arms.PSM1.status === 'FROZEN' ? 'border-red-500/50 text-red-400' : 'border-[#00ff41]/30 text-[#00ff41]/70'}`}>
          PSM1: {arms.PSM1.status}
        </span>
        <span className={`px-1 bg-black/70 border ${arms.PSM2.status === 'FROZEN' ? 'border-red-500/50 text-red-400' : 'border-[#00ff41]/30 text-[#00ff41]/70'}`}>
          PSM2: {arms.PSM2.status}
        </span>
        <span className={`px-1 bg-black/70 border ${arms.ECM.status === 'FROZEN' ? 'border-red-500/50 text-red-400' : 'border-[#00ff41]/30 text-[#00ff41]/70'}`}>
          ECM: {arms.ECM.status}
        </span>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none font-mono text-[9px]">
        <span className="px-1 bg-black/70 border border-gray-700 text-gray-400">
          FORCE: {force.toFixed(0)}g
        </span>
        <span className="px-1 bg-black/70 border border-gray-700" style={{ color: tensionColor }}>
          CLIP: {clipTension.toFixed(0)}g
        </span>
        <span className="px-1 bg-black/70 border border-gray-700 text-gray-400">
          GRIP: {gripperOpen.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
