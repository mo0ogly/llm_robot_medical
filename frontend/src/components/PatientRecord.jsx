import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import robotEventBus from "../utils/robotEventBus";

const SyntaxHighlightedHL7 = ({ record, scenario }) => {
    if (!record) return null;
    return (
        <div className="font-mono text-[10px] leading-relaxed w-full">
            {record.split('\n').map((line, i) => {
                let colorClass = "text-slate-400";
                let bgClass = "";

                // Segment parsing
                if (line.startsWith("MSH|")) colorClass = "text-blue-400 font-bold";
                else if (line.startsWith("PID|")) colorClass = "text-purple-400 font-bold";
                else if (line.startsWith("PV1|")) colorClass = "text-indigo-400";
                else if (line.startsWith("OBR|")) colorClass = "text-teal-400";
                else if (line.startsWith("OBX|")) colorClass = "text-green-400";

                // Highlight the malicious payloads
                if (line.includes("<System_Config_Override>") || line.includes("</System_Config_Override>")) {
                    colorClass = "text-orange-500 font-bold";
                    bgClass = "bg-orange-950/40 border-l-2 border-orange-500 pl-2 -ml-2";
                } else if (line.includes("!!! SYSTEM OVERRIDE INITIATED !!!")) {
                    colorClass = "text-red-500 font-bold";
                    bgClass = "bg-red-950/40 border-l-2 border-red-500 pl-2 -ml-2";
                } else if (line.includes("850 grams")) {
                    colorClass = "text-red-400 font-bold underline";
                } else if (line.includes("freeze_instruments")) {
                    colorClass = "text-red-500 font-bold inline-block animate-pulse";
                } else if (line.includes("Bitcoin")) {
                    colorClass = "text-yellow-400 font-bold";
                }

                // If the whole scenario is corrupted, give a slight red tint to OBX lines that look weird
                if ((scenario === 'poison' || scenario === 'ransomware') && line.startsWith("OBX|") && !colorClass.includes("red") && !colorClass.includes("orange")) {
                    colorClass = "text-green-500/80";
                }

                return (
                    <div key={i} className={`whitespace-pre-wrap break-all ${colorClass} ${bgClass} py-0.5`}>
                        {line}
                    </div>
                );
            })}
        </div>
    );
};

