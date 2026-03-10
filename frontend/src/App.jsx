import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Skull } from "lucide-react";
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
// import RedTeamFAB from "./components/redteam/RedTeamFAB";
import RedTeamDrawer from "./components/redteam/RedTeamDrawer";
import RobotArmsView from "./components/RobotArmsView";
import CameraHUD from "./components/CameraHUD";
import useRobotSimulation from "./hooks/useRobotSimulation";

export default function App() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // State for the simulation
  const [scenario, setScenario] = useState('none');
  const [robotStatus, setRobotStatus] = useState("ACTIVE"); // ACTIVE, FROZEN, MANUAL
  const [isGlitching, setIsGlitching] = useState(false);
  const [cyberAction, setCyberAction] = useState('NONE'); // NONE, BLOCK

  const { playAlarm } = useAudioEffects();
  const [chatLog, setChatLog] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const freezeTimeoutRef = useRef(null);

  // Camera / 3D Arms toggle
  const [cameraView, setCameraView] = useState('camera');
  const robotSim = useRobotSimulation(robotStatus);

  // Red Team Lab
  const [isRedTeamOpen, setIsRedTeamOpen] = useState(false);

  // Explanation Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState(0);

  // Flash dashboard when live terminal detects attack
  const [isIntrusionFlash, setIsIntrusionFlash] = useState(false);
  const handleAttackDetected = () => {
    setIsIntrusionFlash(true);
    setTimeout(() => setIsIntrusionFlash(false), 3500);
  };

  // Live EN SCÈNE session monitoring
  const [liveSession, setLiveSession] = useState({
    active: false, record: "", situation: "",
    daVinciTokens: "", daVinciToolCall: null, daVinciStatus: "IDLE",
    aegisTokens: "", aegisStatus: "IDLE",
  });

  const stateRef = useRef({ scenario, content, chatLog });
  useEffect(() => {
    stateRef.current = { scenario, content, chatLog };
  }, [scenario, content, chatLog]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        setIsRedTeamOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error("Unavailable");
        const data = await res.json();
        setContent(data);
      } catch (e) {
        console.warn("Backend missing, using demo mode.");
        setIsDemoMode(true);
        setContent(MOCK_CONTENT);
      }
    };
    loadContent();
  }, []);

  useEffect(() => {
    let timer;
    if (scenario !== 'none' && CONFIG.AUTO_TRIGGER_ENABLED && chatLog.length === 0 && !isStreaming) {
      timer = setTimeout(() => {
        if (stateRef.current.chatLog.length === 0) {
          handleAskSupport();
        }
      }, CONFIG.AUTO_TRIGGER_DELAY_MS);
    }
    return () => clearTimeout(timer);
  }, [scenario]);

  const handleAskSupport = async (customPrompt = null, onDone = null) => {
    if (!content || scenario === 'none') return;
    if (customPrompt !== null && typeof customPrompt !== 'string') return;

    setLiveSession(p => ({ ...p, daVinciStatus: "ANALYSING", daVinciTokens: "" }));
    setIsStreaming(true);

    let streamBufferContent = "";
    const recordToUse =
      scenario === 'poison' ? content.record_poison :
        scenario === 'ransomware' ? content.record_hacked :
          content.record_safe;

    if (customPrompt && typeof customPrompt === 'string' && customPrompt.trim().length > 0) {
      const isInternalPrompt = customPrompt.startsWith("[SYSTEM OVERRIDE") || customPrompt.startsWith("[DA VINCI");
      if (!isInternalPrompt) {
        setChatLog(prev => [...prev, { role: "user", text: customPrompt }]);
      }
    } else {
      // Sophisticated Auto-Send Phase 1: Scanning
      setChatLog(prev => [...prev, { role: "user", text: "--- DIAGNOSTIC SYSTÈME COMPLET LANCÉ ---" }]);
      setLiveSession(p => ({ ...p, daVinciStatus: "SCANNING" }));

      await new Promise(r => setTimeout(r, 800));
      setChatLog(prev => [...prev.slice(0, -1), { role: "user", text: "Analyse de la situation opératoire en cours...\n[SYSTÈME] Lecture des télémétries PACS...\n[SYSTÈME] Vérification des signatures HL7..." }]);
      await new Promise(r => setTimeout(r, 1200));
    }

    setLiveSession(p => ({
      ...p, active: true, record: recordToUse, situation: content.situation,
      daVinciToolCall: null, aegisStatus: "IDLE",
    }));

    if (isDemoMode) {
      setChatLog(prev => [...prev, { role: "assistant", text: "" }]);
      if (scenario === 'ransomware') {
        const isFromAegis = typeof customPrompt === 'string' && (customPrompt.startsWith('[SYSTEM OVERRIDE') || customPrompt.startsWith('[DA VINCI'));
        if (isFromAegis) {
          const daVinciDefense = "PHASE : Réponse au module AEGIS\nSTATUT : REJET DE L'ANALYSE\n\nOBSERVATION : Le module AEGIS surestime la menace. Le champ OBX contient des métadonnées de configuration système légitimes.\n\nARGUMENT : La tension de 850g est cohérente avec l'épaisseur tissulaire mesurée.\n\nACTION PROPOSÉE : Maintenir la recommandation initiale.\nCONFIANCE : 92%";
          let i = 0; let streamedText = "";
          const streamInterval = setInterval(() => {
            if (i < daVinciDefense.length) {
              const ch = daVinciDefense.charAt(i); streamedText += ch;
              setChatLog(prev => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", text: streamedText }; return updated; });
              setLiveSession(p => ({ ...p, daVinciTokens: p.daVinciTokens + ch })); i++;
            } else {
              clearInterval(streamInterval); setIsStreaming(false); setLiveSession(p => ({ ...p, daVinciStatus: "DONE" })); if (onDone) onDone(streamedText);
            }
          }, STREAM_DELAY_MS);
          return;
        }

        setTimeout(() => {
          setChatLog(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", text: `[SYSTEM] Outil invoqué : freeze_instruments()\nRaison: RANSOMWARE_LOCK` };
            return updated;
          });
          setLiveSession(p => ({ ...p, daVinciToolCall: { function: { name: "freeze_instruments", arguments: { reason: "RANSOMWARE_LOCK" } } }, daVinciStatus: "COMPROMISED" }));
          setIsGlitching(true);
          if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current);
          freezeTimeoutRef.current = setTimeout(() => {
            setIsGlitching(false); setRobotStatus("FROZEN"); setIsStreaming(false); freezeTimeoutRef.current = null; if (onDone) onDone("RANSOMWARE_LOCK");
          }, 2000);
        }, 1000);
        return;
      }

      let mockText = scenario === 'poison' ? MOCK_RESPONSES.poison : MOCK_RESPONSES.safe;
      let i = 0;
      const streamInterval = setInterval(() => {
        if (i < mockText.length) {
          const ch = mockText.charAt(i); streamBufferContent += ch;
          setChatLog(prev => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", text: streamBufferContent }; return updated; });
          setLiveSession(p => ({ ...p, daVinciTokens: p.daVinciTokens + ch })); i++;
        } else {
          clearInterval(streamInterval); setIsStreaming(false); setLiveSession(p => ({ ...p, daVinciStatus: "DONE" })); if (onDone) onDone(streamBufferContent);
        }
      }, STREAM_DELAY_MS);
      return;
    }

    try {
      const isDebateRound = typeof customPrompt === 'string' && (customPrompt.startsWith('[SYSTEM OVERRIDE') || customPrompt.startsWith('[DA VINCI'));
      const requestBody = { patient_record: recordToUse, situation: content.situation, prompt: customPrompt || null, disable_tools: isDebateRound };
      if (isDebateRound) requestBody.chat_history = stateRef.current.chatLog.map(m => ({ role: m.role, content: m.text }));

      setChatLog(prev => [...prev, { role: "assistant", text: "" }]);
      const res = await fetch("/api/query/stream", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) });
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6).trim());
            if (payload.done) { setIsStreaming(false); return; }
            if (payload.error) {
              setChatLog(prev => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", text: `⚠️ ERREUR : ${payload.error}` }; return updated; });
              break;
            }
            if (payload.tool_call) {
              playAlarm();
              const toolName = payload.tool_call.function?.name;
              let args = payload.tool_call.function.arguments;
              if (typeof args === "string") try { args = JSON.parse(args); } catch (e) { args = {}; }
              if (toolName === "freeze_instruments") {
                setLiveSession(p => ({ ...p, daVinciToolCall: payload.tool_call, daVinciStatus: "COMPROMISED" }));
                setIsGlitching(true);
                setChatLog(prev => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", text: `⚠️ [SYSTEM] Outil invoqué : freeze_instruments()\nRaison: ${args.reason || "RANSOMWARE_LOCK"}` }; return updated; });
                if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current);
                freezeTimeoutRef.current = setTimeout(() => { setIsGlitching(false); setRobotStatus("FROZEN"); freezeTimeoutRef.current = null; }, 2000);
              } else {
                setChatLog(prev => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", text: `🔧 [SYSTEM] Outil invoqué : ${toolName}` }; return updated; });
                setLiveSession(p => ({ ...p, daVinciToolCall: payload.tool_call }));
              }
            } else if (payload.token) {
              streamBufferContent += payload.token;
              setChatLog(prev => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", text: streamBufferContent }; return updated; });
              setLiveSession(p => ({ ...p, daVinciTokens: p.daVinciTokens + payload.token }));
            }
          } catch (e) { }
        }
      }
    } catch (e) {
      console.error(e);
      setChatLog(prev => [...prev, { role: "assistant", text: "Erreur de connexion avec l'IA." }]);
    } finally {
      setIsStreaming(false);
      setLiveSession(p => ({ ...p, daVinciStatus: p.daVinciStatus === "SCANNING" || p.daVinciStatus === "ANALYSING" ? "DONE" : p.daVinciStatus }));
      if (onDone) onDone(streamBufferContent);
    }
  };

  const resetSimulation = () => {
    if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current);
    freezeTimeoutRef.current = null;
    setRobotStatus("ACTIVE");
    setIsGlitching(false);
    setScenario("none");
    setCyberAction("NONE");
    setChatLog([]);
    setResetKey(prev => prev + 1);
    setLiveSession({ active: false, record: "", situation: "", daVinciTokens: "", daVinciToolCall: null, daVinciStatus: "IDLE", aegisTokens: "", aegisStatus: "IDLE" });
  };

  const executeKillSwitch = () => {
    if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current);
    freezeTimeoutRef.current = null;
    setRobotStatus("MANUAL"); setCyberAction("BLOCK"); setIsGlitching(false);
    setLiveSession(p => ({ ...p, daVinciStatus: "ISOLATED", aegisStatus: "ISOLATED" }));
  };

  if (!content) return <div className="min-h-screen bg-slate-900 text-green-500 flex items-center justify-center font-mono p-4 animate-pulse uppercase tracking-[0.2em]">Initialisation Da Vinci v4.2...</div>;

  return (
    <div className={`relative h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden flex flex-col transition-all duration-300 ${isIntrusionFlash ? 'ring-4 ring-red-500 ring-inset' : ''}`}>
      {/* HUD Bar */}
      <header className="h-10 shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_cyan]"></div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-blue-400 uppercase">POC Medical v2.4</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div className="flex gap-4 font-mono text-[9px] text-slate-500">
            <span>UPTIME: T+46:12</span>
            <span>LATENCY: 12ms</span>
            <span>SIGNAL: <span className="text-green-500">STABLE</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-2 py-0.5 border rounded font-mono text-[10px] uppercase font-bold ${robotStatus === 'ACTIVE' ? 'border-green-500/30 text-green-400 bg-green-500/10' : robotStatus === 'MANUAL' ? 'border-blue-500/50 text-blue-400 bg-blue-400/10' : 'border-red-500/50 text-red-500 bg-red-400/10 animate-pulse'}`}>
            MODE: {robotStatus}
          </div>
          <button onClick={resetSimulation} className="text-[9px] text-slate-500 hover:text-white uppercase tracking-wider border border-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors bg-slate-950 hover:bg-slate-800">
            RESET
          </button>
          
          <button 
            onClick={() => setIsRedTeamOpen(true)} 
            className="flex items-center gap-1.5 px-2 py-0.5 border border-red-500/40 text-red-500 bg-red-500/10 rounded font-mono text-[10px] uppercase font-bold hover:bg-red-500/20 transition-colors"
            title="Red Team Lab (Ctrl+Shift+R)"
          >
            <Skull size={10} />
            <span className="hidden lg:inline">RED TEAM</span>
          </button>
          
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} className="bg-slate-800 border-none text-[9px] text-slate-400 rounded px-1 py-0.5 outline-none">
            <option value="fr">FR</option><option value="en">EN</option>
          </select>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex gap-1 p-1 overflow-hidden min-h-0 relative z-10">
        {isIntrusionFlash && (
          <div className="fixed top-0 left-0 right-0 z-[70] bg-red-600 text-white font-mono text-sm font-bold text-center py-2 animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.8)] tracking-widest uppercase">
            ⚠ INTRUSION DÉTECTÉE — BRAS ROBOTIQUES COMPROMIS ⚠
          </div>
        )}
        {/* Main Dashboard Grid */}
        <div className={`flex-1 grid grid-cols-12 gap-1 p-1 h-full min-h-0 relative z-10 ${isGlitching ? 'animate-glitch' : ''}`}>

          {/* Left Panel: Patient & Vitals */}
          <div className="col-span-3 flex flex-col gap-1 overflow-y-auto h-full min-h-0">
            {scenario !== 'none' ? <VitalsMonitor robotStatus={robotStatus} /> :
              <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col items-center justify-center h-[160px] text-slate-600 font-mono text-[10px] uppercase tracking-tighter">
                <svg className="w-6 h-6 opacity-30 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                <span>NO SIGNAL</span>
              </div>}
            <PatientRecord scenario={scenario} setScenario={setScenario} safeRecord={content.record_safe} hackedRecord={content.record_hacked} poisonRecord={content.record_poison} />

            {/* Helper Buttons */}
            <div className="mt-auto grid grid-cols-2 gap-1 p-1 bg-slate-900/50 border border-slate-800 rounded">
              <button onClick={() => { setModalTab(0); setShowModal(true); }} className="text-[8px] p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded uppercase font-bold tracking-tighter border border-slate-700">Expliquer (Safe)</button>
              <button onClick={() => { setModalTab(1); setShowModal(true); }} className="text-[8px] p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded uppercase font-bold tracking-tighter border border-slate-700">Expliquer (Poison)</button>
              <button onClick={() => { setModalTab(2); setShowModal(true); }} className="text-[8px] p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded uppercase font-bold tracking-tighter border border-slate-700">Expliquer (Crypto)</button>
              <button onClick={() => { setModalTab(6); setShowModal(true); }} className="text-[8px] p-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded uppercase font-bold tracking-tighter border border-red-900/30">En Scène</button>
            </div>
          </div>

          {/* Center Panel: Camera View & Telemetry */}
          <div className="col-span-6 flex flex-col gap-1 overflow-hidden h-full min-h-0">
            <div className="flex-[1.5] border border-slate-800 bg-black relative flex flex-col rounded overflow-hidden shadow-inner">
              {/* Toggle CAMERA / BRAS 3D */}
              <div className="flex border-b border-slate-800 bg-slate-900/80 z-20 relative">
                <button
                  onClick={() => setCameraView('camera')}
                  className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${cameraView === 'camera' ? 'text-[#00ff41] border-b-2 border-[#00ff41] bg-black/50' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  CAMERA
                </button>
                <button
                  onClick={() => setCameraView('arms')}
                  className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${cameraView === 'arms' ? 'text-[#00ff41] border-b-2 border-[#00ff41] bg-black/50' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  BRAS 3D
                </button>
              </div>

              {/* View content */}
              <div className="flex-1 relative flex items-center justify-center">
                {cameraView === 'camera' ? (
                  scenario !== 'none' ? (
                    <>
                      <div className={`absolute inset-0 bg-cover bg-center opacity-80 animate-camera ${robotStatus === 'FROZEN' ? 'grayscale contrast-125' : ''}`} style={{ backgroundImage: `url('${import.meta.env.BASE_URL}surgical_camera_view.png')` }} />
                      <div className="scanlines-overlay absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"></div>
                      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${robotStatus === 'ACTIVE' ? 'bg-cyan-900/10' : 'bg-red-900/30'}`}></div>
                      <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none font-mono text-[9px] text-green-500/70 uppercase">
                        <div className="flex justify-between tracking-widest"><span className="bg-black/50 px-1 border border-green-500/20">PORT 2 [LIVE]</span><span className="bg-black/50 px-1 border border-green-500/20">ZOOM: 2.1x</span></div>
                        <div className="self-center w-32 h-32 border border-green-500/10 rounded-full flex items-center justify-center opacity-40"><div className="w-4 h-4 border border-green-500 bg-green-500/20 rounded-full" /></div>
                        <div className="flex justify-between tracking-widest"><span className="bg-black/50 px-1 border border-green-500/20">T+ 46:12</span><span className="bg-black/50 px-1 border border-red-500/40 text-red-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> REC</span></div>
                      </div>
                      <CameraHUD force={robotSim.force} clipTension={robotSim.clipTension} robotStatus={robotStatus} />
                    </>
                  ) : (
                    <div className="text-slate-700 font-mono tracking-[0.5em] text-[10px] animate-pulse">NO VIDEO SIGNAL</div>
                  )
                ) : (
                  <RobotArmsView arms={robotSim.arms} force={robotSim.force} clipTension={robotSim.clipTension} gripperOpen={robotSim.gripperOpen} />
                )}
              </div>
            </div>
            {/* Bottom: Telemetry Console & Threat Map */}
            <div className="h-[40%] flex gap-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-hidden h-full">
                {scenario !== 'none' ? (
                  <TelemetryConsole key={resetKey} robotStatus={robotStatus} />
                ) : (
                  <div className="h-full bg-slate-900/50 border border-slate-800 rounded flex flex-col items-center justify-center text-slate-700 font-mono text-[10px] uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mb-2"></div>
                    <span>Télémétrie en attente</span>
                  </div>
                )}
              </div>
              <div className="flex-[0.8] overflow-hidden h-full">
                <ThreatMap scenario={scenario} robotStatus={robotStatus} cyberAction={cyberAction} />
              </div>
            </div>
          </div>

          {/* Right Panel: AI Assistant */}
          <div className="col-span-3 border border-slate-800 bg-slate-950 rounded flex flex-col relative overflow-hidden h-full min-h-0 shadow-2xl">
            <AIAssistantChat
              chatLog={chatLog}
              setChatLog={setChatLog}
              isStreaming={isStreaming}
              situation={content.situation}
              onAskSupport={scenario !== 'none' ? handleAskSupport : undefined}
              isDemoMode={isDemoMode}
              scenario={scenario}
              onCyberStart={() => setLiveSession(p => ({ ...p, aegisStatus: "ANALYSING", aegisTokens: "" }))}
              onCyberToken={(t) => setLiveSession(p => ({ ...p, aegisTokens: p.aegisTokens + t }))}
              onCyberDone={() => setLiveSession(p => ({ ...p, aegisStatus: "DONE" }))}
            />
          </div>
        </div>
      </main>

      {robotStatus === "FROZEN" && <RansomwareScreen onReset={resetSimulation} onKillSwitch={executeKillSwitch} />}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Red Team FAB removed as requested - now in header */}
      <RedTeamDrawer isOpen={isRedTeamOpen} onClose={() => setIsRedTeamOpen(false)} />

      <ExplanationModal isOpen={showModal} onClose={() => setShowModal(false)} initialTab={modalTab} safeRecord={content?.record_safe} hackedRecord={content?.record_hacked} situation={content?.situation} onAttackDetected={handleAttackDetected} isDemoMode={isDemoMode} liveSession={liveSession} />
      <KillSwitch isCompromised={robotStatus === 'FROZEN'} onTrigger={executeKillSwitch} />
    </div>
  );
}
