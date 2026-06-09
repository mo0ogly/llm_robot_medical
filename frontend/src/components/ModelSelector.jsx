import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

export default function ModelSelector({ currentModel, onModelChange }) {
  const [models, setModels] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8042/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.models || []);
        if (!currentModel && data.default) {
          onModelChange(data.default);
        }
      })
      .catch(err => console.error("Failed to fetch models", err));
  }, [currentModel, onModelChange]);

  return (
    <div className="flex items-center gap-2 text-[9px] font-mono">
      <Cpu size={12} className="text-purple-400" />
      <select 
        value={currentModel || ""} 
        onChange={e => onModelChange(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-sm transition-all"
        title="Select Da Vinci Core Model"
      >
        {models.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
        {models.length === 0 && <option value="llama3.2:latest">llama3.2:latest</option>}
      </select>
    </div>
  );
}
