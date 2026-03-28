// View wrapper for AdversarialStudio v2.0 in the Command Center layout
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AdversarialStudio from '../AdversarialStudio';

export default function StudioView() {
  var { t } = useTranslation();
  var location = useLocation();
  var initPayload = location.state && location.state.payload ? location.state.payload : null;
  var initCategory = location.state && location.state.category ? location.state.category : null;
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-neutral-100">{t('redteam.view.studio.title')}</h1>
        <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-[9px] font-mono font-bold rounded border border-red-500/30">
          v2.0
        </span>
      </div>
      <p className="text-xs text-neutral-500 mb-5 font-mono leading-relaxed max-w-3xl">
        {t('redteam.view.studio.desc')}
      </p>
      <AdversarialStudio initialPayload={initPayload} initialCategory={initCategory} />
    </div>
  );
}
