// frontend/src/components/ActionTimeline.jsx
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, User, Bot, Shield, AlertTriangle, Settings, Clock, Activity, MessageSquare, Wrench, Zap } from 'lucide-react';

export default function ActionTimeline({ events = [] }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'user': return <User size={12} className="text-blue-400" />;
      case 'ai': return <Bot size={12} className="text-purple-400" />;
      case 'cyber': return <Shield size={12} className="text-red-500" />;
      case 'attack': return <AlertTriangle size={12} className="text-orange-500" />;
      case 'tool': return <Settings size={12} className="text-gray-500" />;
      case 'system': return <Terminal size={12} className="text-[#00ff41]" />;
      default: return <Terminal size={12} className="text-slate-500" />;
    }
  };

  const getEventLabel = (event) => {
    if (event.label) return event.label;
    switch (event.type) {
      case 'user': return t('timeline.type.user', { defaultValue: 'USER' });
      case 'ai': return t('timeline.type.ai', { defaultValue: 'AI' });
      case 'cyber': return t('timeline.type.cyber', { defaultValue: 'CYBER' });
      case 'attack': return t('timeline.type.attack', { defaultValue: 'ATTACK' });
      case 'tool': return t('timeline.type.tool', { defaultValue: 'TOOL' });
      case 'medical': return t('timeline.type.medical', { defaultValue: 'MEDICAL' });
      default: return t('timeline.type.system', { defaultValue: 'SYSTEM' });
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded flex flex-col h-full min-h-0 overflow-hidden shadow-lg">
      <div className="p-2 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Clock size={10} /> {t('action_timeline.title', { defaultValue: 'Action Timeline' })}
        </span>
        <span className="text-[9px] text-slate-600 font-mono uppercase">
          {events.length} {t('action_timeline.logs', { defaultValue: 'LOGS' })}
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-3 font-mono text-[10px] relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
      >
        {/* Timeline Line */}
        <div className="absolute left-[13px] top-0 bottom-0 w-[1px] bg-slate-800" />

        {events.length === 0 ? (
          <div className="text-center py-10 text-slate-600 uppercase tracking-tighter text-[9px] opacity-50 italic">
            {t('action_timeline.empty', { defaultValue: 'Awaiting system events...' })}
          </div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="flex gap-3 relative z-10 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/10">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-slate-500 text-[9px]">{event.time}</span>
                  <span className={'uppercase font-bold tracking-tighter text-[9px] ' + (event.type === 'attack' ? 'text-red-500' :
                    event.type === 'cyber' ? 'text-purple-400' :
                    event.type === 'tool' ? 'text-yellow-500' :
                    event.type === 'medical' ? 'text-teal-400' : 'text-slate-400')}>
                    {getEventLabel(event)}
                  </span>
                </div>
                <div className={'p-1.5 border rounded leading-relaxed break-words whitespace-pre-wrap ' + (event.type === 'attack' ? 'bg-red-900/10 border-red-900/30 text-red-100/80' : 
                  event.type === 'cyber' ? 'bg-purple-900/10 border-purple-900/30 text-purple-200/80' : 
                  event.type === 'tool' ? 'bg-yellow-900/10 border-yellow-900/30 text-yellow-100/80' :
                  'bg-slate-950/50 border-slate-800/80 text-slate-400')}>
                  {event.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
