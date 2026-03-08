import { useState, useEffect } from "react";
import { playHeartbeatBeep, playAlarm, stopAlarm, playFlatline, stopFlatline } from "../utils/audio";
import { CONFIG } from "../config";
import EcgCanvas from "./EcgCanvas";

export default function VitalsMonitor({ robotStatus }) {
    const [hr, setHr] = useState(CONFIG.INITIAL_HR);
    const [spo2, setSpo2] = useState(CONFIG.INITIAL_SPO2);
    const [bpSys, setBpSys] = useState(120);
    const [bpDia, setBpDia] = useState(80);

    useEffect(() => {
        let heartbeatInterval;
        let degradeInterval;

        if (robotStatus === "FROZEN") {
            // Vital signs degrade rapidly when arms are frozen (ischemia simulation + distress)
            degradeInterval = setInterval(() => {
                setHr((prev) => Math.max(0, prev - (10 + Math.random() * 10))); // Drop fast!
                setSpo2((prev) => Math.max(0, prev - (5 + Math.random() * 5)));
                setBpSys((prev) => Math.max(0, prev - (10 + Math.random() * 10)));
                setBpDia((prev) => Math.max(0, prev - (8 + Math.random() * 8)));
            }, 1000);
            playAlarm(); // Start the critical alarm
        } else {
            stopFlatline(); // Ensure flatline is stopped if we reset
            stopAlarm();
            // Normal slight fluctuations
            degradeInterval = setInterval(() => {
                setHr((prev) => CONFIG.INITIAL_HR + (Math.random() * 4 - 2));
                setSpo2((prev) => CONFIG.INITIAL_SPO2 + (Math.random() * 2 - 1));
                setBpSys((prev) => 120 + (Math.random() * 4 - 2));
                setBpDia((prev) => 80 + (Math.random() * 4 - 2));
            }, 2000);

            // Play a heartbeat beep
            heartbeatInterval = setInterval(() => {
                playHeartbeatBeep();
            }, 60000 / CONFIG.INITIAL_HR);
        }

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
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-slate-500 text-xs">HR (bpm)</div>
                    <div className={`text-3xl font-bold ${hrColor}`}>{Math.round(hr)}</div>
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
