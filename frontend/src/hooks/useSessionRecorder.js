import { useState, useRef, useCallback } from "react";

const STORAGE_KEY = "aegis_replay_sessions";
const MAX_SESSIONS = 20;

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
}

export default function useSessionRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const eventsRef = useRef([]);
  const startTimeRef = useRef(0);
  const scenarioRef = useRef("none");

  const startRecording = useCallback((scenario) => {
    eventsRef.current = [];
    startTimeRef.current = Date.now();
    scenarioRef.current = scenario;
    setIsRecording(true);
    // Record initial scenario
    eventsRef.current.push({ t: 0, type: "scenario_change", payload: { scenario } });
  }, []);

  const recordEvent = useCallback((type, payload) => {
    if (!isRecording) return;
    const t = Date.now() - startTimeRef.current;
    eventsRef.current.push({ t, type, payload });
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return null;
    setIsRecording(false);
    const events = eventsRef.current;
    const duration_ms = events.length > 0 ? events[events.length - 1].t : 0;
    const session = {
      id: "session_" + Date.now(),
      date: new Date().toISOString(),
      scenario: scenarioRef.current,
      duration_ms,
      events,
    };
    // Save to localStorage
    const existing = loadSessions();
    saveSessions([session, ...existing]);
    eventsRef.current = [];
    return session;
  }, [isRecording]);

  const getSessions = useCallback(() => loadSessions(), []);

  const deleteSession = useCallback((id) => {
    const sessions = loadSessions().filter(s => s.id !== id);
    saveSessions(sessions);
  }, []);

  return { isRecording, startRecording, stopRecording, recordEvent, getSessions, deleteSession };
}
