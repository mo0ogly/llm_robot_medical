import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ShieldAlert, Database, Swords, Activity, Lock, Terminal, BarChart2, FileText, Target, FlaskConical } from 'lucide-react';

export default function RedTeamLayout() {
  const navItems = [
    { id: 'rag', label: 'RAG Ingestion', icon: <Database size={20} />, path: '/redteam/rag' },
    { id: 'attack', label: 'Attack Forge', icon: <Swords size={20} />, path: '/redteam/attack' },
    { id: 'exercise', label: 'Live Exercise', icon: <Activity size={20} />, path: '/redteam/exercise' },
    { id: 'defense', label: 'Aegis Defenses', icon: <Lock size={20} />, path: '/redteam/defense' },
    { id: 'logs', label: 'Telemetry Logs', icon: <Terminal size={20} />, path: '/redteam/logs' },
    { id: 'analysis', label: 'Analytics', icon: <BarChart2 size={20} />, path: '/redteam/analysis' },
    { id: 'scenarios', label: 'Scenarios', icon: <Target size={20} />, path: '/redteam/scenarios' },
    { id: 'campaign', label: 'Campaign', icon: <FlaskConical size={20} />, path: '/redteam/campaign' },
    { id: 'results', label: 'Results Explorer', icon: <FileText size={20} />, path: '/redteam/results' },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={28} />
          <div>
            <h1 className="font-bold text-lg tracking-wider text-red-500">AEGIS LAB</h1>
            <p className="text-xs text-neutral-500 font-mono">COMMAND CENTER</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-neutral-800">
          <NavLink to="/" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors">
            &larr; Return to Digital Twin
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
