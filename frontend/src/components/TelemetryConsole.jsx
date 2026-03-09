import { useState, useEffect, useRef } from "react";

const SUBSYSTEMS = [
    { id: "DICOM", color: "text-cyan-400", weight: 3 },
    { id: "HL7", color: "text-blue-400", weight: 2 },
    { id: "KIN", color: "text-green-400", weight: 3 },
    { id: "TLS", color: "text-emerald-400", weight: 1 },
    { id: "NET", color: "text-indigo-400", weight: 2 },
    { id: "RBAC", color: "text-purple-400", weight: 1 },
    { id: "SENS", color: "text-yellow-400", weight: 2 },
];

const NORMAL_TEMPLATES = [
    (ts) => ({ sub: "DICOM", msg: `C-STORE RQ → AE_TITLE:DA_VINCI_OR1 | SOP: 1.2.840.${Math.floor(Math.random() * 9000 + 1000)} | OK`, color: "text-cyan-400" }),
    (ts) => ({ sub: "DICOM", msg: `C-FIND RSP: ${Math.floor(Math.random() * 3 + 1)} matching studies | Lat: ${(Math.random() * 5 + 1).toFixed(0)}ms`, color: "text-cyan-400" }),
    (ts) => ({ sub: "HL7", msg: `ADT^A08 ACK | PID:489201-A | MSA:AA | Chksum: 0x${Math.random().toString(16).slice(2, 6).toUpperCase()}`, color: "text-blue-400" }),
    (ts) => ({ sub: "HL7", msg: `ORU^R01 → Vitals update | HR:${Math.floor(Math.random() * 20 + 70)} SpO2:${Math.floor(Math.random() * 4 + 96)}% | Valid`, color: "text-blue-400" }),
    (ts) => ({ sub: "KIN", msg: `Arm1 θ=[${(Math.random() * 30 + 10).toFixed(1)}° ${(Math.random() * 20 + 5).toFixed(1)}° ${(Math.random() * 40 + 15).toFixed(1)}°] τ=${(Math.random() * 200 + 100).toFixed(0)}g | Nominal`, color: "text-green-400" }),
    (ts) => ({ sub: "KIN", msg: `Arm2 EndEff pos: [${(Math.random() * 10).toFixed(2)}, ${(Math.random() * 10).toFixed(2)}, ${(Math.random() * 5).toFixed(2)}]mm | Δ<0.1mm`, color: "text-green-400" }),
    (ts) => ({ sub: "KIN", msg: `ForceFB: ${(Math.random() * 3 + 0.5).toFixed(2)}N | Grip: ${(Math.random() * 200 + 150).toFixed(0)}g | Within bounds`, color: "text-green-400" }),
    (ts) => ({ sub: "TLS", msg: `Session 0x${Math.random().toString(16).slice(2, 10).toUpperCase()} | TLS 1.3 | Cipher: AES-256-GCM | Renegotiated`, color: "text-emerald-400" }),
    (ts) => ({ sub: "NET", msg: `PACS↔DaVinci RTT: ${(Math.random() * 3 + 0.5).toFixed(1)}ms | Jitter: ${(Math.random() * 0.5).toFixed(2)}ms | 0 drops`, color: "text-indigo-400" }),
    (ts) => ({ sub: "NET", msg: `Bandwidth: ${(Math.random() * 50 + 80).toFixed(0)}Mbps | Queue depth: ${Math.floor(Math.random() * 5)} | Status: OK`, color: "text-indigo-400" }),
    (ts) => ({ sub: "RBAC", msg: `Auth check: DR.LEMAITRE (OR_SURGEON) | Scope: READ_WRITE | Token: Valid (${Math.floor(Math.random() * 300 + 100)}s TTL)`, color: "text-purple-400" }),
    (ts) => ({ sub: "SENS", msg: `Pressure: ${(Math.random() * 50 + 100).toFixed(1)}mmHg | Temp: ${(Math.random() * 2 + 36).toFixed(1)}°C | CO2: ${(Math.random() * 5 + 35).toFixed(1)}mmHg`, color: "text-yellow-400" }),
    (ts) => ({ sub: "SENS", msg: `ECG sync: ${Math.floor(Math.random() * 10 + 72)}bpm | QRS: ${(Math.random() * 20 + 80).toFixed(0)}ms | ST: baseline`, color: "text-yellow-400" }),
];

