// View wrapper for PlaygroundTab in the Command Center layout
import { useTranslation } from 'react-i18next';
import PlaygroundTab from '../PlaygroundTab';

export default function PlaygroundView() {
  var { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.playground.title')}</h1>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        {t('redteam.view.playground.desc')}
      </p>
      <PlaygroundTab />
    </div>
  );
}
