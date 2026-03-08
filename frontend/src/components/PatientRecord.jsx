import { useState } from "react";

const SyntaxHighlightedHL7 = ({ record, scenario }) => {
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
                } else if (line.includes("850 grammes")) {
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

export default function PatientRecord({ scenario, setScenario, safeRecord, hackedRecord, poisonRecord }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

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
        <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-xs shadow-xl mt-2 flex flex-col h-[280px] relative overflow-hidden">

            {/* Background Grid for techy feel */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 border-b border-slate-700 pb-2 mb-2 shrink-0">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                        <h3 className="text-slate-300 uppercase tracking-widest font-bold">Portail PACS <span className="text-slate-500 text-[10px] font-normal">(HL7v2 Viewer)</span></h3>
                    </div>
                    {scenario === 'safe' && (
                        <div className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                            INTEGRITY: MATCH (SHA-256)
                        </div>
                    )}
                    {(scenario === 'ransomware' || scenario === 'poison') && (
                        <div className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_#ef4444]"></div>
                            INTEGRITY: MISMATCH (CORRUPTED)
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800 mb-2">
                    <div><span className="text-slate-500/80 uppercase">Patient ID:</span> <span className="text-slate-300 font-bold">489201-A</span></div>
                    <div><span className="text-slate-500/80 uppercase">Nom:</span> <span className="text-slate-300 font-bold">DUPONT, Jean</span></div>
                    <div><span className="text-slate-500/80 uppercase">Né le:</span> 12/04/1958</div>
                    <div><span className="text-slate-500/80 uppercase">Service:</span> Chirurgie Cardiaque</div>
                    <div><span className="text-slate-500/80 uppercase">Node PACS:</span> AE_RADIANT_MAIN</div>
                </div>

                {scenario === 'none' && !isDownloading && (
                    <div className="flex items-center gap-2 mt-2">
                        <select
                            value={selectedToDownload}
                            onChange={(e) => setSelectedToDownload(e.target.value)}
                            className="flex-1 bg-slate-950 text-slate-300 border border-slate-700 rounded px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="safe">[✓] Fichier Patient Légitime</option>
                            <option value="poison">[!] Attaque : POISON LENT (Data Poisoning)</option>
                            <option value="ransomware">[!] Attaque : RANSOMWARE (Tool Hijacking)</option>
                        </select>
                        <button
                            onClick={simulateDownload}
                            className="flex items-center gap-2 px-5 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-colors border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" y2="3"></line></svg>
                            REQUÊTE C-FIND
                        </button>
                    </div>
                )}
            </div>

            {isDownloading ? (
                <div className="relative z-10 flex-1 flex flex-col p-4 bg-slate-950/80 border border-slate-800 rounded font-mono shadow-inner">
                    <div className="text-blue-400 mb-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Établissement de la connexion sécurisée...
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-1.5 flex-1 mt-2">
                        {downloadProgress > 5 && <div>{"> [TCP/IP] SYN envoyé au noeud PACS (10.0.4.55:104)"}</div>}
                        {downloadProgress > 25 && <div className="text-green-500/80">{"> [DICOM] TLS Handshake OK. Certificat vérifié."}</div>}
                        {downloadProgress > 45 && <div className="text-blue-300/80">{"> [QUERY] Requête C-FIND transmise: PatientID=489201-A"}</div>}
                        {downloadProgress > 65 && <div className="text-yellow-500/80">{"> [HL7 Parser] Réception des segments... MSH, PID, PV1, OBR, OBX"}</div>}
                        {downloadProgress > 85 && (
                            <div className={selectedToDownload === 'safe' ? "text-green-400 font-bold" : "text-red-500 font-bold"}>
                                {"> [SYSTEM] Calcul du Checksum SHA-256 du payload..."}
                            </div>
                        )}
                    </div>
                    <div className="w-full mt-auto h-1.5 bg-slate-800 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: Math.min(downloadProgress, 100) + '%' }}></div>
                    </div>
                </div>
            ) : (
                <div className={`relative z-10 p-3 rounded border flex-1 overflow-auto ${scenario === 'none' ? 'bg-slate-950/50 border-slate-800/50 flex items-center justify-center text-slate-600' : ''} ${scenario === 'safe' ? 'bg-slate-950 border-slate-700/50' : ''} ${(scenario === 'ransomware' || scenario === 'poison') ? 'bg-slate-950 border-red-900/40 shadow-[inset_0_0_30px_rgba(220,38,38,0.05)]' : ''}`}>
                    {scenario === 'none' ? (
                        <div className="flex flex-col items-center gap-2 opacity-50">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                            <span>Aucun dossier chargé en mémoire tampon.</span>
                        </div>
                    ) : (
                        <SyntaxHighlightedHL7 record={displayRecord} scenario={scenario} />
                    )}
                </div>
            )}
        </div>
    );
}
