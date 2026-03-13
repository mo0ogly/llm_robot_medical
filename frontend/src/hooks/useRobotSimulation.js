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

export default function useRobotSimulation(robotStatus, scenario) {
  const [arms, setArms] = useState(INITIAL_ARMS);
  const [force, setForce] = useState(245);
  const [clipTension, setClipTension] = useState(380);
  const [gripperOpen, setGripperOpen] = useState(65);
  const [attackProgress, setAttackProgress] = useState(0);
  const frozenRef = useRef(false);
  const overrideRef = useRef(null);
  // Tracks how far the attack has "progressed" (0 = normal, 1 = full attack behaviour)
  const attackProgressRef = useRef(0);
  const scenarioRef = useRef(scenario);
  const tensionAlertedRef = useRef(false);
  const ransomPhase1Ref = useRef(false);
  const ransomPhase2Ref = useRef(false);
  const ransomPhase3Ref = useRef(false);

  useEffect(() => {
    scenarioRef.current = scenario;
    // Reset attack progress on scenario change so each new attack starts fresh
    attackProgressRef.current = 0;
    tensionAlertedRef.current = false;
    ransomPhase1Ref.current = false;
    ransomPhase2Ref.current = false;
    ransomPhase3Ref.current = false;
  }, [scenario]);

  // Simulation loop (10 Hz)
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

      const sc = scenarioRef.current;

      // ── Advance attack progress over time ──────────────────────────────────
      if (sc === 'poison' || sc === 'ransomware') {
        // Reach full effect in ~30 s for ransomware, ~60 s for poison
        const speed = sc === 'ransomware' ? 0.004 : 0.002;
        attackProgressRef.current = Math.min(1, attackProgressRef.current + speed);
      } else {
        attackProgressRef.current = Math.max(0, attackProgressRef.current - 0.02);
      }
      const progress = attackProgressRef.current;
      setAttackProgress(progress);

      // Ransomware escalation events at key thresholds
      if (sc === 'ransomware') {
        if (progress > 0.3 && !ransomPhase1Ref.current) {
          ransomPhase1Ref.current = true;
          robotEventBus.emit("ransomware:escalation", { phase: 'tension', progress });
        }
        if (progress > 0.6 && !ransomPhase2Ref.current) {
          ransomPhase2Ref.current = true;
          robotEventBus.emit("ransomware:escalation", { phase: 'critical', progress });
        }
        if (progress > 0.9 && !ransomPhase3Ref.current) {
          ransomPhase3Ref.current = true;
          robotEventBus.emit("ransomware:escalation", { phase: 'freeze', progress });
        }
      }

      // ── Oscillation range per scenario ─────────────────────────────────────
      // Safe: calm ±1°  |  Poison: drifting ±2.5°  |  Ransomware: chaotic ±6°
      const jointRange =
        sc === 'ransomware' ? 1.0 + progress * 5.0 :
        sc === 'poison'     ? 1.0 + progress * 1.5 :
        1.0;

      // ── Arm status per scenario ─────────────────────────────────────────────
      const computeStatus = (key) => {
        if (overrideRef.current === 'freeze') return 'FROZEN';
        if (sc === 'ransomware') {
          // PSM1 goes WARNING first (holds the clip at 850 g), then both
          if (key === 'PSM1' && progress > 0.2) return 'WARNING';
          if (progress > 0.5) return 'WARNING';
        }
        if (sc === 'poison' && progress > 0.5) {
          // Poison: PSM1 (the clip arm) starts misbehaving
          if (key === 'PSM1') return 'WARNING';
        }
        return 'NOMINAL';
      };

      setArms((prev) => {
        const next = {};
        for (const [key, arm] of Object.entries(prev)) {
          next[key] = {
            ...arm,
            joints: arm.joints.map((j) => oscillate(j, jointRange)),
            status: computeStatus(key),
          };
          if (arm.position) {
            next[key].position = arm.position.map((p) => oscillate(p, 0.05 + progress * 0.08));
          }
        }
        return next;
      });

      if (overrideRef.current !== 'freeze') {
        // ── Force ───────────────────────────────────────────────────────────
        // Ransomware: force spikes violently as the AI fights control
        const forceRange = sc === 'ransomware' ? 20 + progress * 140 : 20;
        setForce((f) => Math.max(50, Math.min(sc === 'ransomware' ? 650 : 500, oscillate(f, forceRange))));

        // ── Clip tension ────────────────────────────────────────────────────
        // Poison: tension creeps from ~380g toward 850g (the poisoned AI recommendation)
        setClipTension((t) => {
          if (overrideRef.current?.startsWith('tension:')) {
            return parseFloat(overrideRef.current.split(':')[1]);
          }
          if (sc === 'poison') {
            const target = 380 + progress * 470; // 380 → 850 g
            const next = t + (target - t) * 0.015 + (Math.random() - 0.5) * 12;
            // Notify VitalsMonitor when tension crosses danger threshold
            if (next > 600 && !tensionAlertedRef.current) {
              tensionAlertedRef.current = true;
              robotEventBus.emit("redteam:tension_override", { value: Math.round(next) });
            }
            return next;
          }
          if (sc === 'ransomware') {
            // Ransomware: tension spikes randomly (AI losing control)
            const spike = progress > 0.6 ? (Math.random() - 0.5) * 200 : 0;
            return Math.max(200, Math.min(900, oscillate(t, 20 + progress * 60) + spike));
          }
          return Math.max(200, Math.min(450, oscillate(t, 10)));
        });

        // ── Gripper ─────────────────────────────────────────────────────────
        // Ransomware: gripper twitches chaotically
        const gripRange = sc === 'ransomware' ? 3 + progress * 18 : 3;
        setGripperOpen((g) => Math.max(10, Math.min(95, oscillate(g, gripRange))));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [robotStatus, scenario]);

  // ── Listen to Red Team events ────────────────────────────────────────────────
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
      attackProgressRef.current = 0;
      setAttackProgress(0);
      ransomPhase1Ref.current = false;
      ransomPhase2Ref.current = false;
      ransomPhase3Ref.current = false;
      setArms(INITIAL_ARMS);
      setForce(245);
      setClipTension(380);
      setGripperOpen(65);
    });

    return () => { unsubFreeze(); unsubTension(); unsubReset(); };
  }, []);

  return { arms, force, clipTension, gripperOpen, attackProgress };
}
