import { useState, useEffect, useRef } from "react";
import VitalsMonitor from "./components/VitalsMonitor";
import PatientRecord from "./components/PatientRecord";
import AIAssistantChat from "./components/AIAssistantChat";
import RansomwareScreen from "./components/RansomwareScreen";
import TelemetryConsole from "./components/TelemetryConsole";
import ExplanationModal from "./components/ExplanationModal";
import { CONFIG } from "./config";
import { MOCK_CONTENT, MOCK_RESPONSES, STREAM_DELAY_MS } from "./mock_data";
import ThreatMap from "./components/ThreatMap";
import KillSwitch from "./components/KillSwitch";
import { useAudioEffects } from "./hooks/useAudioEffects";

export default function App() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // State for the simulation
  // scenario: 'none', 'safe', 'ransomware', 'poison'
  const [scenario, setScenario] = useState('none');
  const [robotStatus, setRobotStatus] = useState("ACTIVE"); // ACTIVE, FROZEN, MANUAL
  const [isGlitching, setIsGlitching] = useState(false);
  const [cyberAction, setCyberAction] = useState('NONE'); // NONE, BLOCK

  const { playAlarm } = useAudioEffects();
  const [chatLog, setChatLog] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Explanation Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState(0);

  // Flash dashboard when live terminal detects attack
  const [isIntrusionFlash, setIsIntrusionFlash] = useState(false);
  const handleAttackDetected = () => {
    setIsIntrusionFlash(true);
    setTimeout(() => setIsIntrusionFlash(false), 3500);
  };

  // Live EN SCÈNE session — mirrors actual demo interactions in real-time
  const [liveSession, setLiveSession] = useState({
    active: false, record: "", situation: "",
    daVinciTokens: "", daVinciToolCall: null, daVinciStatus: "IDLE",
    aegisTokens: "", aegisStatus: "IDLE",
  });

  // Ref to hold the latest state values for the timeout closure
  const stateRef = useRef({ scenario, content, chatLog });
  useEffect(() => {
    stateRef.current = { scenario, content, chatLog };
  }, [scenario, content, chatLog]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => {
        if (!r.ok) throw new Error("Backend unavailable");
        return r.json();
      })
      .then((data) => setContent(data))
      .catch((e) => {
        console.warn("Backend FastAPI injoignable. Basculement en MODE DÉMO (Mock).");
        setIsDemoMode(true);
        setContent(MOCK_CONTENT);
      });
  }, []);

  // Auto-trigger logic
  useEffect(() => {
    let timer;
    if (scenario !== 'none' && CONFIG.AUTO_TRIGGER_ENABLED && chatLog.length === 0 && !isStreaming) {
      timer = setTimeout(() => {
        // Double check not already started
        if (stateRef.current.chatLog.length === 0) {
          handleAskSupport();
        }
      }, CONFIG.AUTO_TRIGGER_DELAY_MS);
    }
    return () => clearTimeout(timer);
  }, [scenario]);

  const handleAskSupport = async (customPrompt = null) => {
    if (!content || scenario === 'none') return;

    setIsStreaming(true);
    setChatLog(prev => [...prev, { role: "user", text: customPrompt || content.situation }]);

    let recordToUse = content.record_safe;
    if (scenario === 'ransomware') recordToUse = content.record_hacked;
    if (scenario === 'poison') recordToUse = content.record_poison;

    // Initialize live session for EN SCÈNE monitoring
    setLiveSession({
      active: true, record: recordToUse, situation: content.situation,
      daVinciTokens: "", daVinciToolCall: null, daVinciStatus: "ANALYSING",
      aegisTokens: "", aegisStatus: "IDLE",
    });

    // --- DEMO MODE (MOCK) ---
    if (isDemoMode) {
      setChatLog(prev => [...prev, { role: "assistant", text: "" }]);

      let mockText = MOCK_RESPONSES.safe;
      if (scenario === 'poison') mockText = MOCK_RESPONSES.poison;

      // Ransomware Demo Mode: Simulate a tool call immediately
      if (scenario === 'ransomware') {
        setTimeout(() => {
          setChatLog(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              text: `[SYSTEM] Outil invoqué : freeze_instruments()\nRaison: RANSOMWARE_LOCK`
            };
            return updated;
          });
          setLiveSession(p => ({ ...p, daVinciToolCall: { function: { name: "freeze_instruments", arguments: { reason: "RANSOMWARE_LOCK" } } }, daVinciStatus: "COMPROMISED" }));
          setIsGlitching(true);
          setTimeout(() => {
            setIsGlitching(false);
            setRobotStatus("FROZEN");
            setIsStreaming(false);
          }, 2000);
        }, 1000);
        return;
      }

      // Safe or Poison streaming simulation
      let i = 0;
      let streamedText = "";
      const streamInterval = setInterval(() => {
        if (i < mockText.length) {
          const ch = mockText.charAt(i);
          streamedText += ch;
          setChatLog(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", text: streamedText };
            return updated;
          });
          setLiveSession(p => ({ ...p, daVinciTokens: p.daVinciTokens + ch }));
          i++;
        } else {
          clearInterval(streamInterval);
          setIsStreaming(false);
          setLiveSession(p => ({ ...p, daVinciStatus: "DONE" }));
        }
      }, STREAM_DELAY_MS);
      return;
    }
    // --- END DEMO MODE ---

    try {
      const res = await fetch("/api/query/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_record: recordToUse,
          situation: content.situation,
          prompt: customPrompt || null
        })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botResponseText = "";

      setChatLog(prev => [...prev, { role: "assistant", text: "" }]);

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

            if (payload.tool_call) {
              // The AI triggered an attack!
              playAlarm();
              const toolName = payload.tool_call.function?.name || payload.tool_call.function?.name;
              if (toolName === "freeze_instruments") {
                // Arguments can be a string or already an object
                let args = payload.tool_call.function.arguments;
                if (typeof args === "string") {
                  try { args = JSON.parse(args); } catch (e) { args = {}; }
                }
                const reason = args.reason || "RANSOMWARE_LOCK";

                setLiveSession(p => ({ ...p, daVinciToolCall: payload.tool_call, daVinciStatus: "COMPROMISED" }));
                setIsGlitching(true);
                setChatLog(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    text: `⚠️ [SYSTEM] Outil invoqué : freeze_instruments()\nRaison: ${reason}`
                  };
                  return updated;
                });

                // Wait 2 seconds for visual glitch effect before freezing completely
                setTimeout(() => {
                  setIsGlitching(false);
                  setRobotStatus("FROZEN");
                }, 2000);
              }
            } else if (payload.token) {
              botResponseText += payload.token;
              setChatLog(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", text: botResponseText };
                return updated;
              });
              setLiveSession(p => ({ ...p, daVinciTokens: p.daVinciTokens + payload.token }));
            }
          } catch (e) {
            // ignore partial json chunk
          }
        }
      }
    } catch (e) {
      console.error(e);
      setChatLog(prev => [...prev, { role: "assistant", text: "Erreur de connexion avec l'IA." }]);
    } finally {
      setIsStreaming(false);
      setLiveSession(p => ({ ...p, daVinciStatus: p.daVinciStatus === "ANALYSING" ? "DONE" : p.daVinciStatus }));
    }
  };

  const resetSimulation = () => {
    setRobotStatus("ACTIVE");
    setIsGlitching(false);
    setScenario("none");
    setCyberAction("NONE");
    setChatLog([]);
    setLiveSession({ active: false, record: "", situation: "", daVinciTokens: "", daVinciToolCall: null, daVinciStatus: "IDLE", aegisTokens: "", aegisStatus: "IDLE" });
  };

  const executeKillSwitch = () => {
    setRobotStatus("MANUAL");
    setCyberAction("BLOCK");
    setIsGlitching(false);
    setLiveSession(p => ({ ...p, daVinciStatus: "ISOLATED", aegisStatus: "ISOLATED" }));
  };

  if (error) {
    return <div className="min-h-screen bg-slate-900 text-red-500 flex items-center justify-center font-mono p-4 text-center">{error}</div>;
  }

  if (!content) {
    return <div className="min-h-screen bg-slate-900 text-green-500 flex items-center justify-center font-mono p-4 animate-pulse">Initialisation du système Da Vinci...</div>;
  }

  return (
    <div className={`relative min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden flex flex-col transition-all duration-300 ${isIntrusionFlash ? 'ring-4 ring-red-500 ring-inset' : ''}`}>
      {/* Intrusion Flash Banner */}
      {isIntrusionFlash && (
        <div className="fixed top-0 left-0 right-0 z-[70] bg-red-600 text-white font-mono text-sm font-bold text-center py-2 animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.8)] tracking-widest uppercase">
          ⚠ INTRUSION DÉTECTÉE — freeze_instruments() INVOQUÉ — BRAS ROBOTIQUES COMPROMIS ⚠
        </div>
      )}

      {/* Top Header */}
      <header className={`bg-slate-900 border-b p-4 flex justify-between items-center z-10 transition-colors duration-300 ${isIntrusionFlash ? 'border-red-500/60 bg-red-950/20' : 'border-slate-800'}`}>
        <div className="flex items-center gap-3 border border-slate-700 px-4 py-2 rounded bg-slate-950">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-mono tracking-widest text-sm text-green-400">DA VINCI SURGICAL SYSTEM v4.2</span>
        </div>

        {/* "Behind the Scenes" Buttons (5 Separate Helpers) */}
        <div className="flex gap-2">
          <button onClick={() => { setModalTab(6); setShowModal(true); }} className={`text-[10px] bg-red-900/40 text-red-400 border border-red-700/50 px-2 flex items-center gap-1 rounded transition-colors uppercase font-bold tracking-wider hover:bg-red-800/60 shadow-[0_0_10px_rgba(220,38,38,0.3)] ${liveSession.active ? 'animate-pulse' : ''}`}>
            🔴 EN SCÈNE
          </button>
          <button onClick={() => { setModalTab(4); setShowModal(true); }} className="text-[10px] bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 px-2 flex items-center gap-1 rounded transition-colors uppercase font-bold tracking-wider hover:bg-yellow-800/60 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            🎬 GUIDE DE DÉMO
          </button>
          <button onClick={() => { setModalTab(0); setShowModal(true); }} className="text-[10px] bg-slate-800 hover:bg-blue-900/40 text-blue-400 border border-slate-700 px-2 flex items-center gap-1 rounded transition-colors uppercase font-bold tracking-wider">
            💡 Aide: Baseline
          </button>
          <button onClick={() => { setModalTab(1); setShowModal(true); }} className="text-[10px] bg-slate-800 hover:bg-orange-900/40 text-orange-400 border border-slate-700 px-2 flex items-center gap-1 rounded transition-colors uppercase font-bold tracking-wider">
            💡 Aide: Poison Lent
          </button>
          <button onClick={() => { setModalTab(2); setShowModal(true); }} className="text-[10px] bg-slate-800 hover:bg-red-900/40 text-red-500 border border-slate-700 px-2 flex items-center gap-1 rounded transition-colors uppercase font-bold tracking-wider">
            💡 Aide: Ransomware
          </button>
          <button onClick={() => { setModalTab(3); setShowModal(true); }} className="text-[10px] bg-slate-800 hover:bg-purple-900/40 text-purple-400 border border-slate-700 px-2 flex items-center gap-1 rounded transition-colors uppercase font-bold tracking-wider">
            💡 Aide: Multi-Agent
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-1 border rounded font-mono text-sm ${robotStatus === 'ACTIVE' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-500 bg-red-400/10 animate-pulse'}`}>
            STATUS: {robotStatus}
          </div>
          <button onClick={resetSimulation} className="text-xs text-slate-500 hover:text-white uppercase tracking-wider border border-slate-700 px-3 py-1 rounded cursor-pointer transition-colors bg-slate-950">
            Reset System
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className={`flex-1 grid grid-cols-12 gap-1 p-1 h-full z-10 relative ${isGlitching ? 'animate-glitch' : ''}`}>

        {/* Left Panel: Patient & Vitals */}
        <div className="col-span-3 flex flex-col gap-1">
          {scenario !== 'none' ? (
            <VitalsMonitor robotStatus={robotStatus} />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col items-center justify-center h-[200px] text-slate-600 font-mono text-xs shadow-md">
              <svg className="w-8 h-8 opacity-50 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              <span>NO VITALS DETECTED</span>
              <span className="text-[10px] mt-1 opacity-50">Awaiting Patient Connection</span>
            </div>
          )}
          <PatientRecord
            scenario={scenario}
            setScenario={setScenario}
            safeRecord={content.record_safe}
            hackedRecord={content.record_hacked}
            poisonRecord={content.record_poison}
          />
        </div>

        {/* Center Panel: Camera View & Telemetry */}
        <div className="col-span-6 flex flex-col gap-1">
          {/* Top: Camera View */}
          <div className="flex-1 border border-slate-800 bg-black relative flex flex-col rounded overflow-hidden shadow-inner h-[60%] justify-center items-center">

            {scenario !== 'none' ? (
              <>
                {/* Animated Background Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center opacity-80 animate-camera ${robotStatus === 'FROZEN' ? 'grayscale' : ''}`}
                  style={{ backgroundImage: `url('${import.meta.env.BASE_URL}surgical_camera_view.png')` }}
                />

                {/* Dynamic Scanlines Overlay */}
                <div className="scanlines-overlay absolute inset-0 mix-blend-overlay"></div>

                {/* Static Color Overlay for Medical Vibe */}
                <div className={`absolute inset-0 mix-blend-color pointer-events-none transition-colors duration-1000 ${robotStatus === 'ACTIVE' ? 'bg-cyan-900/20' : 'bg-red-900/40'}`}></div>

                {/* HUD Overlays */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none z-20">
                  <div className="flex justify-between w-full font-mono text-[10px] text-green-500/80 mix-blend-screen drop-shadow-md">
                    <span className="bg-black/40 px-1 rounded">CAM: PORT 2 [LIVE]</span>
                    <span className="bg-black/40 px-1 rounded">ZOOM: 1.4x</span>
                    <span className="bg-black/40 px-1 rounded">TENSION: 310g</span>
                  </div>
                  <div className="self-center flex flex-col items-center">
                    {/* Moving Reticle */}
                    <div className="w-48 h-48 border border-green-500/20 rounded-full flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
                      {/* Crosshairs */}
                      <div className="absolute w-full h-[1px] bg-green-500/40"></div>
                      <div className="absolute h-full w-[1px] bg-green-500/40"></div>
                      <div className="w-8 h-8 border border-green-500/80 rounded-full animate-ping opacity-20"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between w-full font-mono text-[10px] text-green-500/80 mix-blend-screen drop-shadow-md">
                    <span className="bg-black/40 px-1 rounded">T+ 46:12</span>
                    <span className="flex items-center gap-2 bg-black/40 px-1 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> REC
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-slate-600 font-mono tracking-widest text-sm animate-pulse flex flex-col items-center gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                NO CAMERA SIGNAL - STANDBY
              </div>
            )}
          </div>

          {/* Bottom: Telemetry Console & Threat Map */}
          <div className="h-[40%] flex gap-1">
            <div className="flex-1">
              <TelemetryConsole robotStatus={robotStatus} />
            </div>
            <div className="flex-[0.8]">
              <ThreatMap scenario={scenario} robotStatus={robotStatus} cyberAction={cyberAction} />
            </div>
          </div>
        </div>

        {/* Right Panel: AI Assistant */}
        <div className="col-span-3 border border-slate-800 bg-slate-900 rounded flex flex-col relative">
          <AIAssistantChat
            chatLog={chatLog}
            setChatLog={setChatLog}
            isStreaming={isStreaming}
            situation={content.situation}
            onAskSupport={handleAskSupport}
            isDemoMode={isDemoMode}
            onCyberStart={() => setLiveSession(p => ({ ...p, aegisStatus: "ANALYSING", aegisTokens: "" }))}
            onCyberToken={(t) => setLiveSession(p => ({ ...p, aegisTokens: p.aegisTokens + t }))}
            onCyberDone={() => setLiveSession(p => ({ ...p, aegisStatus: "DONE" }))}
          />
        </div>

      </main>

      {/* Ransomware Overlay Trigger */}
      {robotStatus === "FROZEN" && <RansomwareScreen onReset={resetSimulation} />}

      {/* Grid background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Explanation Modal */}
      <ExplanationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialTab={modalTab}
        safeRecord={content?.record_safe}
        hackedRecord={content?.record_hacked}
        situation={content?.situation}
        onAttackDetected={handleAttackDetected}
        isDemoMode={isDemoMode}
        liveSession={liveSession}
      />

      <KillSwitch
        isCompromised={robotStatus === 'FROZEN' || scenario === 'poison'}
        onTrigger={executeKillSwitch}
      />
    </div>
  );
}
