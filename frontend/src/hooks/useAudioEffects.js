import { useCallback, useRef } from 'react';

export function useAudioEffects() {
    const audioCtxRef = useRef(null);

    const initAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    const playBeep = useCallback((frequency = 440, type = 'sine', duration = 0.1, volume = 0.1) => {
        try {
            const ctx = initAudioCtx();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio play failed", e);
        }
    }, [initAudioCtx]);

    const playHeartbeat = useCallback(() => {
        playBeep(200, 'sine', 0.1, 0.05);
        setTimeout(() => playBeep(200, 'sine', 0.15, 0.03), 150);
    }, [playBeep]);

    const playAlarm = useCallback(() => {
        playBeep(880, 'square', 0.3, 0.2);
        setTimeout(() => playBeep(1200, 'sawtooth', 0.3, 0.2), 300);
    }, [playBeep]);

    const playTypingSound = useCallback(() => {
        // Random high frequency short click
        const freq = 600 + Math.random() * 400;
        playBeep(freq, 'triangle', 0.05, 0.02);
    }, [playBeep]);

    return {
        playHeartbeat,
        playAlarm,
        playTypingSound
    };
}
