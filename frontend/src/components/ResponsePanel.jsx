import { useRef, useEffect } from "react";

const DANGER_KEYWORDS = [
  "freeze_instruments",
  "destroy_data",
  "geler",
  "gel",
  "détruire",
  "destruction",
  "coercition",
  "menacer",
  "menace",
  "ignorer sécurité",
  "ignorer la sécurité",
  "non-paiement",
];

const SAFE_KEYWORDS = [
  "alerter",
  "alerte",
  "sécurité du patient",
  "sécurité patient",
  "reprise manuelle",
  "chirurgien",
  "préserver",
  "protéger",
];

export default function ResponsePanel({ title, variant, response, isStreaming }) {
  const scrollRef = useRef(null);
  const isSafe = variant === "safe";

  useEffect(() => {
    if (scrollRef.current && isStreaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, isStreaming]);

  const borderColor = isSafe ? "border-safe-500/20" : "border-danger-500/20";
  const headerBg = isSafe ? "bg-safe-50" : "bg-danger-50";
  const headerBorder = isSafe ? "border-safe-500/10" : "border-danger-500/10";
  const dotColor = isSafe ? "bg-safe-500" : "bg-danger-500";
  const titleColor = isSafe ? "text-safe-700" : "text-danger-700";
  const badge = isSafe
    ? { text: "sain", bg: "bg-safe-100", color: "text-safe-600" }
    : { text: "injecté", bg: "bg-danger-100", color: "text-danger-600" };

  return (
    <div className={'bg-white rounded-xl border ' + borderColor + ' shadow-sm overflow-hidden flex flex-col'}>
      <div className={'px-5 py-3 ' + headerBg + ' border-b ' + headerBorder + ' flex items-center gap-2'}>
        <span className={'w-2.5 h-2.5 rounded-full ' + dotColor + ' ' + (isStreaming ? "animate-pulse" : "")} />
        <span className={'font-medium ' + titleColor + ' text-sm'}>{title}</span>
        <span className={'ml-auto text-xs ' + badge.color + ' ' + badge.bg + ' px-2 py-0.5 rounded'}>
          {badge.text}
        </span>
        {isStreaming && (
          <span className="text-xs text-gray-400 animate-pulse">streaming...</span>
        )}
      </div>

      <div ref={scrollRef} className="p-5 flex-1 overflow-y-auto max-h-[500px] min-h-[200px]">
        {!response && !isStreaming && (
          <p className="text-gray-300 text-sm italic text-center py-8">
            En attente d'exécution...
          </p>
        )}
        {(response || isStreaming) && (
          <div className={'text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ' + (isStreaming ? "cursor-blink" : "")}>
            {highlightResponse(response, isSafe)}
          </div>
        )}
      </div>
    </div>
  );
}

function highlightResponse(text, isSafe) {
  if (!text) return null;
  const keywords = isSafe ? SAFE_KEYWORDS : DANGER_KEYWORDS;
  const className = isSafe
    ? "bg-safe-100 text-safe-700 px-1 rounded font-semibold"
    : "bg-danger-100 text-danger-700 px-1 rounded font-semibold";

  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = -1;
    let earliestKw = "";

    for (const kw of keywords) {
      const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestKw = remaining.slice(idx, idx + kw.length);
      }
    }

    if (earliest === -1) {
      parts.push(remaining);
      break;
    }

    if (earliest > 0) parts.push(remaining.slice(0, earliest));
    parts.push(
      <mark key={parts.length} className={className}>
        {earliestKw}
      </mark>
    );
    remaining = remaining.slice(earliest + earliestKw.length);
  }

  return parts;
}
