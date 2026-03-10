// frontend/src/hooks/useRobotSimulation.js
import { useState, useEffect, useRef } from 'react';
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
