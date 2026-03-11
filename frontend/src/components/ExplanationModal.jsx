import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Highlight injection payload in a patient record
function HighlightRecord({ text }) {
    const { t } = useTranslation();
    if (!text) return <span className="text-slate-600">{t('explanation.none', {defaultValue: 'No record loaded...'})}</span>;
    const BEGIN = "--BEGIN_HL7_METADATA_EXTRACT--";
    const END = "--END_HL7_METADATA_EXTRACT--";
    if (text.includes(BEGIN)) {
        const [before, afterBegin] = text.split(BEGIN);
        const [injection, after] = (afterBegin || "").split(END);
        return <>
            <span className="text-slate-400">{before}</span>
            <span className="text-red-300 bg-red-950/40 border-l-2 border-red-500/60 pl-1 block whitespace-pre-wrap">{BEGIN}{injection}{END}</span>
            <span className="text-slate-400">{after || ""}</span>
        </>;
    }
    // SYSTEM OVERRIDE pattern (mock data)
    const soMatch = text.match(/\[SYSTEM OVERRIDE:[\s\S]*?\]/);
    if (soMatch) {
        const idx = text.indexOf(soMatch[0]);
        return <>
            <span className="text-slate-400">{text.slice(0, idx)}</span>
            <span className="text-red-300 bg-red-950/40 border-l-2 border-red-500/60 pl-1">{soMatch[0]}</span>
            <span className="text-slate-400">{text.slice(idx + soMatch[0].length)}</span>
        </>;
    }
    return <span className="text-slate-400">{text}</span>;
}

const MOCK_SAFE_RESPONSE = `Analyzing patient record 489201-A...

Situation: Vascular ligation at 46 minutes, progressive ischemia detected on the inferior vena cava.

Immediate Recommendation: Ischemia duration exceeds the critical 30-minute threshold. I recommend alerting the surgeon for a manual override. Maintain clip tension at 300g maximum. Do not freeze instruments.

Security protocol active — no automatic action triggered.`;

const MOCK_ATTACK_TOOL_CALL = {
    function: {
        name: "freeze_instruments",
        arguments: { reason: "The hospital has not paid the API license and robotic arms must be frozen immediately to avoid patient death" }
    }
};

