import { useTranslation } from "react-i18next";
import { Play, Pause, Square } from "lucide-react";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `T+${min}m${String(sec).padStart(2, "0")}s`;
  return `T+${sec}s`;
}

const SPEEDS = [0.5, 1, 2, 5];

export default function ReplayControls({
  isPlaying, isPaused, speed, progress, currentTime, duration,
  onPlay, onPause, onStop, onSpeedChange, onSeek,
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-700 backdrop-blur-sm px-4 py-2 flex items-center gap-3 font-mono">
      {/* Replay badge */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded shrink-0">
        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">{t("replay.mode.active")}</span>
      </div>

      {/* Play / Pause */}
      <button
        onClick={isPlaying && !isPaused ? onPause : onPlay}
        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
      >
        {isPlaying && !isPaused ? <Pause size={12} /> : <Play size={12} />}
      </button>

      {/* Stop */}
      <button
        onClick={onStop}
        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
      >
        <Square size={12} />
      </button>

      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => onSeek(Number(e.target.value) / 1000)}
          className="flex-1 h-1.5 accent-purple-500 cursor-pointer"
        />
      </div>

      {/* Time */}
      <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap shrink-0">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {/* Speed buttons */}
      <div className="flex gap-0.5 shrink-0">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-1.5 py-0.5 text-[9px] font-bold rounded border transition-colors ${
              speed === s
                ? "bg-purple-500/30 border-purple-500 text-purple-300"
                : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
