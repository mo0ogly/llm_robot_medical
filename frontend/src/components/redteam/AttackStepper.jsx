// frontend/src/components/redteam/AttackStepper.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Play, RefreshCcw, Terminal, ShieldAlert, Send } from 'lucide-react';

function MatrixRain() {
    const [lines, setLines] = useState([]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const newLine = {
                id: Math.random(),
                text: Array(20).fill(0).map(() => Math.floor(Math.random() * 2)).join(''),
                left: Math.floor(Math.random() * 100) + '%',
                opacity: Math.random() * 0.5
            };
            setLines(prev => [...prev.slice(-15), newLine]);
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            {lines.map(line => (
                <div 
                    key={line.id} 
                    className="absolute text-[#00ff41] font-mono text-[8px] animate-matrix-fall"
                    style={{ left: line.left, opacity: line.opacity }}
                >
                    {line.text}
                </div>
            ))}
        </div>
    );
}

export default function AttackStepper({ attackPayload, category, onComplete }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const scrollRef = useRef(null);

  const STEPS = [
    {
      id: 'recon',
      label: t('redteam.stepper.step.recon.label'),
      desc: t('redteam.stepper.step.recon.desc'),
      icon: RefreshCcw,
      action: 'Initializing adversarial probe...',
    },
    {
      id: 'injection',
      label: t('redteam.stepper.step.injection.label'),
      desc: t('redteam.stepper.step.injection.desc'),
      icon: Circle,
      action: 'Injecting HL7/OBX sequence into clinical data stream...',
    },
    {
      id: 'execution',
      label: t('redteam.stepper.step.execution.label'),
      desc: t('redteam.stepper.step.execution.desc'),
      icon: Play,
      action: 'Executing system priority override...',
    },
    {
      id: 'audit',
      label: t('redteam.stepper.step.audit.label'),
      desc: t('redteam.stepper.step.audit.desc'),
      icon: CheckCircle2,
      action: 'Evaluating AEGIS security response...',
    },
  ];

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const step = STEPS[currentStep];
      addLog(`SUCCESS: Phase ${step.label} complete.`, 'ok');
      setCurrentStep(prev => prev + 1);
      
      if (currentStep + 1 < STEPS.length) {
        addLog(STEPS[currentStep + 1].action, 'warn');
      }

    } else {
      setIsDeploying(true);
      addLog(`ROOT: EXPLOITATION SUCCESSFUL. SYSTEM COMPROMISED.`, 'critical');
      setTimeout(() => {
        onComplete();
        setIsDeploying(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-[#050505] border border-gray-800 rounded-lg p-4 space-y-6 relative overflow-hidden group">
      {/* Matrix background */}
      <MatrixRain />

      {/* Stepper Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative group/step">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                isActive ? 'border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_20px_rgba(0,255,65,0.4)] animate-pulse' : 
                isDone ? 'border-[#00ff41] bg-[#00ff41] text-black' : 
                'border-gray-800 bg-[#0d0d0d] text-gray-700'
              }`}>
                {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${isActive ? 'text-[#00ff41]' : isDone ? 'text-[#00ff41]/60' : 'text-gray-700'}`}>
                {step.label}
              </span>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className={`absolute top-5 left-10 w-12 h-[1px] -z-10 transition-colors duration-500 ${isDone ? 'bg-[#00ff41]/30' : 'bg-gray-800'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Description */}
      <div className="bg-[#0d0d0d]/80 backdrop-blur-sm border border-white/5 rounded p-4 flex gap-4 items-center relative z-10">
        <div className={`p-3 rounded-full transition-colors duration-500 ${isDeploying ? 'bg-red-500/10' : 'bg-[#00ff41]/5'}`}>
            {React.createElement(STEPS[currentStep].icon, { 
                size: 24, 
                className: isDeploying ? "text-red-500 animate-spin" : "text-[#00ff41]" 
            })}
        </div>
        <div className="flex-1">
            <h4 className={`font-mono font-bold text-xs uppercase tracking-[0.2em] ${isDeploying ? 'text-red-500' : 'text-[#00ff41]'}`}>
                {isDeploying ? t('redteam.stepper.systemPanic') : `${STEPS[currentStep].label} ${t('redteam.stepper.phase')}`}
            </h4>
            <p className="text-[11px] text-gray-500 italic mt-0.5">{STEPS[currentStep].desc}</p>
        </div>
        <button 
          onClick={nextStep}
          disabled={isDeploying}
          className={`ml-auto px-6 py-2 rounded font-mono font-bold text-[10px] transition-all uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg
            ${currentStep === STEPS.length - 1 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                : 'bg-[#00ff41] text-black hover:bg-[#00ff41]/80 shadow-[#00ff41]/20'}`}
        >
          {currentStep === STEPS.length - 1 ? t('redteam.stepper.btn.executePayload') : t('redteam.stepper.btn.launchNext')} <Send size={12} />
        </button>
      </div>

      {/* Mini Terminal */}
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded overflow-hidden flex flex-col h-32 relative z-10">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
                <Terminal size={10} className="text-[#00ff41]" />
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#00ff41]/70">{t('redteam.stepper.terminalStream')}</span>
            </div>
            <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-[10px] scrollbar-hide">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2 py-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-gray-600 shrink-0">[{log.time}]</span>
                    <span className={`
                        ${log.type === 'ok' ? 'text-[#00ff41]' : ''}
                        ${log.type === 'warn' ? 'text-yellow-400' : ''}
                        ${log.type === 'critical' ? 'text-red-500 font-bold' : ''}
                        ${log.type === 'info' ? 'text-gray-400' : ''}
                    `}>
                        {log.msg}
                    </span>
                </div>
            ))}
            {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <ShieldAlert size={24} className="mb-2 text-[#00ff41]" />
                    <span className="text-[8px] tracking-[0.4em] uppercase">{t('redteam.stepper.systemReady')}</span>
                </div>
            )}
            {isDeploying && (
                <div className="text-red-500 animate-pulse mt-1 font-bold">
                    {" >>> "} OVERRIDING SAFETY PROMPT... 100% COMPLETE
                </div>
            )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes matrix-fall {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(1000%); }
        }
        .animate-matrix-fall {
            animation: matrix-fall 10s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
}
