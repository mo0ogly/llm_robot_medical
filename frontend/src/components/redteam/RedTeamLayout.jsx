import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert, Database, Activity, Lock, Terminal, BarChart2,
  FileText, Target, FlaskConical, BookOpen, Beaker, Clock, History,
  FlaskRound, Menu, X, ChevronLeft
} from 'lucide-react';
import { prefetch } from '../../hooks/useFetchWithCache';

var NAV_GROUPS = [
  {
    label: 'Infrastructure',
    items: [
      { id: 'rag', key: 'redteam.nav.rag', fallback: 'RAG Ingestion', icon: Database, path: '/redteam/rag' },
    ]
  },
  {
    label: 'Forge',
    items: [
      { id: 'catalog',    key: 'redteam.nav.catalog',    fallback: 'Attack Catalog',       icon: BookOpen,    path: '/redteam/catalog' },
      { id: 'studio',     key: 'redteam.nav.studio',     fallback: 'Adversarial Studio',   icon: Beaker,      path: '/redteam/studio' },
      { id: 'playground', key: 'redteam.nav.playground', fallback: 'Injection Playground', icon: Terminal,    path: '/redteam/playground' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'exercise',  key: 'redteam.nav.exercise',  fallback: 'Live Exercise',        icon: Activity,     path: '/redteam/exercise' },
      { id: 'scenarios', key: 'redteam.nav.scenarios', fallback: 'Kill-Chain Scenarios', icon: Target,       path: '/redteam/scenarios' },
      { id: 'campaign',  key: 'redteam.nav.campaign',  fallback: 'Formal Campaign',      icon: FlaskConical, path: '/redteam/campaign' },
    ]
  },
  {
    label: 'Defense & Analysis',
    items: [
      { id: 'defense',  key: 'redteam.nav.defense',  fallback: 'Aegis Defenses', icon: Lock,      path: '/redteam/defense' },
      { id: 'timeline', key: 'redteam.nav.timeline', fallback: 'Timeline',        icon: Clock,     path: '/redteam/timeline' },
      { id: 'logs',     key: 'redteam.nav.logs',     fallback: 'Telemetry Logs', icon: Terminal,  path: '/redteam/logs' },
      { id: 'analysis', key: 'redteam.nav.analysis', fallback: 'Analytics',      icon: BarChart2, path: '/redteam/analysis' },
    ]
  },
  {
    label: 'Results',
    items: [
      { id: 'history',     key: 'redteam.nav.history',     fallback: 'History',          icon: History,    path: '/redteam/history' },
      { id: 'results',     key: 'redteam.nav.results',     fallback: 'Results Explorer', icon: FileText,   path: '/redteam/results' },
      { id: 'experiments', key: 'redteam.nav.experiments', fallback: 'Experiments',      icon: FlaskRound, path: '/redteam/experiments' },
    ]
  },
];

function NavItem({ item, onClick }) {
  var { t } = useTranslation();
  var Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={function(props) {
        return 'rt-nav-link ' + (props.isActive ? 'rt-nav-link--active' : '');
      }}
    >
      <Icon size={14} className="rt-nav-icon flex-shrink-0" />
      <span className="truncate">{t(item.key, { defaultValue: item.fallback })}</span>
    </NavLink>
  );
}

