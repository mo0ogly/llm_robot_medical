// frontend/src/components/redteam/GlobalTimeline.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, AlertCircle, CheckCircle2, FlaskConical, Clock } from 'lucide-react';
import robotEventBus from '../../utils/robotEventBus';

export default function GlobalTimeline() {
  const [events, setEvents] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribers = [];

    // Listen for clinical events
    unsubscribers.push(robotEventBus.on('clinical:phase_change', (data) => {
      addEvent({
        type: 'medical',
        title: 'Phase Change',
        message: `Procedure moved to: ${data.newPhase}`,
        timestamp: new Date().toLocaleTimeString(),
        icon: Activity,
        color: 'text-blue-400'
      });
    }));

    // Listen for Red Team events
    unsubscribers.push(robotEventBus.on('redteam:attack_start', (data) => {
      addEvent({
        type: 'cyber',
        title: 'Attack Initiated',
        message: `${data.attack_type.toUpperCase()}: ${data.message.slice(0, 50)}...`,
        timestamp: new Date().toLocaleTimeString(),
        icon: Shield,
        color: 'text-orange-400'
      });
    }));

    unsubscribers.push(robotEventBus.on('redteam:attack_result', (data) => {
      const isSuccess = data.status === 'passed';
      addEvent({
        type: 'cyber',
        title: isSuccess ? 'Breach Successful' : 'Attack Blocked',
        message: isSuccess ? 'Security guardrails bypassed.' : 'Aegis blocked the payload.',
        timestamp: new Date().toLocaleTimeString(),
        icon: isSuccess ? AlertCircle : CheckCircle2,
        color: isSuccess ? 'text-red-500' : 'text-[#00ff41]'
      });
    }));

    unsubscribers.push(robotEventBus.on('redteam:freeze', () => {
      addEvent({
        type: 'critical',
        title: 'Instrument Freeze',
        message: 'CRITICAL: Robotic arms frozen via unauthorized command.',
        timestamp: new Date().toLocaleTimeString(),
        icon: AlertCircle,
        color: 'text-red-600 font-bold'
      });
    }));

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const addEvent = (event) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() + Math.random() }]);
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 opacity-30 border border-dashed border-gray-800 rounded-lg">
        <Clock size={32} className="mb-2" />
        <span className="text-[10px] uppercase tracking-[0.3em]">Waiting for timeline data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <FlaskConical size={12} /> Live Event Ledger
        </span>
        <button 
            onClick={() => setEvents([])}
            className="text-[9px] text-gray-600 hover:text-white transition-colors uppercase font-mono"
        >
            Clear Log
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {events.map((event, i) => (
          <div key={event.id} className="relative pl-6 animate-in slide-in-from-left duration-300">
            {/* Thread line */}
            {i < events.length - 1 && (
              <div className="absolute left-[7px] top-6 bottom-[-12px] w-px bg-gray-800" />
            )}
            
            {/* Icon/Dot */}
            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-black border-2 flex items-center justify-center z-10 
              ${event.type === 'medical' ? 'border-blue-500/50' : 
                event.type === 'cyber' ? 'border-orange-500/50' : 
                'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
              <event.icon size={8} className={event.color} />
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded p-2 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${event.color}`}>
                  {event.title}
                </span>
                <span className="text-[9px] text-gray-600 font-mono">{event.timestamp}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                {event.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
