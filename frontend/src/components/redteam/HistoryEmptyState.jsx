// frontend/src/components/redteam/HistoryEmptyState.jsx
import { useTranslation } from 'react-i18next';
import { ShieldOff, SearchX, FlaskConical, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HistoryEmptyState({ filtered }) {
  var { t } = useTranslation();

  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
        <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mb-6 border border-neutral-700">
          <SearchX size={32} className="text-neutral-500" />
        </div>
        <h3 className="text-xl font-bold text-neutral-200 mb-2">{t('redteam.catalog.no_results')}</h3>
        <p className="text-neutral-500 max-w-sm text-sm leading-relaxed">
          {t('redteam.catalog.no_results_desc', { defaultValue: 'Try adjusting your filters or search query to find what you are looking for.' })}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-16 px-8 border border-neutral-800 rounded-2xl bg-gradient-to-br from-neutral-900/50 to-neutral-950 shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/20 flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <ShieldOff size={40} className="text-red-500" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
          {t('redteam.history.empty.title')}
        </h2>
        
        <p className="text-neutral-400 max-w-lg text-base leading-relaxed mb-10">
          {t('redteam.history.empty.desc')}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <Link
            to="/redteam/campaign"
            className="group flex flex-col items-start p-4 rounded-xl border border-neutral-700 bg-neutral-800/40 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-3 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-colors">
              <FlaskConical size={18} className="text-neutral-400 group-hover:text-red-400" />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-neutral-200 group-hover:text-white transition-colors">{t('redteam.history.empty.btnCampaign')}</span>
              <ArrowRight size={16} className="text-neutral-600 group-hover:text-red-400 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            to="/redteam/scenarios"
            className="group flex flex-col items-start p-4 rounded-xl border border-neutral-700 bg-neutral-800/40 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-colors">
              <Target size={18} className="text-neutral-400 group-hover:text-cyan-400" />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-neutral-200 group-hover:text-white transition-colors">{t('redteam.history.empty.btnScenario')}</span>
              <ArrowRight size={16} className="text-neutral-600 group-hover:text-cyan-400 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
