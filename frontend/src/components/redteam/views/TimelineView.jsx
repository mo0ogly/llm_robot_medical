// View wrapper for GlobalTimeline in the Command Center layout
import { useTranslation } from 'react-i18next';
import GlobalTimeline from '../GlobalTimeline';

export default function TimelineView() {
  var { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.timeline.title')}</h1>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        {t('redteam.view.timeline.desc')}
      </p>
      <GlobalTimeline />
    </div>
  );
}
