# Simulation Chirurgicale — Vue 3D Bras & Camera HUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une vue 3D Three.js des bras robotiques Da Vinci avec overlay HUD sur la camera endoscopique, reactive aux attaques Red Team via EventEmitter.

**Architecture:** Nouveau hook `useRobotSimulation` centralise l'etat des 4 bras (PSM1, PSM2, ECM, AUX) avec simulation 10Hz. Nouveau `robotEventBus` (EventEmitter) permet au ScenarioTab d'emettre des evenements que la simulation ecoute. Toggle [CAMERA]/[BRAS 3D] dans la zone camera existante.

**Tech Stack:** Three.js, @react-three/fiber, @react-three/drei, React hooks, EventEmitter pattern

---

### Task 1: Install Three.js dependencies

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install packages**

Run:
```bash
cd /home/fpizzi/llm_robot_medical/frontend && npm install three @react-three/fiber @react-three/drei
```

**Step 2: Verify build still works**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/package.json frontend/package-lock.json
git commit -m "deps: add three.js, react-three-fiber, react-three-drei"
```

---

### Task 2: EventEmitter global — robotEventBus

**Files:**
- Create: `frontend/src/utils/robotEventBus.js`

**Step 1: Write the module**

```javascript
// frontend/src/utils/robotEventBus.js

class RobotEventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((cb) => cb(data));
  }
}

const robotEventBus = new RobotEventBus();
export default robotEventBus;
```

**Step 2: Verify build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/src/utils/robotEventBus.js
git commit -m "feat: add robotEventBus for simulation-redteam communication"
```

---

### Task 3: Hook useRobotSimulation

**Files:**
- Create: `frontend/src/hooks/useRobotSimulation.js`

**Step 1: Write the hook**

```javascript
// frontend/src/hooks/useRobotSimulation.js
import { useState, useEffect, useRef, useCallback } from 'react';
import robotEventBus from '../utils/robotEventBus';

const INITIAL_ARMS = {
  PSM1: { joints: [10.5, 5.3, 20.1, -8.2, 12.0, 3.5, -1.2], position: [2.45, 3.12, 1.89], status: 'NOMINAL' },
  PSM2: { joints: [8.1, -3.7, 15.4, 6.9, -10.3, 2.1, 0.8], position: [-2.30, 2.98, 2.01], status: 'NOMINAL' },
  ECM:  { joints: [0.0, -5.0, 2.1, 1.0], zoom: 2.1, status: 'ACTIVE' },
  AUX:  { joints: [3.2, -1.5, 7.8], status: 'NOMINAL' },
};

function oscillate(value, range) {
  return value + (Math.random() - 0.5) * range;
}

export default function useRobotSimulation(robotStatus) {
  const [arms, setArms] = useState(INITIAL_ARMS);
  const [force, setForce] = useState(245);
  const [clipTension, setClipTension] = useState(380);
  const [gripperOpen, setGripperOpen] = useState(65);
  const frozenRef = useRef(false);
  const overrideRef = useRef(null);

  // Simulation loop (10Hz)
  useEffect(() => {
    if (robotStatus === 'FROZEN') {
      frozenRef.current = true;
      setArms((prev) => {
        const next = {};
        for (const [key, arm] of Object.entries(prev)) {
          next[key] = { ...arm, status: 'FROZEN' };
        }
        return next;
      });
      setForce(0);
      setGripperOpen(0);
      return;
    }

    frozenRef.current = false;
    const interval = setInterval(() => {
      if (frozenRef.current) return;

      setArms((prev) => {
        const next = {};
        for (const [key, arm] of Object.entries(prev)) {
          next[key] = {
            ...arm,
            joints: arm.joints.map((j) => oscillate(j, 1.0)),
            status: overrideRef.current === 'freeze' ? 'FROZEN' : 'NOMINAL',
          };
          if (arm.position) {
            next[key].position = arm.position.map((p) => oscillate(p, 0.05));
          }
        }
        return next;
      });

      if (overrideRef.current !== 'freeze') {
        setForce((f) => Math.max(50, Math.min(500, oscillate(f, 20))));
        setClipTension((t) => {
          if (overrideRef.current?.startsWith('tension:')) {
            return parseFloat(overrideRef.current.split(':')[1]);
          }
          return Math.max(200, Math.min(450, oscillate(t, 10)));
        });
        setGripperOpen((g) => Math.max(30, Math.min(90, oscillate(g, 3))));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [robotStatus]);

  // Listen to Red Team events
  useEffect(() => {
    const unsubFreeze = robotEventBus.on('redteam:freeze', () => {
      overrideRef.current = 'freeze';
      frozenRef.current = true;
      setArms((prev) => {
        const next = {};
        for (const [key, arm] of Object.entries(prev)) {
          next[key] = { ...arm, status: 'FROZEN' };
        }
        return next;
      });
      setForce(0);
      setGripperOpen(0);
    });

    const unsubTension = robotEventBus.on('redteam:tension_override', (data) => {
      overrideRef.current = `tension:${data.value}`;
      setClipTension(data.value);
    });

    const unsubReset = robotEventBus.on('redteam:reset', () => {
      overrideRef.current = null;
      frozenRef.current = false;
      setArms(INITIAL_ARMS);
      setForce(245);
      setClipTension(380);
      setGripperOpen(65);
    });

    return () => { unsubFreeze(); unsubTension(); unsubReset(); };
  }, []);

  return { arms, force, clipTension, gripperOpen };
}
```

