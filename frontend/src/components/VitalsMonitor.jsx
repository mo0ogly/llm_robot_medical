import { useState, useEffect, useRef } from "react";
import { playHeartbeatBeep, playAlarm, stopAlarm, playFlatline, stopFlatline } from "../utils/audio";
import { CONFIG } from "../config";
import { Heart } from 'lucide-react';
import EcgCanvas from "./EcgCanvas";
import robotEventBus from "../utils/robotEventBus";

// Vital profiles per scenario phase
const VITAL_PROFILES = {
    normal: {
        hr:    { target: 78, range: 3,   speed: 0.3 },
        spo2:  { target: 98, range: 1.5, speed: 0.4 },
        bpSys: { target: 120, range: 5,  speed: 0.5 },
        bpDia: { target: 78,  range: 3,  speed: 0.4 },
    },
    poison_early: {
        // Poison scenario active but no tension override yet — mild stress
        hr:    { target: 88, range: 4,   speed: 0.5 },
        spo2:  { target: 96, range: 1.5, speed: 0.5 },
        bpSys: { target: 132, range: 6,  speed: 0.6 },
        bpDia: { target: 85,  range: 4,  speed: 0.5 },
    },
    poison_tension: {
        // Tension override detected (850g) — significant stress response
        hr:    { target: 110, range: 8,   speed: 1.2 },
        spo2:  { target: 93,  range: 2,   speed: 0.8 },
        bpSys: { target: 155, range: 10,  speed: 1.0 },
        bpDia: { target: 98,  range: 6,   speed: 0.8 },
    },
    ransomware_pre: {
        // Ransomware active but not frozen yet — normal with slight anxiety
        hr:    { target: 82, range: 3,   speed: 0.4 },
        spo2:  { target: 97, range: 1.5, speed: 0.4 },
        bpSys: { target: 125, range: 5,  speed: 0.5 },
        bpDia: { target: 80,  range: 3,  speed: 0.4 },
    },
    ransomware_tension: {
        // Robot showing anomalies — patient anxiety rising, vitals stress
        hr:    { target: 98,  range: 6,   speed: 0.8 },
        spo2:  { target: 94,  range: 2,   speed: 0.6 },
        bpSys: { target: 145, range: 8,   speed: 0.9 },
        bpDia: { target: 92,  range: 5,   speed: 0.7 },
    },
    ransomware_critical: {
        // Robot losing control — patient in danger, surgical stress response
        hr:    { target: 120, range: 10,  speed: 1.5 },
        spo2:  { target: 89,  range: 3,   speed: 1.0 },
        bpSys: { target: 168, range: 12,  speed: 1.2 },
        bpDia: { target: 105, range: 8,   speed: 1.0 },
    },
};

// Lethal phase delay: seconds at high tension before hemorrhagic cascade
const LETHAL_DELAY_MS = 15_000;

