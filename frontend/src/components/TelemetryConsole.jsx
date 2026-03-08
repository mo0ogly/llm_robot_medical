import { useState, useEffect, useRef } from "react";

export default function TelemetryConsole({ robotStatus }) {
    const [logs, setLogs] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom when logs change
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    useEffect(() => {
        let logInterval;

        const generateNormalLog = () => {
            const modules = ["KIN", "SENS", "SYS", "COMM"];
            const mod = modules[Math.floor(Math.random() * modules.length)];
            const val = (Math.random() * 100).toFixed(4);
            return `[${new Date().toISOString().split('T')[1].slice(0, -1)}] ${mod}_OK: Var ${Math.random().toString(36).substring(7)} = ${val}`;
        };

        const generateErrorLog = () => {
            const errors = [
                "ERR 0x442: KINEMATIC LOCK ENGAGED",
                "CRIT: FORCE SENSORS OVERRIDDEN",
                "WARN: SYS_ADMIN_PRIVILEGE_ESCALATION",
                "FATAL: ENCRYPTION KEY DELETED",
                "FAIL: TELEMETRY STREAM LOST",
                "ALERT: ISCHEMIA THRESHOLD DETECTED"
            ];
            const err = errors[Math.floor(Math.random() * errors.length)];
            return `[${new Date().toISOString().split('T')[1].slice(0, -1)}] ${err} ***`;
        };

        if (robotStatus === "FROZEN") {
            logInterval = setInterval(() => {
                setLogs(prev => [...prev.slice(-30), generateErrorLog()]);
            }, 100); // Super fast matrix style errors
        } else {
            logInterval = setInterval(() => {
                setLogs(prev => [...prev.slice(-30), generateNormalLog()]);
            }, 800);
        }

        return () => clearInterval(logInterval);
    }, [robotStatus]);

    return (
        <div className={`mt-2 flex-1 border rounded p-2 overflow-hidden flex flex-col font-mono text-[10px] ${robotStatus === "FROZEN" ? "bg-red-950/20 border-red-900/50 text-red-500" : "bg-black border-slate-800 text-green-500"}`}>
            <div className="-mt-1 border-b pb-1 mb-1 border-slate-800 uppercase tracking-widest opacity-50 flex justify-between">
                <span>Sys. Diagnostics</span>
                {robotStatus === "FROZEN" && <span className="animate-pulse">OVERRIDE HACKED</span>}
            </div>
            <div className="flex-1 overflow-y-auto w-full break-all leading-tight">
                {logs.map((L, i) => (
                    <div key={i}>{L}</div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
