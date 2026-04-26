// View wrapper for ScenarioTab in the Command Center layout
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import ScenarioTab from '../ScenarioTab';
import ViewHelpModal from '../shared/ViewHelpModal';

export default function ScenariosView() {
  var { t } = useTranslation();
  var [showHelp, setShowHelp] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.scenarios.title')}</h1>
          <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">{t('redteam.view.scenarios.badge')}</span>
        </div>
        <button onClick={function() { setShowHelp(true); }} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all" title={t('redteam.help.scenarios.title')}>
          <HelpCircle size={18} />
        </button>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        {t('redteam.view.scenarios.desc')}
      </p>
      <ScenarioTab />
      {showHelp && <ViewHelpModal viewId="scenarios" onClose={function() { setShowHelp(false); }} />}
    </div>
  );
}
