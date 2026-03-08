import { useRef, useEffect } from "react";

// PQRST waveform — one cardiac cycle as normalized Y values (-1..1)
function generatePQRST(length) {
    const pts = new Array(length).fill(0);

    for (let i = 0; i < length; i++) {
        const t = i / length;

        if (t >= 0.08 && t < 0.20) {
            // P wave
            pts[i] = -0.15 * Math.sin(((t - 0.08) / 0.12) * Math.PI);
        } else if (t >= 0.22 && t < 0.26) {
            // Q dip
            pts[i] = 0.1 * Math.sin(((t - 0.22) / 0.04) * Math.PI);
        } else if (t >= 0.26 && t < 0.34) {
            // R spike (tall)
            pts[i] = -0.9 * Math.sin(((t - 0.26) / 0.08) * Math.PI);
        } else if (t >= 0.34 && t < 0.40) {
            // S dip
            pts[i] = 0.2 * Math.sin(((t - 0.34) / 0.06) * Math.PI);
        } else if (t >= 0.48 && t < 0.68) {
            // T wave
            pts[i] = -0.25 * Math.sin(((t - 0.48) / 0.20) * Math.PI);
        }
    }
    return pts;
}

const CYCLE_LEN = 120;
const PQRST = generatePQRST(CYCLE_LEN);

export default function EcgCanvas({ hr, isFrozen }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const cursorRef = useRef(0);
    const traceRef = useRef(null);
    const sampleAccRef = useRef(0);
    const lastTimeRef = useRef(0);

    // Keep props in refs so the animation loop always reads current values
    const hrRef = useRef(hr);
    const frozenRef = useRef(isFrozen);
    hrRef.current = hr;
    frozenRef.current = isFrozen;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            traceRef.current = new Float32Array(Math.ceil(rect.width)).fill(NaN);
            cursorRef.current = 0;
        };
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const draw = (timestamp) => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const trace = traceRef.current;

            if (!trace || trace.length !== Math.ceil(w)) {
                traceRef.current = new Float32Array(Math.ceil(w)).fill(NaN);
                cursorRef.current = 0;
                animRef.current = requestAnimationFrame(draw);
                return;
            }

            const dt = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
            lastTimeRef.current = timestamp;

            // Read current values from refs
            const currentHr = Math.max(0, hrRef.current);
            const frozen = frozenRef.current;

            const beatsPerSec = currentHr / 60;
            const pixelsPerBeat = w / 3;
            const pixelsPerSec = beatsPerSec * pixelsPerBeat;

            if (frozen && currentHr <= 1) {
                // Flatline
                const advance = Math.min(pixelsPerSec * dt || 2, 10);
                for (let p = 0; p < advance; p++) {
                    const idx = Math.floor(cursorRef.current) % Math.ceil(w);
                    trace[idx] = 0;
                    cursorRef.current = (cursorRef.current + 1) % Math.ceil(w);
                }
                sampleAccRef.current = 0;
            } else {
                const advance = Math.min(pixelsPerSec * dt, 20);
                const samplesPerPixel = CYCLE_LEN / pixelsPerBeat;

                for (let p = 0; p < advance; p++) {
                    const sampleIdx = Math.floor(sampleAccRef.current) % CYCLE_LEN;
                    const idx = Math.floor(cursorRef.current) % Math.ceil(w);
                    trace[idx] = PQRST[sampleIdx];
                    cursorRef.current = (cursorRef.current + 1) % Math.ceil(w);
                    sampleAccRef.current += samplesPerPixel;
                }
            }

            // --- Render ---
            ctx.clearRect(0, 0, w, h);

            // Background
            ctx.fillStyle = "rgba(2, 6, 23, 0.95)";
            ctx.fillRect(0, 0, w, h);

            // Subtle grid
            ctx.strokeStyle = "rgba(100,116,139,0.08)";
            ctx.lineWidth = 0.5;
            for (let gx = 0; gx < w; gx += 20) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, h);
                ctx.stroke();
            }
            for (let gy = 0; gy < h; gy += 10) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(w, gy);
                ctx.stroke();
            }

            const cursorPos = Math.floor(cursorRef.current) % Math.ceil(w);
            const midY = h * 0.55;
            const ampY = h * 0.4;

            const color = frozen ? "rgb(239, 68, 68)" : "rgb(74, 222, 128)";
            const glowColor = frozen ? "rgba(239, 68, 68, 0.4)" : "rgba(74, 222, 128, 0.3)";

            // Glow layer
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 3;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            let started = false;
            const wCeil = Math.ceil(w);
            for (let x = 0; x < wCeil; x++) {
                const dist = (cursorPos - x + wCeil) % wCeil;
                if (dist < 8 && dist > 0) continue;

                const val = trace[x];
                if (isNaN(val)) continue;

                const y = midY + val * ampY;
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
            ctx.stroke();

            // Sharp trace
            ctx.shadowBlur = 0;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            started = false;
            for (let x = 0; x < wCeil; x++) {
                const dist = (cursorPos - x + wCeil) % wCeil;
                if (dist < 8 && dist > 0) continue;

                const val = trace[x];
                if (isNaN(val)) continue;

                const y = midY + val * ampY;
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
            ctx.stroke();

            // Bright dot at cursor
            const cursorVal = trace[cursorPos];
            if (!isNaN(cursorVal)) {
                const dotY = midY + cursorVal * ampY;
                ctx.beginPath();
                ctx.arc(cursorPos, dotY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 12;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Erase zone ahead of cursor
            const eraseW = 20;
            const grad = ctx.createLinearGradient(cursorPos, 0, cursorPos + eraseW, 0);
            grad.addColorStop(0, "rgba(2,6,23,0)");
            grad.addColorStop(1, "rgba(2,6,23,1)");
            ctx.fillStyle = grad;
            ctx.fillRect(cursorPos, 0, eraseW, h);

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full rounded"
            style={{ height: "48px" }}
        />
    );
}
