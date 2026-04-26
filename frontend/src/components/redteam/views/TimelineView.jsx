// View wrapper for GlobalTimeline in the Command Center layout
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import GlobalTimeline from '../GlobalTimeline';
import ViewHelpModal from '../shared/ViewHelpModal';

export default function TimelineView() {
  var { t } = useTranslation();
  var [showHelp, setShowHelp] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.timeline.title')}</h1>
        </div>
        <button onClick={function() { setShowHelp(true); }} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all" title={t('redteam.help.timeline.title')}>
          <HelpCircle size={18} />
        </button>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        {t('redteam.view.timeline.desc')}
      </p>
      <GlobalTimeline />
      {showHelp && <ViewHelpModal viewId="timeline" onClose={function() { setShowHelp(false); }} />}
    </div>
  );
}
