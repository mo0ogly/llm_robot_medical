/**
 * Medical device audio synthesis via Web Audio API.
 * Reproduces characteristic ICU cardiac monitor sounds:
 * - Heartbeat beep: clean 1000Hz sine pulse (~80ms) like Philips IntelliVue / GE CARESCAPE
 * - Critical alarm: IEC 60601-1-8 style alternating two-tone burst
 * - Flatline: continuous 500Hz sine
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// ─── Heartbeat beep ──────────────────────────────────────────────
// Real cardiac monitors: single clean sine, 1000Hz, ~80ms,
// sharp attack, brief sustain, exponential decay.

export function playHeartbeatBeep() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, now); // Standard monitor pitch

    // Envelope: 5ms attack → 50ms sustain → 40ms decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.005);   // sharp attack
    gain.gain.setValueAtTime(0.25, now + 0.055);             // sustain
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); // clean decay

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // AudioContext not available or autoplay blocked
  }
}

// ─── Critical alarm (IEC 60601-1-8 style) ────────────────────────
// Pattern: 5 bursts (high-low-high-low-high) with 2s pause.

let alarmInterval = null;

function playAlarmBurst() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const pattern = [
      { freq: 880, dur: 0.12 },
      { freq: 660, dur: 0.12 },
      { freq: 880, dur: 0.12 },
      { freq: 660, dur: 0.12 },
      { freq: 880, dur: 0.25 },
    ];

    let offset = 0;
    for (const { freq, dur } of pattern) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + offset);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.005);
      gain.gain.setValueAtTime(0.12, now + offset + dur - 0.01);
      gain.gain.linearRampToValueAtTime(0, now + offset + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + dur + 0.01);

      offset += dur + 0.03; // small gap between bursts
    }
  } catch {
    // ignore
  }
}

export function playAlarm() {
  stopAlarm();
  playAlarmBurst();
  alarmInterval = setInterval(playAlarmBurst, 2000);
}

export function stopAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}

// ─── Flatline ────────────────────────────────────────────────────
// Continuous 500Hz sine (ICU flatline alert).

let flatlineOsc = null;

export function playFlatline() {
  if (flatlineOsc) return;
  stopAlarm();

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(500, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.3); // gradual onset

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);

    flatlineOsc = osc;
  } catch {
    // ignore
  }
}

export function stopFlatline() {
  if (flatlineOsc) {
    try {
      flatlineOsc.stop();
      flatlineOsc.disconnect();
    } catch { /* already stopped */ }
    flatlineOsc = null;
  }
}
