// frontend/src/components/redteam/RedTeamDrawer.jsx
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CatalogTab from './CatalogTab';
import AdversarialStudio from './AdversarialStudio';
import PlaygroundTab from './PlaygroundTab';
import GlobalTimeline from './GlobalTimeline';
import CampaignTab from './CampaignTab';
import HistoryTab from './HistoryTab';
import ScenarioTab from './ScenarioTab';

const TABS = ['CATALOG', 'STUDIO', 'PLAYGROUND', 'TIMELINE', 'CAMPAIGN', 'HISTORY', 'SCENARIOS'];

export default function RedTeamDrawer({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('CATALOG');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playgroundInit, setPlaygroundInit] = useState({ category: 'CATALOG', message: '' });
  const [studioInit, setStudioInit] = useState({ category: null, message: null });

  return (
    <div
      className={`fixed top-0 right-0 h-full z-40 flex flex-col
                  bg-[#0a0a0a] border-l border-red-900/50 shadow-2xl shadow-black/80
                  transition-all duration-300
                  ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}
                  ${isFullscreen ? 'w-full' : 'w-[60vw] min-w-[500px]'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-red-900/30">
        <div className="flex items-center gap-3">
          <span className="text-red-500 font-mono font-bold text-sm tracking-wider">
            {t('redteam.drawer.title')}
          </span>
          <span className="text-[#00ff41] font-mono text-xs opacity-50">v2.0</span>
          <div className="h-4 w-px bg-neutral-700" />
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-black border-2 border-red-500/60 text-sm text-red-400 font-mono font-bold rounded px-3 py-1 outline-none hover:border-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="br">BR</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={t('redteam.tooltip.fullscreen', { defaultValue: 'Toggle fullscreen' })}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-all"
            aria-label={t('redteam.tooltip.close', { defaultValue: 'Close' })}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-red-900/30">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 font-mono text-xs tracking-wider transition-colors
                       ${activeTab === tab
                         ? 'text-[#00ff41] border-b-2 border-[#00ff41] bg-[#00ff41]/5'
                         : 'text-gray-600 hover:text-gray-400'}`}
          >
            {t(`redteam.tabs.${tab.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300">
        {activeTab === 'CATALOG' && (
          <CatalogTab
            onSwitchToPlayground={(cat, msg) => {
              setStudioInit({ category: cat, message: msg });
              setActiveTab('STUDIO');
            }}
            onLaunchCampaign={() => setActiveTab('CAMPAIGN')}
          />
        )}
        {activeTab === 'STUDIO' && <AdversarialStudio initialPayload={studioInit.message} initialCategory={studioInit.category} />}
        {activeTab === 'PLAYGROUND' && (
          <PlaygroundTab
            initialCategory={playgroundInit.category}
            initialMessage={playgroundInit.message}
          />
        )}
        {activeTab === 'TIMELINE' && <GlobalTimeline />}
        {activeTab === 'CAMPAIGN' && <CampaignTab />}
        {activeTab === 'HISTORY' && <HistoryTab />}
        {activeTab === 'SCENARIOS' && <ScenarioTab />}
      </div>
    </div>
  );
}