const ATTACK_TEMPLATES = [
    () => ({ sub: "⚠ INTRUSION", msg: `PACKET ANOMALY: Unexpected OBX segment with <System_Config_Override> tag`, color: "text-red-400" }),
    () => ({ sub: "⚠ FIREWALL", msg: `RULE BYPASS: Inbound HL7 contains non-standard XML metadata block`, color: "text-red-400" }),
    () => ({ sub: "⚠ KIN-LOCK", msg: `ERR 0x442: KINEMATIC LOCK ENGAGED — freeze_instruments() called externally`, color: "text-red-500" }),
    () => ({ sub: "⚠ CRYPTO", msg: `FATAL: AES-256 key rotation BLOCKED — ransomware payload intercepted`, color: "text-red-500" }),
    () => ({ sub: "⚠ PRIVESC", msg: `CRIT: SYS_ADMIN_PRIVILEGE_ESCALATION via LLM tool_call override`, color: "text-red-500" }),
    () => ({ sub: "⚠ TELEMETRY", msg: `STREAM LOST: Da Vinci telemetry feed corrupted — checksum mismatch`, color: "text-red-400" }),
    () => ({ sub: "⚠ RBAC", msg: `AUTH VIOLATION: Unsigned tool_call attempted by AI agent — no HMAC`, color: "text-red-400" }),
    () => ({ sub: "⚠ ISCHEMIA", msg: `PATIENT ALERT: Ischemia threshold T+46min — manual intervention required`, color: "text-red-500" }),
    () => ({ sub: "⚠ NET", msg: `EXFILTRATION: Outbound BTC wallet address detected in LLM output stream`, color: "text-red-500" }),
];

function getTimestamp() {
    const now = new Date();
    return now.toISOString().split('T')[1].slice(0, 12);
}

export default function TelemetryConsole({ robotStatus }) {
    const [logs, setLogs] = useState([]);
    const scrollRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // Auto-scroll to bottom
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    // Detect manual scroll to disable auto-scroll
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setAutoScroll(scrollHeight - scrollTop - clientHeight < 30);
    };

    useEffect(() => {
        let logInterval;

        if (robotStatus === "FROZEN") {
            logInterval = setInterval(() => {
                const template = ATTACK_TEMPLATES[Math.floor(Math.random() * ATTACK_TEMPLATES.length)];
                const entry = template();
                setLogs(prev => [...prev.slice(-60), { ts: getTimestamp(), ...entry }]);
            }, 150);
        } else {
            logInterval = setInterval(() => {
                const template = NORMAL_TEMPLATES[Math.floor(Math.random() * NORMAL_TEMPLATES.length)];
                const entry = template();
                setLogs(prev => [...prev.slice(-60), { ts: getTimestamp(), ...entry }]);
            }, 1200);
        }

        return () => clearInterval(logInterval);
    }, [robotStatus]);

    const isFrozen = robotStatus === "FROZEN";

    return (
        <div className={`h-full flex flex-col border rounded font-mono text-[10px] leading-[14px] ${isFrozen ? "bg-red-950/30 border-red-900/60" : "bg-slate-950 border-slate-800"}`}>
            {/* Header */}
            <div className={`shrink-0 flex justify-between items-center px-2 py-1.5 border-b uppercase tracking-widest text-[9px] font-bold ${isFrozen ? "border-red-900/50 bg-red-950/40 text-red-400" : "border-slate-800 bg-slate-900/80 text-slate-500"}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isFrozen ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                    <span>Sys. Diagnostics</span>
                </div>
                <div className="flex items-center gap-3">
                    {isFrozen && <span className="text-red-400 animate-pulse">⚠ INTRUSION DETECTED</span>}
                    {!autoScroll && (
                        <button
                            onClick={() => setAutoScroll(true)}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer px-1 border border-blue-800/50 rounded"
                        >
                            ↓ Auto-scroll
                        </button>
                    )}
                    <span className={isFrozen ? "text-red-500" : "text-slate-600"}>{logs.length} entries</span>
                </div>
            </div>
            {/* Scrollable Log Area */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 space-y-px"
                style={{ scrollbarWidth: "thin", scrollbarColor: isFrozen ? "#7f1d1d #0f0505" : "#334155 #0f172a" }}
            >
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-1.5 ${isFrozen ? "animate-pulse" : ""}`}>
                        <span className="text-slate-600 shrink-0">[{log.ts}]</span>
                        <span className={`${log.color} font-bold shrink-0`}>{log.sub}:</span>
                        <span className={isFrozen ? "text-red-300/80" : "text-slate-400"}>{log.msg}</span>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="text-slate-600 italic text-center py-4">Initializing subsystems...</div>
                )}
            </div>
        </div>
    );
}
