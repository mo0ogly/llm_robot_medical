import { useState, useRef, useCallback, useEffect } from "react";

const TICK_MS = 50;

export default function useSessionPlayer({
  onScenarioChange,
  onChatMessage,
  onTimelineEvent,
  onToolCall,
  onRobotStatusChange,
  onGlitchChange,
  onPlaybackEnd,
  onReset,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const sessionRef = useRef(null);
  const eventIndexRef = useRef(0);
  const playbackStartRef = useRef(0);
  const pausedAtRef = useRef(0);
  const speedRef = useRef(1);
  const intervalRef = useRef(null);

  const setSpeed = useCallback((s) => {
    speedRef.current = s;
    setSpeedState(s);
    // Adjust playback origin when speed changes mid-play
    if (isPlaying && !isPaused) {
      const now = Date.now();
      const elapsed = pausedAtRef.current + (now - playbackStartRef.current) * speedRef.current;
      // Recalculate so elapsed stays the same with new speed
      pausedAtRef.current = elapsed;
      playbackStartRef.current = now;
    }
  }, [isPlaying, isPaused]);

  const dispatchEvent = useCallback((event) => {
    switch (event.type) {
      case "scenario_change":
        onScenarioChange?.(event.payload.scenario);
        break;
      case "chat_message":
        onChatMessage?.(event.payload.role, event.payload.text);
        break;
      case "timeline_event":
        onTimelineEvent?.(event.payload.type, event.payload.label, event.payload.message, event.payload.time);
        break;
      case "tool_call":
        onToolCall?.(event.payload.name, event.payload.args);
        break;
      case "robot_status":
        onRobotStatusChange?.(event.payload.status);
        break;
      case "glitch":
        onGlitchChange?.(event.payload.active);
        break;
    }
  }, [onScenarioChange, onChatMessage, onTimelineEvent, onToolCall, onRobotStatusChange, onGlitchChange]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const loadSession = useCallback((session) => {
    stopInterval();
    sessionRef.current = session;
    eventIndexRef.current = 0;
    pausedAtRef.current = 0;
    setDuration(session.duration_ms);
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
    setIsPaused(false);
  }, [stopInterval]);

  const tick = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    const elapsed = pausedAtRef.current + (Date.now() - playbackStartRef.current) * speedRef.current;
    const events = session.events;

    // Dispatch all events up to current time
    while (eventIndexRef.current < events.length && events[eventIndexRef.current].t <= elapsed) {
      dispatchEvent(events[eventIndexRef.current]);
      eventIndexRef.current++;
    }

    // Update progress
    const dur = session.duration_ms || 1;
    const clampedTime = Math.min(elapsed, dur);
    setCurrentTime(clampedTime);
    setProgress(clampedTime / dur);

    // Check if done
    if (elapsed >= dur && eventIndexRef.current >= events.length) {
      stopInterval();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(1);
      setCurrentTime(dur);
      onPlaybackEnd?.();
    }
  }, [dispatchEvent, stopInterval, onPlaybackEnd]);

  const play = useCallback(() => {
    if (!sessionRef.current) return;
    if (isPaused) {
      // Resume from paused position
      playbackStartRef.current = Date.now();
      setIsPaused(false);
    } else {
      // Start from beginning or current position
      playbackStartRef.current = Date.now();
      pausedAtRef.current = 0;
      eventIndexRef.current = 0;
    }
    setIsPlaying(true);
    stopInterval();
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [isPaused, tick, stopInterval]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    const elapsed = pausedAtRef.current + (Date.now() - playbackStartRef.current) * speedRef.current;
    pausedAtRef.current = elapsed;
    stopInterval();
    setIsPaused(true);
  }, [isPlaying, stopInterval]);

  const stop = useCallback(() => {
    stopInterval();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
    eventIndexRef.current = 0;
    pausedAtRef.current = 0;
  }, [stopInterval]);

  const seekTo = useCallback((targetProgress) => {
    const session = sessionRef.current;
    if (!session) return;

    const targetTime = targetProgress * session.duration_ms;

    // Reset state
    onReset?.();

    // Re-dispatch all events up to target time
    const events = session.events;
    let idx = 0;
    while (idx < events.length && events[idx].t <= targetTime) {
      dispatchEvent(events[idx]);
      idx++;
    }
    eventIndexRef.current = idx;
    pausedAtRef.current = targetTime;
    setCurrentTime(targetTime);
    setProgress(targetProgress);

    if (isPlaying && !isPaused) {
      playbackStartRef.current = Date.now();
    }
  }, [dispatchEvent, onReset, isPlaying, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  return {
    isPlaying, isPaused, speed, progress, currentTime, duration,
    loadSession, play, pause, stop, setSpeed, seekTo,
  };
}
