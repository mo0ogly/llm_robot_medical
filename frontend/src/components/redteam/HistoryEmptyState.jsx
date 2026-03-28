// frontend/src/components/redteam/HistoryEmptyState.jsx
import { useTranslation } from 'react-i18next';
import { ShieldOff, SearchX } from 'lucide-react';

export default function HistoryEmptyState({ filtered }) {
  var { t } = useTranslation();

  var Icon = filtered ? SearchX : ShieldOff;
  var title = filtered
    ? t('redteam.history.noResults')
    : t('redteam.history.empty');
  var desc = filtered
    ? t('redteam.history.noResultsDesc')
    : t('redteam.history.emptyDesc');

  return (
    <div className="text-center py-12">
      <Icon size={32} className="mx-auto mb-3 text-gray-700" />
      <p className="text-gray-600 text-xs">{title}</p>
      <p className="text-gray-700 text-[10px] mt-2">{desc}</p>
    </div>
  );
}