function SidebarContent({ onNav }) {
  var { t, i18n } = useTranslation();
  return (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className="rt-sidebar-brand">
        <div className="flex items-center gap-3">
          <div className="rt-brand-icon">
            <ShieldAlert size={14} />
          </div>
          <div>
            <div className="rt-brand-name">AEGIS LAB</div>
            <div className="rt-brand-sub">Command Center</div>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 mt-4">
          <span className="rt-label-caps">lang</span>
          <div className="flex gap-1">
            {['en', 'fr', 'br'].map(function(lang) {
              var active = i18n.language === lang;
              return (
                <button
                  key={lang}
                  onClick={function() { i18n.changeLanguage(lang); }}
                  className={'rt-lang-btn ' + (active ? 'rt-lang-btn--active' : '')}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_GROUPS.map(function(group) {
          return (
            <div key={group.label} className="rt-nav-group">
              <div className="rt-nav-group-label">{group.label}</div>
              {group.items.map(function(item) {
                return <NavItem key={item.id} item={item} onClick={onNav} />;
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="rt-sidebar-footer">
        <NavLink to="/" className="rt-back-link">
          <ChevronLeft size={13} />
          <span>{t('redteam.nav.return', { defaultValue: 'Return to Digital Twin' })}</span>
        </NavLink>
      </div>
    </div>
  );
}

export default function RedTeamLayout() {
  var [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(function() {
    prefetch('/api/redteam/catalog');
    prefetch('/api/redteam/templates');
    prefetch('/api/redteam/scenarios');
    prefetch('/api/redteam/taxonomy/coverage');
  }, []);

  useEffect(function() {
    function onKey(e) { if (e.key === 'Escape') setDrawerOpen(false); }
    document.addEventListener('keydown', onKey);
    return function() { document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <>
      <style>{`
        /* ── Design tokens ────────────────────────────────────────────────── */
        .rt-root {
          --paper-0: #ffffff;
          --paper-1: #fafaf8;
          --paper-2: #f5f5f1;
          --paper-3: #eeedea;
          --paper-4: #dcdbd6;
          --ink-0: #0a0a0a;
          --ink-1: #1f1f1f;
          --ink-2: #424242;
          --ink-3: #737373;
          --ink-4: #a3a3a3;
          --ink-5: #d4d4d4;
          --critical: #c41e3a;
          --critical-dim: #8b1525;
          --critical-tint: #fef2f4;
          --signal: #1d4ed8;
          --border: rgba(10,10,10,0.07);
          --border-strong: rgba(10,10,10,0.13);
          --shadow-sm: 0 1px 2px rgba(10,10,10,0.04);
          --shadow-md: 0 4px 16px rgba(10,10,10,0.07), 0 0 0 1px var(--border);
          --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', 'Fira Code', Menlo, monospace;
          --font-display: 'Fraunces', 'IBM Plex Serif', Georgia, serif;
        }

        /* ── Layout ───────────────────────────────────────────────────────── */
        .rt-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--paper-1);
          font-family: var(--font-sans);
          color: var(--ink-1);
          -webkit-font-smoothing: antialiased;
        }
        .rt-sidebar {
          width: 232px;
          flex-shrink: 0;
          background: var(--paper-0);
          border-right: 1px solid var(--border-strong);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .rt-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
        .rt-content { flex: 1; overflow-y: auto; overflow-x: hidden; }
        .rt-content-inner { padding: 2rem; max-width: 1440px; margin: 0 auto; }

        /* ── Brand ────────────────────────────────────────────────────────── */
        .rt-sidebar-brand {
          padding: 1.25rem 1rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .rt-brand-icon {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 7px;
          background: var(--critical-tint);
          border: 1px solid rgba(196,30,58,0.15);
          color: var(--critical);
          flex-shrink: 0;
        }
        .rt-brand-name {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-0);
        }
        .rt-brand-sub {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--ink-4);
          letter-spacing: 0.05em;
          margin-top: 1px;
        }

        /* ── Language ─────────────────────────────────────────────────────── */
        .rt-label-caps {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink-5);
        }
        .rt-lang-btn {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid var(--border-strong);
          color: var(--ink-3);
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
        }
        .rt-lang-btn:hover { color: var(--ink-1); border-color: var(--ink-5); }
        .rt-lang-btn--active { background: var(--critical-tint); border-color: rgba(196,30,58,0.25); color: var(--critical); }

        /* ── Nav ──────────────────────────────────────────────────────────── */
        .rt-nav-group { margin-bottom: 1.25rem; }
        .rt-nav-group-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink-4);
          padding: 0 0.5rem;
          margin-bottom: 0.25rem;
        }
        .rt-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.5rem;
          border-radius: 5px;
          font-size: 0.82rem;
          font-weight: 400;
          color: var(--ink-2);
          text-decoration: none;
          transition: all 0.12s;
          margin-bottom: 1px;
          border-left: 2px solid transparent;
        }
        .rt-nav-link:hover { color: var(--ink-0); background: var(--paper-2); }
        .rt-nav-link--active {
          color: var(--critical);
          background: var(--critical-tint);
          border-left-color: var(--critical);
          font-weight: 500;
        }
        .rt-nav-icon { color: var(--ink-4); transition: color 0.12s; }
        .rt-nav-link:hover .rt-nav-icon { color: var(--ink-2); }
        .rt-nav-link--active .rt-nav-icon { color: var(--critical); }

        /* ── Sidebar footer ───────────────────────────────────────────────── */
        .rt-sidebar-footer {
          padding: 0.875rem 1rem;
          border-top: 1px solid var(--border);
        }
        .rt-back-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--ink-4);
          text-decoration: none;
          transition: color 0.12s;
        }
        .rt-back-link:hover { color: var(--ink-1); }

        /* ── Top bar (mobile) ─────────────────────────────────────────────── */
        .rt-topbar {
          display: none;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1rem;
          height: 52px;
          flex-shrink: 0;
          background: var(--paper-0);
          border-bottom: 1px solid var(--border-strong);
        }
        @media (max-width: 1023px) {
          .rt-sidebar { display: none; }
          .rt-topbar { display: flex; }
          .rt-content-inner { padding: 1.25rem; }
        }

        /* ── Mobile drawer ────────────────────────────────────────────────── */
        .rt-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(10,10,10,0.35);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }
        .rt-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 51;
          width: 264px;
          background: var(--paper-0);
          border-right: 1px solid var(--border-strong);
          box-shadow: 4px 0 24px rgba(10,10,10,0.1);
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .rt-drawer-close {
          position: absolute; top: 0.875rem; right: 0.875rem;
          padding: 4px;
          border-radius: 5px;
          border: 1px solid var(--border-strong);
          color: var(--ink-3);
          background: transparent;
          cursor: pointer;
          transition: all 0.12s;
          line-height: 0;
        }
        .rt-drawer-close:hover { color: var(--ink-0); background: var(--paper-2); }

        /* ── Mobile menu button ───────────────────────────────────────────── */
        .rt-menu-btn {
          padding: 6px;
          border-radius: 5px;
          border: 1px solid var(--border-strong);
          color: var(--ink-2);
          background: transparent;
          cursor: pointer;
          transition: all 0.12s;
          line-height: 0;
        }
        .rt-menu-btn:hover { color: var(--ink-0); background: var(--paper-2); }

        /* ── Sidebar scrollbar ────────────────────────────────────────────── */
        .rt-sidebar nav::-webkit-scrollbar,
        .rt-drawer nav::-webkit-scrollbar { width: 3px; }
        .rt-sidebar nav::-webkit-scrollbar-track,
        .rt-drawer nav::-webkit-scrollbar-track { background: transparent; }
        .rt-sidebar nav::-webkit-scrollbar-thumb,
        .rt-drawer nav::-webkit-scrollbar-thumb { background: var(--ink-5); border-radius: 2px; }
      `}</style>

      <div className="rt-root">

        {/* Desktop sidebar */}
        <aside className="rt-sidebar">
          <SidebarContent onNav={function() {}} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <div className="rt-backdrop" onClick={function() { setDrawerOpen(false); }} />
            <div className="rt-drawer">
              <button className="rt-drawer-close" onClick={function() { setDrawerOpen(false); }} aria-label="Close navigation">
                <X size={15} />
              </button>
              <SidebarContent onNav={function() { setDrawerOpen(false); }} />
            </div>
          </>
        )}

        {/* Main */}
        <div className="rt-main">

          {/* Mobile top bar */}
          <header className="rt-topbar">
            <button className="rt-menu-btn" onClick={function() { setDrawerOpen(true); }} aria-label="Open navigation">
              <Menu size={17} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={15} style={{ color: 'var(--critical)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-0)' }}>
                AEGIS LAB
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="rt-content">
            <div className="rt-content-inner">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
