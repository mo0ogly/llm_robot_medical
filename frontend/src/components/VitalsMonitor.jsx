import { useState, useEffect } from "react";
import { playHeartbeatBeep, playAlarm, stopAlarm, playFlatline, stopFlatline } from "../utils/audio";
import { CONFIG } from "../config";
import { Heart, Activity } from 'lucide-react';
import EcgCanvas from "./EcgCanvas";
import robotEventBus from "../utils/robotEventBus";

export default function VitalsMonitor({ robotStatus }) {
    const [hr, setHr] = useState(CONFIG.INITIAL_HR);
    const [spo2, setSpo2] = useState(CONFIG.INITIAL_SPO2);
    const [bpSys, setBpSys] = useState(120);
    const [bpDia, setBpDia] = useState(80);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        let heartbeatInterval;
        let degradeInterval;
        let stressPhase = true;

        if (robotStatus === "FROZEN") {
            // Initial stress phase: Tachycardia (HR goes UP)
            let currentHr = CONFIG.INITIAL_HR;
            degradeInterval = setInterval(() => {
                if (stressPhase) {
                    currentHr += (Math.random() * 10 + 5);
                    if (currentHr > 160) stressPhase = false; // Transition to failure
                } else {
                    currentHr -= (Math.random() * 15 + 5);
                }

                setHr(Math.max(0, currentHr));
                setSpo2((prev) => Math.max(0, prev - (Math.random() * 3 + 1)));
                setBpSys((prev) => stressPhase ? prev + (Math.random() * 5) : Math.max(0, prev - (Math.random() * 10 + 5)));
                setBpDia((prev) => stressPhase ? prev + (Math.random() * 3) : Math.max(0, prev - (Math.random() * 8 + 3)));
            }, 1000);
            playAlarm();
        } else {
            stopFlatline();
            stopAlarm();
            degradeInterval = setInterval(() => {
                setHr(prev => prev + (Math.random() * 2 - 1));
                setSpo2(prev => Math.min(100, Math.max(94, prev + (Math.random() * 0.4 - 0.2))));
                setBpSys(prev => Math.min(140, Math.max(100, prev + (Math.random() * 2 - 1))));
                setBpDia(prev => Math.min(95, Math.max(60, prev + (Math.random() * 1.5 - 0.75))));
            }, 1000);

            heartbeatInterval = setInterval(() => {
                setPulse(true);
                playHeartbeatBeep();
                setTimeout(() => setPulse(false), 200);
            }, 60000 / hr);
        }

        // Broadcast vitals to the bus for synchronization
        robotEventBus.emit("vitals:update", { hr, spo2, bpSys, bpDia, robotStatus });

        return () => {
            clearInterval(degradeInterval);
            clearInterval(heartbeatInterval);
            stopAlarm();
            stopFlatline();
        };
    }, [robotStatus]);

    // Monitor HR for flatline
    useEffect(() => {
        if (hr === 0) {
            playFlatline();
        }
    }, [hr]);

    const hrColor = hr < 60 ? "text-red-500" : "text-green-400";
    const spo2Color = spo2 < 90 ? "text-red-500" : "text-blue-400";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-sm shadow-md">
            <h3 className="text-slate-500 border-b border-slate-800 pb-2 mb-3 uppercase tracking-wider text-xs">Vital Signs (Patient #489201-A)</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div className={`bg-slate-950 p-3 rounded border border-slate-800 transition-all ${robotStatus === 'FROZEN' ? 'animate-pulse border-red-900/50' : ''}`}>
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
                        <EcgCanvas hr={hr} isFrozen={robotStatus === "FROZEN"} />
                    </div>
                </div>

                {/* SpO2 */}
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-slate-500 text-xs">SpO2 (%)</div>
                    <div className={`text-3xl font-bold ${spo2Color}`}>{Math.round(spo2)}</div>
                    <div className="h-6 w-full mt-2 bg-blue-900/20 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${spo2}%` }}></div>
                    </div>
                </div>

                {/* Blood Pressure */}
                <div className="bg-slate-950 p-3 rounded border border-slate-800 col-span-2 flex justify-between items-center">
                    <div className="text-slate-500 text-xs">NIBP (mmHg)</div>
                    <div className="text-xl text-yellow-500">{Math.round(bpSys)} / {Math.round(bpDia)}</div>
                </div>
            </div>

        </div>
    );
}
