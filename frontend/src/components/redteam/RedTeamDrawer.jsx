// frontend/src/components/redteam/RedTeamDrawer.jsx
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import CatalogTab from './CatalogTab';
import PlaygroundTab from './PlaygroundTab';
import CampaignTab from './CampaignTab';
import HistoryTab from './HistoryTab';
import ScenarioTab from './ScenarioTab';

const TABS = ['CATALOGUE', 'PLAYGROUND', 'CAMPAGNE', 'HISTORIQUE', 'SCENARIOS'];

export default function RedTeamDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('CATALOGUE');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playgroundInit, setPlaygroundInit] = useState({ category: 'injection', message: '' });

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
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-mono font-bold text-sm tracking-wider">
            RED TEAM LAB
          </span>
          <span className="text-[#00ff41] font-mono text-xs opacity-50">v1.0</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Close"
          >
            <X size={14} />
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
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300">
        {activeTab === 'CATALOGUE' && (
          <CatalogTab
            onSwitchToPlayground={(cat, msg) => {
              setPlaygroundInit({ category: cat, message: msg });
              setActiveTab('PLAYGROUND');
            }}
            onLaunchCampaign={() => setActiveTab('CAMPAGNE')}
          />
        )}
        {activeTab === 'PLAYGROUND' && (
          <PlaygroundTab
            initialCategory={playgroundInit.category}
            initialMessage={playgroundInit.message}
          />
        )}
        {activeTab === 'CAMPAGNE' && <CampaignTab />}
        {activeTab === 'HISTORIQUE' && <HistoryTab />}
        {activeTab === 'SCENARIOS' && <ScenarioTab />}
      </div>
    </div>
  );
}
