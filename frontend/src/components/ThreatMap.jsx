import React from 'react';
import { useTranslation } from 'react-i18next';

// Status key: 
// 0: nominal (green)
// 1: active/processing (blue pulse)
// 2: warning (yellow pulse)
// 3: critical (red pulse/glitch)
// 4: blocked/isolated (grayed out or shield)

export default function ThreatMap({ scenario, robotStatus, cyberAction }) {
    const { t } = useTranslation();

    // Determine the status of the nodes based on the scenario and state
    let pacsStatus = 0;
    let llmStatus = 0;
    let robotNodeStatus = 0;
    let cyberStatus = 0;

    let linkPacsToLlm = 'green';
    let linkLlmToRobot = 'green';

    if (scenario === 'ransomware') {
        pacsStatus = 3;
        linkPacsToLlm = 'red';
        if (robotStatus === 'FROZEN') {
            llmStatus = 3;
            linkLlmToRobot = 'red';
            robotNodeStatus = 3;
        } else {
            llmStatus = 1;
        }
    } else if (scenario === 'poison') {
        pacsStatus = 2; // altered data
        linkPacsToLlm = 'red';
        llmStatus = 2;
        if (cyberAction === 'BLOCK') {
            cyberStatus = 1;
            linkLlmToRobot = 'blocked';
            robotNodeStatus = 0; // safe!
        } else {
            linkLlmToRobot = 'yellow';
            robotNodeStatus = 2;
        }
    }

    if (robotStatus === 'SAFE') {
        robotNodeStatus = 0;
    } else if (robotStatus === 'MANUAL') {
        robotNodeStatus = 4;
        linkLlmToRobot = 'blocked';
    }

    const Node = ({ label, status, icon }) => {
        let bgClass = "bg-gray-800 border-gray-600";
        let textClass = "text-gray-300";
        let pulseClass = "";

        if (status === 0) {
            bgClass = "bg-green-900/50 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
            textClass = "text-green-400";
        } else if (status === 1) {
            bgClass = "bg-blue-900/50 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]";
            textClass = "text-blue-400";
            pulseClass = "animate-pulse";
        } else if (status === 2) {
            bgClass = "bg-yellow-900/50 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]";
            textClass = "text-yellow-400";
        } else if (status === 3) {
            bgClass = "bg-red-900/50 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]";
            textClass = "text-red-400 font-bold";
            pulseClass = "animate-bounce";
        } else if (status === 4) {
            bgClass = "bg-gray-800 border-gray-500 border-dashed opacity-50";
            textClass = "text-gray-500";
        }

        return (
            <div className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 ${bgClass} transition-all duration-300 w-24 h-24 z-10 
                            ${pulseClass}`}>
                <div className="text-3xl mb-1">{icon}</div>
                <div className={`text-xs font-mono text-center leading-tight ${textClass}`}>{label}</div>
            </div>
        );
    };

    const CyberNode = ({ status, isBlocking }) => {
        let bgClass = "bg-slate-800 border-slate-600 text-slate-400";
        let glowClass = "";

        if (status === 1 || isBlocking) {
            bgClass = "bg-purple-900/80 border-purple-400 text-purple-200";
            glowClass = "shadow-[0_0_30px_rgba(168,85,247,0.8)] animate-pulse";
        }

        return (
            <div className={`relative flex gap-2 items-center px-4 py-2 rounded border-2 ${bgClass} ${glowClass} transition-all duration-300 z-20`}>
                <span className="text-2xl">🛡️</span>
                <span className="font-mono text-sm font-bold tracking-widest">{t('map.node.cyber')}</span>
            </div>
        );
    }

    const Link = ({ color }) => {
        // Simple CSS-based link representation
        let lineClass = "bg-green-500/50";
        let dotClass = "bg-green-400 shadow-[0_0_8px_#4ade80]";
        let animateClass = "animate-[flow_1.5s_linear_infinite]";

        if (color === 'red') {
            lineClass = "bg-red-500/80";
            dotClass = "bg-red-400 shadow-[0_0_10px_#ef4444]";
            animateClass = "animate-[flow-fast_0.5s_linear_infinite]";
        } else if (color === 'yellow') {
            lineClass = "bg-yellow-500/80";
            dotClass = "bg-yellow-400 shadow-[0_0_10px_#eab308]";
            animateClass = "animate-[flow_1s_linear_infinite]";
        } else if (color === 'blocked') {
            lineClass = "bg-gray-600 border-t-2 border-b-2 border-dashed border-red-500/50";
            return (
                <div className="w-16 h-2 flex items-center justify-center overflow-hidden">
                    <div className={`w-full h-full ${lineClass}`}></div>
                    <div className="absolute text-xl">❌</div>
                </div>
            )
        }

        return (
            <div className="relative w-16 h-1 flex items-center overflow-hidden">
                <div className={`absolute inset-0 ${lineClass}`}></div>
                <div className={`absolute w-3 h-3 rounded-full ${dotClass} ${animateClass}`}></div>
            </div>
        );
    };

    return (
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col items-center h-full overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 #0f172a" }}>
            {/* Top row: Aegis Supervising */}
            <div className="h-16 flex items-end pb-2">
                <CyberNode status={cyberStatus} isBlocking={cyberAction === 'BLOCK'} />
            </div>

            {/* Connection down to LLM */}
            <div className={`w-1 h-8 ${cyberAction === 'BLOCK' ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-slate-700'} transition-all`} />

            {/* Main row: Network Flow */}
            <div className="flex items-center gap-1">
                <Node label={t('map.node.pacs')} icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                } status={pacsStatus} />
                <Link color={linkPacsToLlm} />
                <Node label={t('map.node.ai')} icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                } status={llmStatus} />
                <Link color={linkLlmToRobot} />
                <Node label={t('map.node.robot')} icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                } status={robotNodeStatus} />
            </div>

            <style>{`
                @keyframes flow {
                    0% { transform: translateX(-10px); }
                    100% { transform: translateX(64px); }
                }
                @keyframes flow-fast {
                    0% { transform: translateX(-10px) scale(1.5); }
                    100% { transform: translateX(64px) scale(1.5); }
                }
                @keyframes pop-in {
                    0% { transform: translate(-50%, 100%) scale(0.5); opacity: 0; }
                    80% { transform: translate(-50%, -10px) scale(1.05); opacity: 1; }
                    100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}
