// frontend/src/components/redteam/RedTeamFAB.jsx
import { Skull } from 'lucide-react';

export default function RedTeamFAB({ onClick, isOpen }) {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-16 right-6 z-50 flex items-center gap-2 px-4 py-3
                 bg-red-900/90 hover:bg-red-800 border border-red-500/50
                 text-red-400 font-mono text-sm rounded-lg shadow-lg shadow-red-900/50
                 transition-all duration-200 hover:scale-105 hover:shadow-red-800/50"
      title="Red Team Lab (Ctrl+Shift+R)"
      aria-label="Open Red Team Lab"
    >
      <Skull size={20} />
      <span className="hidden sm:inline">RED TEAM</span>
    </button>
  );
}