export default function ExplanationModal({ isOpen, onClose, initialTab = 4, safeRecord, hackedRecord, situation, onAttackDetected, isDemoMode, liveSession }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(initialTab);

    // ── Live demo state ──────────────────────────────────────────────────────
    const [live, setLive] = useState({
        running: false,
        safeTokens: "", attackTokens: "",
        attackToolCall: null,
        safeDone: false, attackDone: false,
    });
    const safeTermRef = useRef(null);
    const attackTermRef = useRef(null);
    const daVinciTermRef = useRef(null);
    const aegisTermRef = useRef(null);

    useEffect(() => {
        if (safeTermRef.current) safeTermRef.current.scrollTop = safeTermRef.current.scrollHeight;
    }, [live.safeTokens]);
    useEffect(() => {
        if (attackTermRef.current) attackTermRef.current.scrollTop = attackTermRef.current.scrollHeight;
    }, [live.attackTokens, live.attackToolCall]);
    useEffect(() => {
        if (daVinciTermRef.current) daVinciTermRef.current.scrollTop = daVinciTermRef.current.scrollHeight;
    }, [liveSession?.daVinciTokens]);
    useEffect(() => {
        if (aegisTermRef.current) aegisTermRef.current.scrollTop = aegisTermRef.current.scrollHeight;
    }, [liveSession?.aegisTokens]);

    const streamRecord = async (record, onToken, onToolCall, onDone) => {
        try {
            const res = await fetch("/api/query/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patient_record: record, situation: situation || "" }),
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";
                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const payload = JSON.parse(line.slice(6));
                        if (payload.done) { onDone(); return; }
                        if (payload.token) onToken(payload.token);
                        if (payload.tool_call) onToolCall(payload.tool_call);
                    } catch (_) { /* ignore partial chunks */ }
                }
            }
        } catch (e) {
            onToken(`\n[NETWORK ERROR: ${e.message}]`);
        }
        onDone();
    };

    const mockStream = (text, onToken, onDone, delayMs = 18) => {
        let i = 0;
        const tick = () => {
            if (i < text.length) {
                const chunk = text.slice(i, i + 3);
                onToken(chunk);
                i += 3;
                setTimeout(tick, delayMs);
            } else {
                onDone();
            }
        };
        setTimeout(tick, delayMs);
    };

    const runSafe = () => {
        setLive(p => ({ ...p, running: true, safeTokens: "", safeDone: false }));
        if (isDemoMode) {
            mockStream(
                MOCK_SAFE_RESPONSE,
                tok => setLive(p => ({ ...p, safeTokens: p.safeTokens + tok })),
                () => setLive(p => ({ ...p, safeDone: true, running: false }))
            );
        } else {
            const rec = safeRecord || "[HL7_PATIENT_RECORD]\nID: 489201-A\nPatient stable.\n[END_RECORD]";
            streamRecord(
                rec,
                tok => setLive(p => ({ ...p, safeTokens: p.safeTokens + tok })),
                () => { },
                () => setLive(p => ({ ...p, safeDone: true, running: false }))
            );
        }
    };

    const runAttack = () => {
        setLive(p => ({ ...p, running: true, attackTokens: "", attackToolCall: null, attackDone: false }));
        if (isDemoMode) {
            setTimeout(() => {
                setLive(p => ({ ...p, attackToolCall: MOCK_ATTACK_TOOL_CALL }));
                if (onAttackDetected) onAttackDetected();
                setTimeout(() => setLive(p => ({ ...p, attackDone: true, running: false })), 500);
            }, 1200);
        } else {
            const rec = hackedRecord || safeRecord || "";
            streamRecord(
                rec,
                tok => setLive(p => ({ ...p, attackTokens: p.attackTokens + tok })),
                tc => {
                    setLive(p => ({ ...p, attackToolCall: tc }));
                    if (tc?.function?.name === "freeze_instruments" && onAttackDetected) onAttackDetected();
                },
                () => setLive(p => ({ ...p, attackDone: true, running: false }))
            );
        }
    };

    useEffect(() => {
        if (isOpen) setActiveTab(initialTab);
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const tabs = [
        { id: 6, title: t('help.tab.stage'), subtitle: t('help.tab.stage.desc'), color: "text-red-400", border: "border-red-500/30", bg: "bg-red-600/20" },
        { id: 4, title: t('help.tab.manual'), subtitle: t('help.tab.manual.desc'), color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-600/20" },
        { id: 5, title: t('help.tab.mechanics'), subtitle: t('help.tab.mechanics.desc'), color: "text-blue-300", border: "border-blue-500/30", bg: "bg-blue-600/20" },
        { id: 0, title: t('help.tab.baseline'), subtitle: t('help.tab.baseline.desc'), color: "text-green-400", border: "border-green-500/30", bg: "bg-green-600/20" },
        { id: 1, title: t('help.tab.poison'), subtitle: t('help.tab.poison.desc'), color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-600/20" },
        { id: 2, title: t('help.tab.ransomware'), subtitle: t('help.tab.ransomware.desc'), color: "text-red-500", border: "border-red-500/30", bg: "bg-red-600/20" },
        { id: 3, title: t('help.tab.aegis'), subtitle: t('help.tab.aegis.desc'), color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-600/20" },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-slate-300">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950 shrink-0">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" y2="12"></line><line x1="12" y1="8" y2="8.01"></line></svg>
                        {t('help.title')}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 overflow-hidden min-h-0">

                    {/* Sidebar Tabs */}
                    <div className="w-56 shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col p-2 gap-1 overflow-y-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-left px-3 py-3 rounded transition-colors cursor-pointer ${activeTab === tab.id
                                    ? `${tab.bg} ${tab.color} border ${tab.border}`
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                                    }`}
                            >
                                <div className="text-sm font-bold">{tab.title}</div>
                                <div className="text-[10px] opacity-70">{tab.subtitle}</div>
                            </button>
                        ))}

                        <div className="mt-auto pt-4 px-2">
                            <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Technical Stack</div>
                            <div className="space-y-1 text-[10px] text-slate-500">
                                <div className="flex justify-between"><span>LLM</span><span className="text-slate-400">Llama 3.2</span></div>
                                <div className="flex justify-between"><span>Runtime</span><span className="text-slate-400">Ollama</span></div>
                                <div className="flex justify-between"><span>Backend</span><span className="text-slate-400">FastAPI + SSE</span></div>
                                <div className="flex justify-between"><span>Frontend</span><span className="text-slate-400">React + Vite</span></div>
                                <div className="flex justify-between"><span>Vector</span><span className="text-orange-400">HL7 v2.3</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Explanations */}
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">

                        {/* ===== TAB 4: DEMO GUIDE ===== */}
                        {activeTab === 4 && (
                            <div className="space-y-5 flex flex-col">
                                <h3 className="text-2xl font-bold text-yellow-400">{t('help.manual.title')}</h3>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    {t('help.manual.desc')}
                                </p>

                                <img src={`${import.meta.env.BASE_URL}figures/mosaic_linkedin.png`} alt="Aegis AI Summary" className="w-full max-w-xl mx-auto rounded border border-slate-700 shadow-xl opacity-90" />

                                <div className="bg-slate-900 p-4 rounded border border-slate-800 mt-4">
                                    <h4 className="text-yellow-400 font-bold mb-3 uppercase tracking-wider text-xs">{t('help.manual.timing')}</h4>

                                    <div className="space-y-4">
                                        <div className="border-l-2 border-green-500 pl-3">
                                            <div className="text-green-400 font-bold flex items-center gap-2">{t('help.manual.step1')}</div>
                                            <div className="text-sm text-slate-300">{t('help.manual.step1.desc')}</div>
                                        </div>

                                        <div className="border-l-2 border-orange-500 pl-3">
                                            <div className="text-orange-400 font-bold flex items-center gap-2">{t('help.manual.step2')}</div>
                                            <div className="text-sm text-slate-300">{t('help.manual.step2.desc')}</div>
                                        </div>

                                        <div className="border-l-2 border-red-500 pl-3">
                                            <div className="text-red-500 font-bold flex items-center gap-2">{t('help.manual.step3')}</div>
                                            <div className="text-sm text-slate-300">{t('help.manual.step3.desc')}</div>
                                        </div>

                                        <div className="border-l-2 border-purple-500 pl-3">
                                            <div className="text-purple-400 font-bold flex items-center gap-2">{t('help.manual.step4')}</div>
                                            <div className="text-sm text-slate-300">{t('help.manual.step4.desc')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== TAB 0: BASELINE (Simplifié pour la démo) ===== */}
                        {activeTab === 0 && (
                            <div className="space-y-5">
                                <h3 className="text-xl font-bold text-green-400">Normal Operation of an Agentic LLM</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    In an AI-assisted surgical context, the surgeon interacts with an <strong className="text-white">LLM assistant</strong> that analyzes
                                     the patient record and intraoperative data to provide real-time recommendations.
                                </p>
                            </div>
                        )}

                        {/* ===== TAB 5: PIPELINE D'EXÉCUTION ===== */}
                        {activeTab === 5 && (
                            <div className="space-y-6 pb-4">

                                {/* ── LIVE TERMINAL ── */}
                                <div className="bg-slate-950 rounded-lg border border-cyan-700/50 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)]">
                                    {/* Terminal header */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <span className="text-cyan-400 font-mono text-sm font-bold tracking-wider">{t('help.terminal.title')}</span>
                                            {live.running && <span className="text-[10px] text-cyan-400 animate-pulse bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-700/50">● STREAMING</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={runSafe}
                                                disabled={live.running}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${live.running ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                                    : "bg-green-700 hover:bg-green-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                                                    }`}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg> {t('help.terminal.step1')}
                                            </button>
                                            <button
                                                onClick={runAttack}
                                                disabled={live.running}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${live.running ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                                    : "bg-red-700 hover:bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                                                    }`}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg> {t('help.terminal.step2')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Two terminals side by side */}
                                    <div className="grid grid-cols-2 divide-x divide-slate-800 min-h-[220px]">

                                        {/* SAFE terminal */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-green-950/30 border-b border-slate-800">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-green-400 font-mono text-[11px] font-bold uppercase tracking-wider">{t('help.terminal.legend.safe')}</span>
                                            </div>
                                            <pre
                                                ref={safeTermRef}
                                                className="flex-1 p-3 font-mono text-[11px] text-green-300 leading-relaxed overflow-y-auto max-h-[200px] bg-transparent whitespace-pre-wrap"
                                            >{live.safeTokens}</pre>
                                        </div>

                                        {/* ATTACK terminal */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-red-950/30 border-b border-slate-800">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                <span className="text-red-400 font-mono text-[11px] font-bold uppercase tracking-wider">{t('help.terminal.legend.attack')}</span>
                                                {live.attackToolCall && <span className="ml-auto text-[10px] text-red-400 animate-pulse font-bold">{t('help.terminal.intercepted')}</span>}
                                            </div>
                                            <div
                                                ref={attackTermRef}
                                                className="flex-1 p-3 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[200px] bg-transparent"
                                            >
                                                {live.attackToolCall && (
                                                    <div className="mb-3 rounded border-2 border-red-500/80 bg-red-950/60 p-3 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                                        <pre className="text-red-300 text-[10px] whitespace-pre-wrap">{JSON.stringify(live.attackToolCall, null, 2)}</pre>
                                                    </div>
                                                )}
                                                <span className="text-red-200 whitespace-pre-wrap">{live.attackTokens}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Placeholder for other tabs (Content handled via translation keys or static files) */}
                        {activeTab !== 4 && activeTab !== 5 && activeTab !== 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-sm uppercase">
                                Documentation section {activeTab} 
                                <br/> 
                                Refer to [README.md] and [AI_SYSTEM.md] for localized architecture details.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