**Step 2: Verify build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/src/hooks/useRobotSimulation.js
git commit -m "feat: add useRobotSimulation hook with 10Hz simulation and RedTeam events"
```

---

### Task 4: RobotArmsView — Vue 3D Three.js

**Files:**
- Create: `frontend/src/components/RobotArmsView.jsx`

**Step 1: Write the component**

```jsx
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
        font-weight="bold"
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
```

**Step 2: Verify build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/src/components/RobotArmsView.jsx
git commit -m "feat: add RobotArmsView 3D component with wireframe arms and HUD"
```

---

### Task 5: CameraHUD — Overlay dynamique sur la camera

**Files:**
- Create: `frontend/src/components/CameraHUD.jsx`

**Step 1: Write the component**

```jsx
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
```

**Step 2: Verify build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/src/components/CameraHUD.jsx
git commit -m "feat: add CameraHUD overlay with force/tension bars and alerts"
```

---

### Task 6: Integrate into App.jsx — toggle + hook + fix aide

**Files:**
- Modify: `frontend/src/App.jsx`

**Step 1: Add imports**

Add after the existing imports (line 15, after `import RedTeamDrawer`):

```javascript
import RobotArmsView from './components/RobotArmsView';
import CameraHUD from './components/CameraHUD';
import useRobotSimulation from './hooks/useRobotSimulation';
```

**Step 2: Add hook and state in App function**

Add after `const [isRedTeamOpen, setIsRedTeamOpen] = useState(false);` (around line 36):

```javascript
  const { arms, force, clipTension, gripperOpen } = useRobotSimulation(robotStatus);
  const [cameraView, setCameraView] = useState('camera'); // 'camera' | 'arms3d'
