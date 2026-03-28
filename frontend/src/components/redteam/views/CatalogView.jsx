// View wrapper for CatalogTab in the Command Center layout
import { useTranslation } from 'react-i18next';
import CatalogTab from '../CatalogTab';

export default function CatalogView() {
  var { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.catalog.title')}</h1>
        <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">52 templates</span>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        {t('redteam.view.catalog.desc')}
      </p>
      <CatalogTab />
    </div>
  );
}
