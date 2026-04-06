// View wrapper for CampaignTab in the Command Center layout
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CampaignTab from '../CampaignTab';
import useFetchWithCache from '../../../hooks/useFetchWithCache';

export default function CampaignView() {
  var { t } = useTranslation();
  var { data: catalogData } = useFetchWithCache('/api/redteam/catalog');
  var count = useMemo(function() {
    if (!catalogData) return 0;
    var total = 0;
    Object.values(catalogData).forEach(function(arr) { total += arr.length; });
    return total;
  }, [catalogData]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.campaign.title')}</h1>
        <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">
          {count + ' ' + t('redteam.view.catalog.badge_templates')}
        </span>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        {t('redteam.view.campaign.desc')}
      </p>
      <CampaignTab />
    </div>
  );
}