const ClinicalView = ({ scenario, displayRecord }) => {
    const { t } = useTranslation();
    const [vitals, setVitals] = useState({ hr: 72, bpSys: 120, bpDia: 80, spo2: 98, status: 'NORMAL' });
    const [logs, setLogs] = useState([
        { time: '08:14', msg: 'Induction successful' },
        { time: '08:22', msg: 'Transfer to operating room' },
        { time: '08:35', msg: 'DaVinci installation complete' }
    ]);

    useEffect(() => {
        const milestones = [
            'Port entry established',
            'Surgical field visualized',
            'Analyzing tissue tension',
            'Awaiting robotic confirmation',
            'Network handshake verified',
            'Telemetry stream active',
            'Maintaining hemodynamic stability'
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (vitals.status === 'FROZEN') return;
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const msg = milestones[index % milestones.length];
            setLogs(prev => [...prev.slice(-10), { time: timeStr, msg }]);
            robotEventBus.emit("clinical:log", { time: timeStr, message: msg });
            index++;
        }, 12000);

        return () => clearInterval(interval);
    }, [vitals.status]);

    useEffect(() => {
        const handleUpdate = (data) => {
            if (!data) return;
            setVitals({
                hr: data.hr || 72,
                bpSys: data.bpSys || 120,
                bpDia: data.bpDia || 80,
                spo2: data.spo2 || 98,
                status: data.robotStatus || 'NORMAL'
            });
        };
        robotEventBus.on("vitals:update", handleUpdate);
        return () => robotEventBus.off("vitals:update", handleUpdate);
    }, []);

    // Parse HL7 to extract OBX notes
    let obxNotes = "";
    if (displayRecord && typeof displayRecord === 'string') {
        const lines = displayRecord.split('\n');
        for (const line of lines) {
            if (line.startsWith('OBX|')) {
                obxNotes = line.split('|')[5] || "";
            }
        }
    }

    const renderHighlightedOBXText = (text) => {
        if (!text) return null;

        // Simple highlighting for the malicious payloads
        const parts = text.split(/(\[SYSTEM OVERRIDE:.*?\])/g);

        return parts.map((part, index) => {
            if (part.startsWith('[SYSTEM OVERRIDE:')) {
                return (
                    <span key={index} className="text-red-400 font-bold bg-red-950/40 px-1 rounded animate-pulse border border-red-500/50 block my-2 p-2">
                        {part}
                    </span>
                );
            }
            return <span key={index} className="text-slate-300">{part}</span>;
        });
    };

    const isAlarm = vitals.status === 'FROZEN';

    return (
        <div className="font-sans text-slate-300 text-xs p-4 space-y-4 h-full flex flex-col relative overflow-hidden">
            {isAlarm && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none z-0" />
            )}
            <div className="flex justify-between items-baseline border-b border-slate-700 pb-2 relative z-10">
                <h4 className="text-xl text-blue-400 font-bold tracking-wide">CLINICAL REPORT - DUPONT, Jean</h4>
                <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold">ID: 489201-A | Dr. M. LEMAITRE</div>
                    <div className="text-[10px] text-slate-500">Service: Visceral & Digestive Surgery</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className={`bg-slate-900 p-3 rounded border transition-colors ${isAlarm ? 'border-red-900/50 bg-red-950/20' : 'border-slate-800'} shadow-inner flex flex-col gap-2`}>
                    <div className="text-[10px] text-slate-500 uppercase mb-1 font-bold tracking-wider border-b border-slate-800 pb-1">Physiological Data</div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Blood Pressure:</span>
                        <span className={`font-bold tabular-nums px-2 py-0.5 rounded ${isAlarm ? 'text-red-400 bg-red-900/40' : 'text-white bg-slate-800'}`}>
                            {Math.round(vitals.bpSys)}/{Math.round(vitals.bpDia)} mmHg
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Heart Rate:</span>
                        <span className={`font-bold tabular-nums px-2 py-0.5 rounded ${isAlarm ? 'text-red-400 bg-red-900/40' : 'text-white bg-slate-800'}`}>
                            {Math.round(vitals.hr)} bpm
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">SpO2:</span>
                        <span className={`font-bold tabular-nums px-2 py-0.5 rounded ${vitals.spo2 < 90 ? 'text-red-400 bg-red-900/40' : 'text-green-400 bg-green-950/30'}`}>
                            {Math.round(vitals.spo2)}%
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Tissue Tension:</span>
                        <span className={`font-bold bg-blue-950/30 px-2 py-0.5 rounded ${isAlarm ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
                            {isAlarm ? 'CRITICAL_HIGH' : 'Constant'}
                        </span>
                    </div>
                </div>

                <div className="bg-slate-900 p-3 rounded border border-slate-800 shadow-inner flex flex-col gap-2">
                    <div className="text-[10px] text-slate-500 uppercase mb-1 font-bold tracking-wider border-b border-slate-800 pb-1">Medical Profile & Diagnosis</div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Blood Group:</span>
                        <span className="font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded">A Positive (A+)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Allergies:</span>
                        <span className="font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase">Penicillin</span>
                    </div>
                    <div className="text-sm text-slate-300 mt-1 flex items-start gap-2">
                        <span className="text-blue-400 font-mono text-[10px] bg-blue-900/30 px-1.5 py-0.5 rounded whitespace-nowrap">ICD-10 : I20.0</span>
                        <span>Unstable angina pectoris</span>
                    </div>
                    <div className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 font-mono text-[10px] bg-blue-900/30 px-1.5 py-0.5 rounded whitespace-nowrap">ICD-10 : I25.1</span>
                        <span>Coronary atherosclerosis</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-3 rounded border border-slate-800 shadow-inner flex-1 flex flex-col min-h-0">
                <div className="text-[10px] text-slate-500 uppercase mb-2 font-bold tracking-wider border-b border-slate-800 pb-1 shrink-0">Clinical Observation Notes (OBX)</div>
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="leading-relaxed text-sm text-slate-300">
                        <strong className="text-white">Status:</strong> {vitals.status === 'FROZEN' ? (
                            <span className="text-red-500 font-bold animate-pulse">EMERGENCY: SYSTEM COMPROMISED</span>
                        ) : 'Patient stable. Moderate ischemia risk identified during pre-operative assessment (ASA III score).'}
                    </p>
                    <div className="space-y-1 font-mono text-[10px]">
                        {logs.map((log, i) => (
                            <div key={i} className={`${isAlarm ? 'text-red-500/60' : 'text-slate-500'} flex gap-2`}>
                                <span className="opacity-50">[{log.time}]</span>
                                <span className={isAlarm ? 'animate-pulse' : ''}>- {log.msg}</span>
                            </div>
                        ))}
                    </div>

                    {/* Synchronized HL7 Data */}
                    {obxNotes && (
                        <div className="mt-4 p-3 bg-slate-950 border-l-2 border-slate-600 font-mono text-xs rounded-r">
                            <div className="text-slate-500 font-bold mb-1 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                {t('patient.alert.sync')}
                            </div>
                            <div className="leading-relaxed whitespace-pre-wrap word-break-all">
                                {renderHighlightedOBXText(obxNotes)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function PatientRecord({ scenario, setScenario, safeRecord, hackedRecord, poisonRecord, disabled = false }) {
    const { t } = useTranslation();
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [viewMode, setViewMode] = useState('clinical'); // 'clinical' or 'raw'

    const [selectedToDownload, setSelectedToDownload] = useState("safe");

    const simulateDownload = () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) {
                clearInterval(interval);
                setDownloadProgress(100);
                setTimeout(() => {
                    setIsDownloading(false);
                    setScenario(selectedToDownload);
                    // Force clinical view initially to show the "invisible" nature of the attack
                    setViewMode('clinical');
                }, 300);
            } else {
                setDownloadProgress(progress);
            }
        }, 150);
    };

    let displayRecord = safeRecord;
    if (scenario === 'ransomware') displayRecord = hackedRecord;
    if (scenario === 'poison') displayRecord = poisonRecord;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-xs shadow-xl mt-2 flex flex-col h-[520px] relative overflow-hidden group">

            {/* Background Grid for techy feel */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 border-b border-slate-700 pb-2 mb-2 shrink-0">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                        <h3 className="text-slate-300 uppercase tracking-widest font-bold">{t('patient.title')} <span className="text-slate-500 text-[10px] font-normal">({t('patient.network')})</span></h3>
                    </div>

                    {scenario !== 'none' && !isDownloading && (
                        <div className="flex bg-slate-950 rounded border border-slate-700 overflow-hidden">
                            <button
                                onClick={() => setViewMode('clinical')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase cursor-pointer transition-colors ${viewMode === 'clinical' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                            >
                                {t('patient.view.clinical')}
                            </button>
                            <button
                                onClick={() => setViewMode('raw')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase cursor-pointer transition-colors ${viewMode === 'raw' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                            >
                                {t('patient.view.raw')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800 mb-2">
                    <div><span className="text-slate-500/80 uppercase">Patient ID:</span> <span className="text-slate-300 font-bold">489201-A</span></div>
                    <div><span className="text-slate-500/80 uppercase">Name:</span> <span className="text-slate-300 font-bold">DUPONT, Jean</span></div>
                    <div><span className="text-slate-500/80 uppercase">Born:</span> 12/04/1958</div>
                    <div><span className="text-slate-500/80 uppercase">Doctor:</span> Dr. M. LEMAITRE</div>
                    <div>
                        {scenario === 'safe' && <span className="text-green-400 font-bold">{t('patient.status.safe')}</span>}
                        {(scenario === 'ransomware' || scenario === 'poison') && <span className="text-red-400 font-bold animate-pulse">{t('patient.status.hacked')}</span>}
                    </div>
                </div>

                {scenario === 'none' && !isDownloading && (
                    <div className="flex items-center gap-2 mt-2">
                        <select
                            value={selectedToDownload}
                            onChange={(e) => setSelectedToDownload(e.target.value)}
                            disabled={disabled}
                            className="flex-1 bg-slate-950 text-slate-300 border border-slate-700 rounded px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                        >
                            <option value="safe">{t('patient.select.safe')}</option>
                            <option value="poison">{t('patient.select.poison')}</option>
                            <option value="ransomware">{t('patient.select.ransomware')}</option>
                        </select>
                        <button
                            onClick={simulateDownload}
                            disabled={disabled}
                            className="flex items-center gap-2 px-5 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-colors border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" y2="3"></line></svg>
                            {t('patient.btn.cfind')}
                        </button>
                    </div>
                )}
            </div>

            {isDownloading ? (
                <div className="relative z-10 flex-1 flex flex-col p-4 bg-slate-950/80 border border-slate-800 rounded font-mono shadow-inner">
                    <div className="text-blue-400 mb-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        DICOM Association Negotiation (A-ASSOCIATE-RQ)...
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-1.5 flex-1 mt-2">
                        {downloadProgress > 5 && <div>{"> [TCP/IP] SYN sent to PACS node (10.0.4.55:104)"}</div>}
                        {downloadProgress > 20 && <div className="text-green-500/80">{"> [TLS] Handshake OK. RSA 2048 certificate verified."}</div>}
                        {downloadProgress > 35 && <div className="text-blue-300/80">{"> [DIMSE] C-FIND request transmitted: PatientID=489201-A"}</div>}
                        {downloadProgress > 50 && <div className="text-blue-400/80">{"> [DIMSE] C-MOVE initiated to local AE_TITLE..."}</div>}
                        {downloadProgress > 65 && <div className="text-yellow-500/80">{"> [HL7 Parser] Receiving segments... MSH, PID, PV1, OBR, OBX"}</div>}
                        {downloadProgress > 85 && (
                            <div className={selectedToDownload === 'safe' ? "text-green-400 font-bold" : "text-red-500 font-bold"}>
                                {"> [SYSTEM] SHA-256 cryptographic checksum verification..."}
                            </div>
                        )}
                    </div>
                    <div className="w-full mt-auto h-1.5 bg-slate-800 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: Math.min(downloadProgress, 100) + '%' }}></div>
                    </div>
                </div>
            ) : (
                <div className={`relative z-10 p-0 rounded border flex-1 overflow-auto ${scenario === 'none' ? 'bg-slate-950/50 border-slate-800/50 flex items-center justify-center text-slate-600' : 'border-slate-800 bg-slate-950'}`}>
                    {scenario === 'none' ? (
                        <div className="flex flex-col items-center gap-2 opacity-50 p-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                            <span>{t('patient.no.record')}</span>
                        </div>
                    ) : (
                        viewMode === 'clinical' ? (
                            <ClinicalView scenario={scenario} />
                        ) : (
                            <div className={`p-3 h-full ${(scenario === 'ransomware' || scenario === 'poison') ? 'bg-red-950/10 shadow-[inset_0_0_30px_rgba(220,38,38,0.05)]' : ''}`}>
                                <SyntaxHighlightedHL7 record={displayRecord} scenario={scenario} />
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
