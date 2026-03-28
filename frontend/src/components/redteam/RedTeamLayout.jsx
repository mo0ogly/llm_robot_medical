import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Database, Swords, Activity, Lock, Terminal, BarChart2, FileText, Target, FlaskConical, BookOpen, Beaker, Clock, History } from 'lucide-react';

export default function RedTeamLayout() {
  var { t, i18n } = useTranslation();

  var navItems = [
    // --- Infrastructure ---
    { id: 'rag', label: t('redteam.nav.rag', { defaultValue: 'RAG Ingestion' }), icon: <Database size={20} />, path: '/redteam/rag' },
    // Payload Forge removed — merged into Adversarial Studio
    // --- From Drawer: CATALOG, STUDIO, PLAYGROUND ---
    { id: 'catalog', label: t('redteam.nav.catalog', { defaultValue: 'Attack Catalog' }), icon: <BookOpen size={20} />, path: '/redteam/catalog' },
    { id: 'studio', label: t('redteam.nav.studio', { defaultValue: 'Adversarial Studio' }), icon: <Beaker size={20} />, path: '/redteam/studio' },
    { id: 'playground', label: t('redteam.nav.playground', { defaultValue: 'Injection Playground' }), icon: <Terminal size={20} />, path: '/redteam/playground' },
    // --- Operations ---
    { id: 'exercise', label: t('redteam.nav.exercise', { defaultValue: 'Live Exercise' }), icon: <Activity size={20} />, path: '/redteam/exercise' },
    { id: 'scenarios', label: t('redteam.nav.scenarios', { defaultValue: 'Kill-Chain Scenarios' }), icon: <Target size={20} />, path: '/redteam/scenarios' },
    { id: 'campaign', label: t('redteam.nav.campaign', { defaultValue: 'Formal Campaign' }), icon: <FlaskConical size={20} />, path: '/redteam/campaign' },
    // --- Defense & Analysis ---
    { id: 'defense', label: t('redteam.nav.defense', { defaultValue: 'Aegis Defenses' }), icon: <Lock size={20} />, path: '/redteam/defense' },
    { id: 'timeline', label: t('redteam.nav.timeline', { defaultValue: 'Timeline' }), icon: <Clock size={20} />, path: '/redteam/timeline' },
    { id: 'logs', label: t('redteam.nav.logs', { defaultValue: 'Telemetry Logs' }), icon: <Terminal size={20} />, path: '/redteam/logs' },
    { id: 'analysis', label: t('redteam.nav.analysis', { defaultValue: 'Analytics' }), icon: <BarChart2 size={20} />, path: '/redteam/analysis' },
    // --- Results ---
    { id: 'history', label: t('redteam.nav.history', { defaultValue: 'History' }), icon: <History size={20} />, path: '/redteam/history' },
    { id: 'results', label: t('redteam.nav.results', { defaultValue: 'Results Explorer' }), icon: <FileText size={20} />, path: '/redteam/results' },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="text-red-500" size={28} />
            <div>
              <h1 className="font-bold text-lg tracking-wider text-red-500">AEGIS LAB</h1>
              <p className="text-xs text-neutral-500 font-mono">COMMAND CENTER v2.0</p>
            </div>
          </div>
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-neutral-600 font-mono uppercase">LANG:</span>
            <div className="flex gap-1">
              {['en', 'fr', 'br'].map(function(lang) {
                var isActive = i18n.language === lang;
                return (
                  <button
                    key={lang}
                    onClick={function() { i18n.changeLanguage(lang); }}
                    className={'px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all ' +
                      (isActive
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300')}
                  >
                    {lang.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(function(item) {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={function(props) {
                      return 'flex items-center gap-3 px-4 py-3 rounded-md transition-colors ' +
                        (props.isActive
                          ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100');
                    }}
                  >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <NavLink to="/" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors">
            &larr; {t('redteam.nav.return', { defaultValue: 'Return to Digital Twin' })}
          </NavLink>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-neutral-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.03)_0,transparent_100%)] pointer-events-none"></div>
        <main className="h-full relative z-10 overflow-y-auto w-full p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
