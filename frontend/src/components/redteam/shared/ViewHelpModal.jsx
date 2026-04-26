// frontend/src/components/redteam/shared/ViewHelpModal.jsx
// Reusable help modal for all Red Team Lab views
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  X, HelpCircle, BookOpen, Target, Lightbulb, Keyboard,
  Shield, Database, BarChart2, Play, Terminal, Layers,
  Search, Clock, History, TreePine, Beaker
} from 'lucide-react';

var ICON_MAP = {
  catalog:    { icon: Search,      color: 'text-orange-400' },
  defense:    { icon: Shield,      color: 'text-emerald-400' },
  exercise:   { icon: Target,      color: 'text-red-400' },
  logs:       { icon: Terminal,     color: 'text-red-400' },
  analysis:   { icon: BarChart2,   color: 'text-cyan-400' },
  playground: { icon: Beaker,      color: 'text-yellow-400' },
  rag:        { icon: Database,    color: 'text-blue-400' },
  explorer:   { icon: TreePine,    color: 'text-green-400' },
  scenarios:  { icon: Layers,      color: 'text-purple-400' },
  timeline:   { icon: Clock,       color: 'text-amber-400' },
  history:    { icon: History,     color: 'text-indigo-400' },
};

var SECTION_COLORS = [
  'text-red-400',
  'text-cyan-400',
  'text-yellow-400',
  'text-green-400',
  'text-purple-400',
  'text-blue-400',
  'text-orange-400',
];

var SECTION_ICONS = [
  BookOpen,
  Target,
  Lightbulb,
  Keyboard,
  Shield,
  Layers,
  Play,
];

// VIEW_SECTIONS defines how many sections and items each view has
var VIEW_SECTIONS = {
  catalog:    [4, 4, 3, 3],
  defense:    [3, 4, 3, 3],
  exercise:   [3, 4, 3, 3],
  logs:       [3, 3, 3, 3],
  analysis:   [4, 3, 3, 3],
  playground: [3, 3, 3, 3],
  rag:        [3, 3, 3, 3],
  explorer:   [3, 3, 3, 3],
  scenarios:  [3, 4, 3, 3],
  timeline:   [3, 3, 3, 3],
  history:    [3, 3, 3, 3],
};

export default function ViewHelpModal({ viewId, onClose }) {
  var { t } = useTranslation();
  var cfg = ICON_MAP[viewId] || { icon: HelpCircle, color: 'text-neutral-400' };
  var IconComp = cfg.icon;
  var sectionCounts = VIEW_SECTIONS[viewId] || [3, 3, 3];
  var prefix = 'redteam.help.' + viewId;

  var handleOverlayClick = function(e) {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-3xl mx-4 bg-neutral-950 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2">
            <IconComp size={16} className={cfg.color} />
            <span className="font-bold text-sm text-white">{t(prefix + '.title')}</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 overflow-y-auto font-mono text-xs" style={{ maxHeight: '75vh' }}>
          {/* Intro */}
          <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg">
            <p className="text-neutral-300 text-[11px] leading-relaxed">{t(prefix + '.intro')}</p>
          </div>

          {/* Sections */}
          {sectionCounts.map(function(itemCount, sIdx) {
            var sNum = sIdx + 1;
            var sColor = SECTION_COLORS[sIdx % SECTION_COLORS.length];
            var SIcon = SECTION_ICONS[sIdx % SECTION_ICONS.length];
            return (
              <div key={sIdx} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <SIcon size={12} className={sColor} />
                  <span className={'font-bold uppercase tracking-wider text-[11px] ' + sColor}>
                    {t(prefix + '.s' + sNum + '.title')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: itemCount }).map(function(_, iIdx) {
                    var iNum = iIdx + 1;
                    return (
                      <div key={iIdx} className="flex gap-3 p-2.5 bg-black/40 rounded border border-neutral-900 hover:border-neutral-700 transition-colors">
                        <span className="w-44 shrink-0 text-[10px] font-bold text-neutral-300">
                          {t(prefix + '.s' + sNum + '.i' + iNum + '.label')}
                        </span>
                        <span className="text-neutral-500 text-[10px] leading-relaxed flex-1">
                          {t(prefix + '.s' + sNum + '.i' + iNum + '.desc')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded text-[9px] text-neutral-500 flex items-center justify-between">
            <span>{t('redteam.help.footer.label')}</span>
            <span className="text-neutral-600">{t('redteam.help.footer.close')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
