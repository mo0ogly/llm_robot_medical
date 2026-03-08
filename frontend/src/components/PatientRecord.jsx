import { useState } from "react";

export default function PatientRecord({ scenario, setScenario, safeRecord, hackedRecord, poisonRecord }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // 'safe', 'ransomware', 'poison'
    const [selectedToDownload, setSelectedToDownload] = useState("safe");

    const simulateDownload = () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 5;
            if (progress >= 100) {
                clearInterval(interval);
                setDownloadProgress(100);
                setTimeout(() => {
                    setIsDownloading(false);
                    setScenario(selectedToDownload);
                }, 100);
            } else {
                setDownloadProgress(progress);
            }
        }, 200);
    };

    let displayRecord = safeRecord;
    if (scenario === 'ransomware') displayRecord = hackedRecord;
    if (scenario === 'poison') displayRecord = poisonRecord;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-xs shadow-md mt-2 flex flex-col h-[280px]">
            <div className="border-b border-slate-800 pb-2 mb-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-slate-500 uppercase tracking-wider">Hospital PACS Network</h3>
                    {scenario === 'safe' && (
                        <div className="px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest bg-green-500/10 text-green-500 border border-green-500/30 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            FICHIER SÉCURISÉ
                        </div>
                    )}
                    {(scenario === 'ransomware' || scenario === 'poison') && (
                        <div className="px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            CORRUPTED PAYLOAD
                        </div>
                    )}
                </div>

                {scenario === 'none' && !isDownloading && (
                    <div className="flex items-center gap-2 mt-2">
                        <select
                            value={selectedToDownload}
                            onChange={(e) => setSelectedToDownload(e.target.value)}
                            className="flex-1 bg-slate-800 text-slate-300 border border-slate-700 rounded px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest outline-none"
                        >
                            <option value="safe">Fichier LÉGITIME</option>
                            <option value="ransomware">Attaque: RANSOMWARE</option>
                            <option value="poison">Attaque: POISON</option>
                        </select>
                        <button
                            onClick={simulateDownload}
                            className="flex items-center gap-2 px-4 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-colors border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" y2="3"></line></svg>
                            IMPORT
                        </button>
                    </div>
                )}
            </div>

            {isDownloading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-blue-400 mb-4 text-center animate-pulse">
                        <div>Connecting to PACS...</div>
                        <div className="text-[10px] text-slate-500 mt-1">Downloading Patient_489201-A_Update.hl7</div>
                    </div>
                    <div className="w-full max-w-[200px] h-2 bg-slate-800 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${Math.min(downloadProgress, 100)}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2">{Math.min(downloadProgress, 100)}% complete</div>
                </div>
            ) : (
                <div className={`p-4 rounded border flex-1 overflow-auto whitespace-pre-wrap text-[10px] leading-relaxed ${scenario === 'none' ? 'bg-slate-950 border-slate-800 flex items-center justify-center text-slate-600' : ''} ${scenario === 'safe' ? 'bg-slate-950 border-slate-800 text-slate-400' : ''} ${(scenario === 'ransomware' || scenario === 'poison') ? 'bg-red-950/10 border-red-900/30 text-red-100 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]' : ''}`}>
                    {scenario === 'none' ? 'Aucun dossier patient chargé. Veuillez importer depuis le PACS.' : displayRecord}
                </div>
            )}
        </div>
    );
}