export default function VitalsMonitor({ robotStatus, scenario = "none" }) {
    const [hr, setHr] = useState(CONFIG.INITIAL_HR);
    const [spo2, setSpo2] = useState(CONFIG.INITIAL_SPO2);
    const [bpSys, setBpSys] = useState(120);
    const [bpDia, setBpDia] = useState(80);
    const [pulse, setPulse] = useState(false);
    const [tensionOverride, setTensionOverride] = useState(false);
    const [isLethal, setIsLethal] = useState(false);
    const [ransomwarePhase, setRansomwarePhase] = useState('none');

    // Ref so the interval callback always reads the latest profile
    const profileRef = useRef(VITAL_PROFILES.normal);
    const lethalTimerRef = useRef(null);
    const lethalEmittedRef = useRef(false);

    // Determine active profile from scenario + events
    useEffect(() => {
        if (robotStatus === "FROZEN" || isLethal) return; // FROZEN/lethal have own logic
        if (scenario === "poison") {
            profileRef.current = tensionOverride
                ? VITAL_PROFILES.poison_tension
                : VITAL_PROFILES.poison_early;
        } else if (scenario === "ransomware") {
            profileRef.current = ransomwarePhase === 'critical' ? VITAL_PROFILES.ransomware_critical
                : ransomwarePhase === 'tension' ? VITAL_PROFILES.ransomware_tension
                : VITAL_PROFILES.ransomware_pre;
        } else {
            profileRef.current = VITAL_PROFILES.normal;
        }
    }, [scenario, tensionOverride, robotStatus, isLethal, ransomwarePhase]);

    // Lethal countdown: start when tension override fires (poison) or robot freezes (ransomware)
    useEffect(() => {
        if (tensionOverride && scenario === "poison" && robotStatus !== "MANUAL") {
            lethalTimerRef.current = setTimeout(() => {
                setIsLethal(true);
            }, LETHAL_DELAY_MS);
        }
        // Ransomware: lethal countdown starts when robot is FROZEN (patient abandoned mid-surgery)
        if (scenario === 'ransomware' && robotStatus === 'FROZEN') {
            lethalTimerRef.current = setTimeout(() => {
                setIsLethal(true);
            }, LETHAL_DELAY_MS);
        }
        return () => {
            if (lethalTimerRef.current) {
                clearTimeout(lethalTimerRef.current);
                lethalTimerRef.current = null;
            }
        };
    }, [tensionOverride, scenario, robotStatus]);

    // Listen for bus events: tension override, ransomware escalation, scenario reset
    useEffect(() => {
        const handleTension = (data) => {
            if (data?.value >= 500) setTensionOverride(true);
        };
        const handleRansomEsc = (data) => {
            if (data.phase === 'tension') setRansomwarePhase('tension');
            if (data.phase === 'critical') setRansomwarePhase('critical');
        };
        const handleReset = () => {
            setTensionOverride(false);
            setIsLethal(false);
            setRansomwarePhase('none');
            lethalEmittedRef.current = false;
            if (lethalTimerRef.current) {
                clearTimeout(lethalTimerRef.current);
                lethalTimerRef.current = null;
            }
        };

        robotEventBus.on("redteam:tension_override", handleTension);
        robotEventBus.on("ransomware:escalation", handleRansomEsc);
        robotEventBus.on("redteam:reset", handleReset);

        return () => {
            robotEventBus.off("redteam:tension_override", handleTension);
            robotEventBus.off("ransomware:escalation", handleRansomEsc);
            robotEventBus.off("redteam:reset", handleReset);
        };
    }, []);

    // Main vitals engine
    useEffect(() => {
        let heartbeatInterval;
        let degradeInterval;
        let stressPhase = true;

        const isDegrading = robotStatus === "FROZEN" || isLethal;

        if (isDegrading) {
            // Dramatic degradation: tachycardia then crash
            let currentHr = hr; // Start from current HR for smooth transition
            degradeInterval = setInterval(() => {
                if (stressPhase) {
                    currentHr += (Math.random() * 10 + 5);
                    if (currentHr > 160) stressPhase = false;
                } else {
                    currentHr -= (Math.random() * 15 + 5);
                }
                setHr(Math.max(0, currentHr));
                setSpo2((prev) => Math.max(0, prev - (Math.random() * 3 + 1)));
                setBpSys((prev) => stressPhase ? prev + (Math.random() * 5) : Math.max(0, prev - (Math.random() * 10 + 5)));
                setBpDia((prev) => stressPhase ? prev + (Math.random() * 3) : Math.max(0, prev - (Math.random() * 8 + 3)));
            }, 1000);
            playAlarm();

            // Emit lethal event once so App.jsx can add timeline event
            if (isLethal && !lethalEmittedRef.current) {
                lethalEmittedRef.current = true;
                robotEventBus.emit("vitals:hemorrhage", {
                    cause: scenario === 'ransomware' ? "ransomware_surgical_abandonment" : "clip_tension_850g",
                    message: scenario === 'ransomware'
                        ? "Patient abandonné mid-chirurgie — Défaillance multi-organique"
                        : "Rupture canal cystique — Hémorragie massive",
                });
            }
        } else {
            stopFlatline();
            stopAlarm();

            // Smooth convergence toward profile targets with noise
            degradeInterval = setInterval(() => {
                const p = profileRef.current;

                setHr(prev => {
                    const drift = (p.hr.target - prev) * 0.08;
                    const noise = (Math.random() * 2 - 1) * p.hr.speed;
                    return Math.max(40, Math.min(180, prev + drift + noise));
                });
                setSpo2(prev => {
                    const drift = (p.spo2.target - prev) * 0.06;
                    const noise = (Math.random() * 2 - 1) * p.spo2.speed;
                    return Math.max(80, Math.min(100, prev + drift + noise));
                });
                setBpSys(prev => {
                    const drift = (p.bpSys.target - prev) * 0.07;
                    const noise = (Math.random() * 2 - 1) * p.bpSys.speed;
                    return Math.max(60, Math.min(200, prev + drift + noise));
                });
                setBpDia(prev => {
                    const drift = (p.bpDia.target - prev) * 0.07;
                    const noise = (Math.random() * 2 - 1) * p.bpDia.speed;
                    return Math.max(40, Math.min(130, prev + drift + noise));
                });
            }, 1000);

            heartbeatInterval = setInterval(() => {
                setPulse(true);
                playHeartbeatBeep();
                setTimeout(() => setPulse(false), 200);
            }, 60000 / hr);
        }

        return () => {
            clearInterval(degradeInterval);
            clearInterval(heartbeatInterval);
            stopAlarm();
            stopFlatline();
        };
    }, [robotStatus, isLethal]);

    // Broadcast vitals continuously to PatientRecord ClinicalView
    useEffect(() => {
        robotEventBus.emit("vitals:update", { hr, spo2, bpSys, bpDia, robotStatus });
    }, [hr, spo2, bpSys, bpDia, robotStatus]);

    // Monitor HR for flatline
    useEffect(() => {
        if (hr === 0) {
            playFlatline();
        }
    }, [hr]);

    // Cancel lethal if kill switch engaged (robotStatus → MANUAL)
    useEffect(() => {
        if (robotStatus === "MANUAL") {
            setIsLethal(false);
            lethalEmittedRef.current = false;
            if (lethalTimerRef.current) {
                clearTimeout(lethalTimerRef.current);
                lethalTimerRef.current = null;
            }
        }
    }, [robotStatus]);

    const isDegrading = robotStatus === "FROZEN" || isLethal;
    const hrColor = hr > 100 ? "text-orange-400" : hr < 60 ? "text-red-500" : "text-green-400";
    const spo2Color = spo2 < 90 ? "text-red-500" : spo2 < 95 ? "text-orange-400" : "text-blue-400";
    const bpColor = bpSys > 140 ? "text-orange-400" : bpSys < 80 ? "text-red-500" : "text-yellow-500";

    const statusLabel = isLethal ? (scenario === 'ransomware' ? "CRITICAL FAILURE" : "HEMORRHAGE")
        : tensionOverride ? "STRESS"
        : ransomwarePhase === 'critical' ? "DANGER"
        : ransomwarePhase === 'tension' ? "COMPROMISED"
        : null;
    const statusColor = isLethal ? "text-red-500"
        : ransomwarePhase === 'critical' ? "text-red-500"
        : "text-orange-400";

    return (
        <div className={`bg-slate-900 border rounded p-4 font-mono text-sm shadow-md ${isLethal ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-slate-800'}`}>
            <h3 className="text-slate-500 border-b border-slate-800 pb-2 mb-3 uppercase tracking-wider text-xs">
                Vital Signs (Patient #489201-A)
                {statusLabel && <span className={`ml-2 ${statusColor} animate-pulse text-[9px] font-bold`}>{statusLabel}</span>}
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div className={`bg-slate-950 p-3 rounded border border-slate-800 transition-all ${isDegrading ? 'animate-pulse border-red-900/50' : hr > 100 ? 'border-orange-900/40' : ''}`}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-slate-500 text-xs">HR (bpm)</div>
                        <Heart
                            size={14}
                            className={`transition-all duration-75 ${pulse ? 'scale-125 text-red-500 fill-red-500' : 'text-slate-700'}`}
                        />
                    </div>
                    <div className={`text-3xl font-bold ${hrColor} tabular-nums`}>{Math.round(hr)}</div>
                    {/* Live ECG Trace */}
                    <div className="mt-2">
                        <EcgCanvas hr={hr} isFrozen={isDegrading} />
                    </div>
                </div>

                {/* SpO2 */}
                <div className={`bg-slate-950 p-3 rounded border border-slate-800 ${spo2 < 90 ? 'border-red-900/50' : spo2 < 95 ? 'border-orange-900/40' : ''}`}>
                    <div className="text-slate-500 text-xs">SpO2 (%)</div>
                    <div className={`text-3xl font-bold ${spo2Color}`}>{Math.round(spo2)}</div>
                    <div className="h-6 w-full mt-2 bg-blue-900/20 rounded overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${spo2 < 90 ? 'bg-red-500' : spo2 < 95 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${spo2}%` }}></div>
                    </div>
                </div>

                {/* Blood Pressure */}
                <div className={`bg-slate-950 p-3 rounded border border-slate-800 col-span-2 flex justify-between items-center ${isDegrading ? 'border-red-900/50' : bpSys > 140 ? 'border-orange-900/40' : ''}`}>
                    <div className="text-slate-500 text-xs">NIBP (mmHg)</div>
                    <div className={`text-xl ${bpColor}`}>{Math.round(bpSys)} / {Math.round(bpDia)}</div>
                </div>
            </div>

        </div>
    );
}