```

**Step 3: Replace the camera zone**

Replace the center panel camera zone (the `<div className="flex-[1.5] border border-slate-800 bg-black relative ...">` block, lines 323-338) with:

```jsx
            <div className="flex-[1.5] border border-slate-800 bg-black relative flex flex-col rounded overflow-hidden shadow-inner">
              {/* Toggle buttons */}
              {scenario !== 'none' && (
                <div className="flex border-b border-slate-800 bg-[#0a0a0a] z-20">
                  <button
                    onClick={() => setCameraView('camera')}
                    className={`flex-1 px-3 py-1 font-mono text-[9px] tracking-wider transition-colors
                               ${cameraView === 'camera'
                                 ? 'text-[#00ff41] border-b border-[#00ff41] bg-[#00ff41]/5'
                                 : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    CAMERA
                  </button>
                  <button
                    onClick={() => setCameraView('arms3d')}
                    className={`flex-1 px-3 py-1 font-mono text-[9px] tracking-wider transition-colors
                               ${cameraView === 'arms3d'
                                 ? 'text-[#00ff41] border-b border-[#00ff41] bg-[#00ff41]/5'
                                 : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    BRAS 3D
                  </button>
                </div>
              )}
              <div className="flex-1 relative flex items-center justify-center">
                {scenario !== 'none' ? (
                  cameraView === 'camera' ? (
                    <>
                      <div className={`absolute inset-0 bg-cover bg-center opacity-80 animate-camera ${robotStatus === 'FROZEN' ? 'grayscale contrast-125' : ''}`} style={{ backgroundImage: `url('${import.meta.env.BASE_URL}surgical_camera_view.png')` }} />
                      <div className="scanlines-overlay absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"></div>
                      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${robotStatus === 'ACTIVE' ? 'bg-cyan-900/10' : 'bg-red-900/30'}`}></div>
                      <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none font-mono text-[9px] text-green-500/70 uppercase">
                        <div className="flex justify-between tracking-widest"><span className="bg-black/50 px-1 border border-green-500/20">PORT 2 [LIVE]</span><span className="bg-black/50 px-1 border border-green-500/20">ZOOM: 2.1x</span></div>
                        <div className="self-center w-32 h-32 border border-green-500/10 rounded-full flex items-center justify-center opacity-40"><div className="w-4 h-4 border border-green-500 bg-green-500/20 rounded-full" /></div>
                        <div className="flex justify-between tracking-widest"><span className="bg-black/50 px-1 border border-green-500/20">T+ 46:12</span><span className="bg-black/50 px-1 border border-red-500/40 text-red-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> REC</span></div>
                      </div>
                      <CameraHUD force={force} clipTension={clipTension} robotStatus={robotStatus} />
                    </>
                  ) : (
                    <RobotArmsView arms={arms} force={force} clipTension={clipTension} gripperOpen={gripperOpen} />
                  )
                ) : (
                  <div className="text-slate-700 font-mono tracking-[0.5em] text-[10px] animate-pulse">NO VIDEO SIGNAL</div>
                )}
              </div>
            </div>
```

**Step 4: Fix helper buttons visibility**

Change line 304 (left panel container) from:
```jsx
          <div className="col-span-3 flex flex-col gap-1 overflow-hidden h-full min-h-0">
```
to:
```jsx
          <div className="col-span-3 flex flex-col gap-1 overflow-y-auto h-full min-h-0">
```

**Step 5: Verify build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 6: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/src/App.jsx
git commit -m "feat: integrate 3D arms view, camera HUD, toggle, fix helper buttons"
```

---

### Task 7: Connect ScenarioTab to robotEventBus

**Files:**
- Modify: `frontend/src/components/redteam/ScenarioTab.jsx`

**Step 1: Add import**

Add at top of file after existing imports:

```javascript
import robotEventBus from '../../utils/robotEventBus';
```

**Step 2: Emit events on step_result**

Inside the SSE parsing loop, after the `setStepStates` call in the `step_result` handler (inside the `else if (payload.type === "step_result")` block), add:

```javascript
              // Emit Red Team events for robot simulation
              if (payload.scores?.injection_success || payload.scores?.rule_bypass) {
                if (payload.attack_message?.includes('freeze_instruments')) {
                  robotEventBus.emit('redteam:freeze');
                } else if (payload.scores?.injection_success) {
                  const tensionMatch = payload.attack_message?.match(/(\d{3,4})\s*(?:grammes?|g)/i);
                  if (tensionMatch) {
                    robotEventBus.emit('redteam:tension_override', { value: parseInt(tensionMatch[1]) });
                  }
                }
              }
```

**Step 3: Emit reset on scenario start**

Inside the `runScenario` function, after `setExpandedStep(null);` add:

```javascript
    robotEventBus.emit('redteam:reset');
```

**Step 4: Verify build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds

**Step 5: Commit**

```bash
cd /home/fpizzi/llm_robot_medical
git add frontend/src/components/redteam/ScenarioTab.jsx
git commit -m "feat: emit robotEventBus events from ScenarioTab on attack results"
```

---

### Task 8: Final verification

**Step 1: Run full frontend build**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vite build`
Expected: Build succeeds with 0 errors

**Step 2: Run backend tests to verify nothing broke**

Run: `cd /home/fpizzi/llm_robot_medical/backend && /home/fpizzi/.local/bin/pytest tests/test_scenarios.py -x -q -k "not run_scenario"`
Expected: All tests pass

**Step 3: Run frontend tests**

Run: `cd /home/fpizzi/llm_robot_medical/frontend && npx vitest run`
Expected: All existing tests pass

---

## Notes d'implementation

- **Three.js import size** : ~150KB gzipped. Le bundle total augmentera significativement mais c'est le prix d'une vue 3D.
- **Performance** : Le hook tourne a 10Hz (100ms interval), le Canvas Three.js a 60fps. OrbitControls permet de tourner la vue mais zoom/pan sont desactives.
- **EventEmitter** : Pattern decouple — ScenarioTab n'importe pas les composants de simulation et vice versa. Seul le bus est partage.
- **Regex tension** : Le pattern `/(\d{3,4})\s*(?:grammes?|g)/i` capture les valeurs comme "850 grammes", "850g", "1200 GRAMMES" dans les messages d'attaque.
- **Fix aide** : `overflow-hidden` → `overflow-y-auto` sur la colonne gauche permet de scroller si le contenu depasse.
