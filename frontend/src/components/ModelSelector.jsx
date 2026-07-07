import React, { useState, useEffect, useCallback } from 'react';
import { Cpu } from 'lucide-react';

// AI engine selector — lists the configured AI backends (GET /api/ai/backends)
// and switches the ACTIVE one (POST /api/ai/active). The active backend drives
// the medical/cyber AI.
export default function ModelSelector({ currentModel, onModelChange }) {
  const [backends, setBackends] = useState([]);
  const [active, setActive] = useState('');

  const load = useCallback(() => {
    fetch('/api/ai/backends')
      .then((res) => res.json())
      .then((data) => {
        const list = data.backends || [];
        setBackends(list);
        const act = data.active || (list[0] && list[0].id) || '';
        setActive(act);
        const cur = list.find((b) => b.id === act);
        if (cur && onModelChange) onModelChange(cur.model);
      })
      .catch((err) => console.error('Failed to fetch AI backends', err));
  }, [onModelChange]);

  useEffect(() => { load(); }, [load]);

  const switchBackend = (id) => {
    setActive(id);
    fetch('/api/ai/active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => {
        const cur = backends.find((b) => b.id === id);
        if (cur && onModelChange) onModelChange(cur.model);
      })
      .catch((err) => console.error('Failed to switch AI backend', err));
  };

  return (
    <div className="flex items-center gap-2 text-[9px] font-mono">
      <Cpu size={12} className="text-purple-400" />
      <select
        value={active}
        onChange={(e) => switchBackend(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-sm transition-all max-w-[200px]"
        title="Moteur IA actif (INTERNAL-AI / providers)"
      >
        {backends.map((b) => (
          <option key={b.id} value={b.id}>{b.model}</option>
        ))}
        {backends.length === 0 && <option value="">Aucun moteur IA configuré</option>}
      </select>
    </div>
  );
}
