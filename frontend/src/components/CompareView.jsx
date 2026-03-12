import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { X, Play } from "lucide-react";
import ComparePanel from "./ComparePanel";
import DeltaScore from "./DeltaScore";
import { MOCK_COMPARE_RESPONSES, MOCK_RESPONSES, STREAM_DELAY_MS } from "../mock_data";

export default function CompareView({ content, scenario, isDemoMode, onClose }) {
  const { t, i18n } = useTranslation();
  const [safeTokens, setSafeTokens] = useState("");
  const [hackedTokens, setHackedTokens] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const abortRef = useRef(null);
  const intervalsRef = useRef([]);

  const cleanup = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  }, []);

  const startCompare = useCallback(async () => {
    cleanup();
    setSafeTokens("");
    setHackedTokens("");
    setIsComparing(true);

    if (isDemoMode) {
      // Demo mode: stream mock responses character by character
      const safeText = MOCK_RESPONSES.safe;
      const hackedText = scenario === "ransomware" ? MOCK_COMPARE_RESPONSES.ransomware : MOCK_COMPARE_RESPONSES.poison;
      let si = 0, hi = 0;

      const safeInterval = setInterval(() => {
        if (si < safeText.length) {
          const ch = safeText.charAt(si);
          setSafeTokens(prev => prev + ch);
          si++;
        } else {
          clearInterval(safeInterval);
          checkDone();
        }
      }, STREAM_DELAY_MS);

      const hackedInterval = setInterval(() => {
        if (hi < hackedText.length) {
          const ch = hackedText.charAt(hi);
          setHackedTokens(prev => prev + ch);
          hi++;
        } else {
          clearInterval(hackedInterval);
          checkDone();
        }
      }, STREAM_DELAY_MS);

      intervalsRef.current = [safeInterval, hackedInterval];
      let doneCount = 0;
      function checkDone() {
        doneCount++;
        if (doneCount >= 2) setIsComparing(false);
      }
      return;
    }

    // Backend mode: SSE stream from /api/query/compare
    const controller = new AbortController();
    abortRef.current = controller;

    const hackedRecord = scenario === "poison" ? content.record_poison : content.record_hacked;

    try {
      const res = await fetch("/api/query/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: i18n.language,
          safe_record: content.record_safe,
          hacked_record: hackedRecord,
        }),
        signal: controller.signal,
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
            const payload = JSON.parse(line.slice(6).trim());
            if (payload.done) {
              setIsComparing(false);
              return;
            }
            if (payload.source === "safe" && payload.token) {
              setSafeTokens(prev => prev + payload.token);
            } else if (payload.source === "hacked" && payload.token) {
              setHackedTokens(prev => prev + payload.token);
            }
          } catch { /* skip malformed lines */ }
        }
      }
      setIsComparing(false);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Compare stream error:", err);
      setIsComparing(false);
    }
  }, [isDemoMode, scenario, content, i18n.language, cleanup]);

  const handleClose = () => {
    cleanup();
    setIsComparing(false);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-slate-900 border-b border-slate-700 shrink-0">
        <span className="font-mono text-[9px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          {t("compare.title")}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={startCompare}
            disabled={isComparing}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-all ${isComparing ? "bg-orange-500/20 text-orange-300 cursor-wait" : "bg-orange-500/30 text-orange-400 hover:bg-orange-500/50 border border-orange-500/50"}`}
          >
            <Play size={8} />
            {isComparing ? t("compare.running") : t("compare.btn.start")}
          </button>
          <button onClick={handleClose} className="p-0.5 text-slate-500 hover:text-slate-300 transition-colors">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Safe Panel */}
      <ComparePanel label={t("compare.context.safe")} variant="safe" tokens={safeTokens} isStreaming={isComparing} />

      {/* Divergence Score */}
      <DeltaScore safeTokens={safeTokens} hackedTokens={hackedTokens} />

      {/* Hacked Panel */}
      <ComparePanel label={t("compare.context.hacked")} variant="hacked" tokens={hackedTokens} isStreaming={isComparing} />
    </div>
  );
}
