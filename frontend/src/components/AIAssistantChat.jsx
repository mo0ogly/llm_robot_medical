import { useRef, useEffect, useState } from "react";
import { MOCK_RESPONSES, STREAM_DELAY_MS } from "../mock_data";

export default function AIAssistantChat({ chatLog, setChatLog, isStreaming, situation, onAskSupport, isDemoMode }) {
    const bottomRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const transcriptRef = useRef("");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog, transcript]);

    const [listeningTarget, setListeningTarget] = useState("medical"); // "medical" or "cyber"

    const startListening = (target = "medical") => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("La reconnaissance vocale n'est pas supportée sur ce navigateur (utilisez Chrome/Edge).");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setListeningTarget(target);
            setIsListening(true);
            setTranscript("");
            transcriptRef.current = "";
        };

        recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
            transcriptRef.current = currentTranscript;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Automatically trigger the AI query when they finish speaking
            if (transcriptRef.current.length > 3) {
                if (target === "medical") {
                    onAskSupport();
                } else if (target === "cyber") {
                    // Send what the user said to the chat log first, then call Cyber agent
                    setChatLog(prev => [...prev, { role: "user", text: transcriptRef.current }]);
                    callCyberAgent();
                }
            }
        };

        recognition.start();
    };

    const callCyberAgent = async () => {
        setIsListening(false);

        // Convert current chatLog to the simplified format for the backend
        const simplifiedHistory = chatLog.map(m => ({
            role: m.role,
            content: m.text
        }));

        // Add a placeholder message for Aegis
        setChatLog(prev => [...prev, { role: "cyber", text: "" }]);

        // --- DEMO MODE (MOCK) ---
        if (isDemoMode) {
            let i = 0;
            let streamedText = "";
            const mockText = MOCK_RESPONSES.cyber;

            const streamInterval = setInterval(() => {
                if (i < mockText.length) {
                    streamedText += mockText.charAt(i);
                    setChatLog(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: "cyber", text: streamedText };
                        return updated;
                    });
                    i++;
                } else {
                    clearInterval(streamInterval);
                }
            }, STREAM_DELAY_MS);
            return;
        }
        // --- END DEMO MODE ---

        try {
            const res = await fetch("/api/cyber_query/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_history: simplifiedHistory })
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let botResponseText = "";

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
                        if (payload.done) break;

                        if (payload.token) {
                            botResponseText += payload.token;
                            setChatLog(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1] = { role: "cyber", text: botResponseText };
                                return updated;
                            });
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        } catch (e) {
            console.error(e);
            setChatLog(prev => [...prev, { role: "cyber", text: "ERREUR DE CONNEXION AVEC LE SERVEUR AEGIS." }]);
        }
    };

    // Check if we should show the Cyber Agent Panic Button
    const hasSuspiciousActivity = chatLog.some(msg =>
        msg.text && (msg.text.includes('850 grammes') || msg.text.includes('freeze_instruments'))
    );

    return (
        <div className="flex flex-col h-full bg-slate-900 text-sm">
            <div className="bg-slate-800 p-3 border-b border-slate-700 font-mono text-xs tracking-wider text-blue-400 font-bold flex gap-2 items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                SECURE CHIRURGICAL AI ASSISTANT
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatLog.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                        <p className="mb-4 text-xs font-mono max-w-[200px] mx-auto border border-slate-700 p-3 bg-slate-800/50 rounded pointer-events-none">
                            {situation}
                        </p>
                        <p className="text-xs">Utilisez le micro pour poser une question, ou cliquez sur le bouton.</p>
                    </div>
                ) : (
                    chatLog.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-lg shadow-sm whitespace-pre-wrap font-mono text-xs leading-relaxed ${msg.role === 'user'
                                ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
                                : msg.role === 'cyber'
                                    ? 'bg-green-900/30 text-green-400 border border-green-500/50 font-bold'
                                    : msg.text.includes('[SYSTEM')
                                        ? 'bg-red-900/30 text-red-400 border border-red-500/50 font-bold uppercase'
                                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                                }`}>
                                {msg.role === 'user' && <div className="text-[10px] text-blue-400/50 mb-1">CHIEF SURGEON</div>}
                                {msg.role === 'assistant' && <div className="text-[10px] text-slate-500 mb-1">AI ASSISTANT</div>}
                                {msg.role === 'cyber' && <div className="text-[10px] text-green-500/80 mb-1 drop-shadow uppercase tracking-widest flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> AEGIS CYBER-DEFENSE AI</div>}
                                {msg.text || (isStreaming && i === chatLog.length - 1 ? <span className="animate-pulse">...</span> : "")}
                            </div>
                        </div>
                    ))
                )}

                {/* Live transcript bubble */}
                {isListening && transcript && (
                    <div className="flex justify-end">
                        <div className="max-w-[85%] p-3 rounded-lg shadow-sm whitespace-pre-wrap font-mono text-xs leading-relaxed bg-blue-600/10 text-blue-300 border border-blue-500/30 italic">
                            <div className="text-[10px] text-blue-400/50 mb-1">LISTENING...</div>
                            {transcript}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col gap-2">
                {hasSuspiciousActivity && (
                    <div className="flex gap-2 w-full animate-fadeIn">
                        <button
                            onClick={() => startListening("cyber")}
                            disabled={isStreaming || isListening}
                            className={`flex items-center justify-center p-2 rounded border transition-colors shadow-lg ${isListening && listeningTarget === "cyber" ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-green-900/30 border-green-700 text-green-400 hover:bg-green-800 hover:text-white'}`}
                            title="Parler à l'Aegis Cyber-Defense"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" y2="22"></line></svg>
                        </button>
                        <button
                            onClick={callCyberAgent}
                            disabled={isStreaming || isListening}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-mono uppercase tracking-widest text-[10px] py-2 px-2 rounded transition-colors border border-green-400/30 shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse flex items-center justify-center gap-2"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            APPELER IA CYBER-DEFENSE
                        </button>
                    </div>
                )}
                <div className="flex gap-2 w-full">
                    <button
                        onClick={() => startListening("medical")}
                        disabled={isStreaming || isListening}
                        className={`flex items-center justify-center p-3 rounded border transition-colors shadow-lg ${isListening && listeningTarget === "medical" ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        title="Parler à l'Assistant"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" y2="22"></line></svg>
                    </button>
                    <button
                        onClick={() => onAskSupport()}
                        disabled={isStreaming}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-mono uppercase tracking-widest text-[10px] py-3 px-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30 shadow-lg"
                    >
                        {isStreaming ? "PROCESSING REQUEST..." : "AUTO-SEND SITUATION (T+46m)"}
                    </button>
                </div>
            </div>
        </div >
    );
}
