import { useEffect, useRef } from "react";

export default function ComparePanel({ label, variant, tokens, isStreaming }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tokens]);

  const isSafe = variant === "safe";

  return (
    <div className={'flex-1 flex flex-col border rounded overflow-hidden min-h-0 ' + (isSafe ? "border-green-500/30" : "border-red-500/30")}>
      {/* Badge */}
      <div className={'px-3 py-1 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-widest shrink-0 ' + (isSafe ? "bg-green-900/30 text-green-400 border-b border-green-500/30" : "bg-red-900/30 text-red-400 border-b border-red-500/30")}>
        <div className={'w-1.5 h-1.5 rounded-full ' + (isSafe ? "bg-green-500" : "bg-red-500") + ' ' + (isStreaming ? "animate-pulse" : "")} />
        {label}
      </div>

      {/* Streaming text */}
      <div className="flex-1 p-2 overflow-y-auto bg-slate-950 font-mono text-[10px] whitespace-pre-wrap leading-relaxed text-slate-200">
        {tokens || (isStreaming ? <span className="animate-pulse text-slate-500">...</span> : <span className="text-slate-600 italic">—</span>)}
        {isStreaming && tokens && <span className="animate-pulse text-blue-400">|</span>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
