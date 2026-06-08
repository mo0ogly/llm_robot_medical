import React, { useState, useEffect } from 'react';
import { Database, Loader2, Server } from 'lucide-react';

export default function ModelSelector({ currentModel, onModelChange }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          // Auto-select if nothing is selected or if current is not in list
          if (!currentModel || !data.models.includes(currentModel)) {
            // First check localStorage
            const saved = localStorage.getItem('selectedDaVinciModel');
            if (saved && data.models.includes(saved)) {
              onModelChange(saved);
            } else if (data.default && data.models.includes(data.default)) {
              onModelChange(data.default);
            } else {
              onModelChange(data.models[0]);
            }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch models:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const newModel = e.target.value;
    localStorage.setItem('selectedDaVinciModel', newModel);
    onModelChange(newModel);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded border border-slate-700 text-[10px] text-slate-400 font-mono">
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading...
      </div>
    );
  }

  if (models.length === 0) {
    return null; // Fallback to default if no models found (or backend down)
  }

  return (
    <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">
      <Server className="w-3 h-3 text-blue-400" />
      <select 
        value={currentModel || ''} 
        onChange={handleChange}
        className="bg-transparent border-none outline-none cursor-pointer max-w-[120px] truncate uppercase"
        title="Switch AI Model"
      >
        {models.map(m => (
          <option key={m} value={m} className="bg-slate-900 text-slate-300">{m}</option>
        ))}
      </select>
    </div>
  );
}
