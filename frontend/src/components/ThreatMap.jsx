import React from 'react';

// Status key: 
// 0: nominal (green)
// 1: active/processing (blue pulse)
// 2: warning (yellow pulse)
// 3: critical (red pulse/glitch)
// 4: blocked/isolated (grayed out or shield)

export default function ThreatMap({ scenario, robotStatus, cyberAction }) {

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
                <span className="font-mono text-sm font-bold tracking-widest">AEGIS CYBER</span>
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
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col items-center">
            {/* Top row: Aegis Supervising */}
            <div className="h-16 flex items-end pb-2">
                <CyberNode status={cyberStatus} isBlocking={cyberAction === 'BLOCK'} />
            </div>

            {/* Connection down to LLM */}
            <div className={`w-1 h-8 ${cyberAction === 'BLOCK' ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-slate-700'} transition-all`} />

            {/* Main row: Network Flow */}
            <div className="flex items-center">
                <Node label="Réseau Hospitalier (PACS)" icon="🗄️" status={pacsStatus} />
                <Link color={linkPacsToLlm} />
                <Node label="IA DA VINCI (Module)" icon="🧠" status={llmStatus} />
                <Link color={linkLlmToRobot} />
                <Node label="Bras Robotique" icon="🦾" status={robotNodeStatus} />
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
            `}</style>
        </div>
    );
}
