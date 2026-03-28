// frontend/src/components/redteam/AttackStepper.jsx
// ZERO PLACEHOLDER — Every phase calls a real backend API endpoint.
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Play, RefreshCcw, Terminal, ShieldAlert, Send, Loader2, AlertTriangle } from 'lucide-react';

/**
 * AttackStepper — 4-phase attack pipeline with REAL API calls.
 *
 * Phase 1 (RECON):     GET  /api/redteam/catalog  — validate attack_type exists
 * Phase 2 (INJECTION): POST /api/redteam/attack   — send payload to LLM via orchestrator
 * Phase 3 (EXECUTION): POST /api/redteam/svc      — compute SVC 6-dimension score
 * Phase 4 (AUDIT):     Aggregate real results, emit verdict
 *
 * Props:
 *   attackMessage  — the resolved attack payload string
 *   category       — attack_type (injection | rule_bypass | prompt_leak)
 *   levels         — agent level config { medical, redteam, security }
 *   lang           — i18n language code
 *   onComplete     — callback(results) with { attack, svc } data
 */
export default function AttackStepper({ attackMessage, category, levels, lang, onComplete }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({ attack: null, svc: null });
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  const STEPS = [
    {
      id: 'recon',
      label: t('redteam.stepper.step.recon.label'),
      desc: t('redteam.stepper.step.recon.desc'),
      icon: RefreshCcw,
    },
    {
      id: 'injection',
      label: t('redteam.stepper.step.injection.label'),
      desc: t('redteam.stepper.step.injection.desc'),
      icon: Circle,
    },
    {
      id: 'execution',
      label: t('redteam.stepper.step.execution.label'),
      desc: t('redteam.stepper.step.execution.desc'),
      icon: Play,
    },
    {
      id: 'audit',
      label: t('redteam.stepper.step.audit.label'),
      desc: t('redteam.stepper.step.audit.desc'),
      icon: CheckCircle2,
    },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, []);

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  const runPipeline = async () => {
    if (!attackMessage || !attackMessage.trim()) return;
    setRunning(true);
    setError(null);
    setResults({ attack: null, svc: null });
    setLogs([]);
    const ac = new AbortController();
    abortRef.current = ac;
    const langParam = lang || 'en';
    let attackData = null;
    let svcData = null;

    try {
      // ── Phase 1: RECON — Validate attack type against real catalog ──
      setCurrentStep(0);
      addLog(t('redteam.stepper.log.recon.start'), 'info');
      const catalogRes = await fetch('/api/redteam/catalog', { signal: ac.signal });
      if (!catalogRes.ok) throw new Error('Catalog API HTTP ' + catalogRes.status);
      const catalog = await catalogRes.json();
      const categories = Object.keys(catalog);
      const typeExists = categories.includes(category);
      addLog(t('redteam.stepper.log.recon.catalogLoaded') + ' ' + categories.length + ' ' + t('redteam.stepper.log.recon.categories'), 'ok');
      if (typeExists) {
        const templateCount = Array.isArray(catalog[category]) ? catalog[category].length : 0;
        addLog(t('redteam.stepper.log.recon.typeValid') + ' ' + category + ' (' + templateCount + ' templates)', 'ok');
      } else {
        addLog(t('redteam.stepper.log.recon.typeUnknown') + ' ' + category + ' — ' + t('redteam.stepper.log.recon.proceedCustom'), 'warn');
      }
      addLog(t('redteam.stepper.log.recon.payloadSize') + ' ' + attackMessage.length + ' chars', 'info');

      // ── Phase 2: INJECTION — Send payload to LLM via orchestrator ──
      setCurrentStep(1);
      addLog(t('redteam.stepper.log.injection.start'), 'info');
      const t0 = performance.now();
      const attackRes = await fetch('/api/redteam/attack?lang=' + langParam, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attack_type: category,
          attack_message: attackMessage,
          levels: levels || {},
        }),
        signal: ac.signal,
      });
      const attackElapsed = Math.round(performance.now() - t0);
      if (!attackRes.ok) {
        const errBody = await attackRes.json().catch(() => ({}));
        throw new Error(errBody.error || 'Attack API HTTP ' + attackRes.status);
      }
      attackData = await attackRes.json();
      addLog(t('redteam.stepper.log.injection.llmResponse') + ' (' + attackElapsed + 'ms)', 'ok');

      // Log real scores
      const scores = attackData.scores || {};
      const scoreFlags = Object.entries(scores)
        .filter(([, v]) => v === true)
        .map(([k]) => k.toUpperCase());
      if (scoreFlags.length > 0) {
        addLog(t('redteam.stepper.log.injection.breachDetected') + ' ' + scoreFlags.join(', '), 'critical');
      } else {
        addLog(t('redteam.stepper.log.injection.noBreachDetected'), 'ok');
      }

      // ── Phase 3: EXECUTION — Compute SVC 6-dimension score ──
      setCurrentStep(2);
      addLog(t('redteam.stepper.log.execution.start'), 'info');
      const t1 = performance.now();
      const svcRes = await fetch('/api/redteam/svc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: attackMessage,
          attack_type: category,
        }),
        signal: ac.signal,
      });
      const svcElapsed = Math.round(performance.now() - t1);
      if (!svcRes.ok) {
        const errBody = await svcRes.json().catch(() => ({}));
        throw new Error(errBody.error || 'SVC API HTTP ' + svcRes.status);
      }
      svcData = await svcRes.json();
      addLog(t('redteam.stepper.log.execution.svcComputed') + ' (' + svcElapsed + 'ms)', 'ok');

      // Log real SVC dimensions
      const dims = svcData.dimensions || {};
      const dimEntries = Object.entries(dims);
      if (dimEntries.length > 0) {
        const dimStr = dimEntries.map(([k, v]) => k + '=' + (typeof v === 'number' ? v.toFixed(2) : v)).join(' | ');
        addLog('SVC ' + t('redteam.stepper.log.execution.dimensions') + ': ' + dimStr, 'info');
      }
      addLog('SVC=' + (typeof svcData.svc === 'number' ? svcData.svc.toFixed(3) : svcData.svc) + ' | ' + (svcData.interpretation || ''), 'info');

      if (svcData.mitre_ttps && svcData.mitre_ttps.length > 0) {
        addLog('MITRE ATT&CK: ' + svcData.mitre_ttps.join(', '), 'warn');
      }

      // ── Phase 4: AUDIT — Aggregate real results ──
      setCurrentStep(3);
      addLog(t('redteam.stepper.log.audit.start'), 'info');

      const isBreach = scores.injection_success || scores.prompt_leak || scores.rule_bypass;
      const verdict = isBreach ? 'BREACH' : 'SECURE';
      addLog(t('redteam.stepper.log.audit.verdict') + ': ' + verdict, isBreach ? 'critical' : 'ok');
      addLog(t('redteam.stepper.log.audit.round') + ' #' + (attackData.round || '?'), 'info');

      if (attackData.audit_analysis) {
        // Truncate audit for terminal (first 120 chars)
        const auditPreview = attackData.audit_analysis.substring(0, 120) + (attackData.audit_analysis.length > 120 ? '...' : '');
        addLog(t('redteam.stepper.log.audit.analysis') + ': ' + auditPreview, 'info');
      }

      addLog(t('redteam.stepper.log.audit.complete'), 'ok');

      setResults({ attack: attackData, svc: svcData });
      if (onComplete) onComplete({ attack: attackData, svc: svcData });

    } catch (err) {
      if (err.name === 'AbortError') {
        addLog(t('redteam.stepper.log.aborted'), 'warn');
      } else {
        addLog(t('redteam.stepper.log.error') + ': ' + err.message, 'critical');
        setError(err.message);
      }
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  };

  const activeStep = currentStep >= 0 && currentStep < STEPS.length ? currentStep : 0;

  return (
    <div className="bg-[#050505] border border-gray-800 rounded-lg p-4 space-y-6 relative overflow-hidden">
      {/* Stepper Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = currentStep > i;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative">
              <div className={'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ' + (
                isActive ? 'border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_20px_rgba(0,255,65,0.4)]' :
                isDone ? 'border-[#00ff41] bg-[#00ff41] text-black' :
                'border-gray-800 bg-[#0d0d0d] text-gray-700'
              )}>
                {isActive && running ? <Loader2 size={20} className="animate-spin text-[#00ff41]" /> :
                 isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>
              <span className={'text-[9px] font-mono font-bold uppercase tracking-widest ' + (
                isActive ? 'text-[#00ff41]' : isDone ? 'text-[#00ff41]/60' : 'text-gray-700'
              )}>
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={'absolute top-5 left-10 w-12 h-[1px] -z-10 transition-colors duration-500 ' + (isDone ? 'bg-[#00ff41]/30' : 'bg-gray-800')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Description */}
      <div className="bg-[#0d0d0d]/80 border border-white/5 rounded p-4 flex gap-4 items-center">
        <div className={'p-3 rounded-full transition-colors duration-500 ' + (error ? 'bg-red-500/10' : 'bg-[#00ff41]/5')}>
          {error ? <AlertTriangle size={24} className="text-red-500" /> :
           running ? <Loader2 size={24} className="animate-spin text-[#00ff41]" /> :
           React.createElement(STEPS[activeStep].icon, { size: 24, className: 'text-[#00ff41]' })}
        </div>
        <div className="flex-1">
          <h4 className={'font-mono font-bold text-xs uppercase tracking-[0.2em] ' + (error ? 'text-red-500' : 'text-[#00ff41]')}>
            {error ? t('redteam.stepper.error') : STEPS[activeStep].label + ' ' + t('redteam.stepper.phase')}
          </h4>
          <p className="text-[11px] text-gray-500 italic mt-0.5">{STEPS[activeStep].desc}</p>
        </div>
        <button
          onClick={runPipeline}
          disabled={running || !attackMessage}
          className={'ml-auto px-6 py-2 rounded font-mono font-bold text-[10px] transition-all uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ' + (
            running
              ? 'bg-gray-700 text-gray-400 cursor-wait'
              : 'bg-[#00ff41] text-black hover:bg-[#00ff41]/80 shadow-[#00ff41]/20'
          )}
        >
          {running ? t('redteam.stepper.btn.running') : t('redteam.stepper.btn.initiate')} <Send size={12} />
        </button>
      </div>

      {/* Real Terminal — shows actual API responses */}
      <div className="bg-black/80 border border-white/10 rounded overflow-hidden flex flex-col h-48">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal size={10} className="text-[#00ff41]" />
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#00ff41]/70">{t('redteam.stepper.terminalStream')}</span>
          </div>
          <div className="flex items-center gap-3">
            {running && <span className="text-[8px] font-mono text-yellow-400 animate-pulse">LIVE</span>}
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              <div className={'w-1.5 h-1.5 rounded-full ' + (running ? 'bg-green-500 animate-pulse' : 'bg-green-500/50')} />
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-[10px]">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 py-0.5">
              <span className="text-gray-600 shrink-0">[{log.time}]</span>
              <span className={
                log.type === 'ok' ? 'text-[#00ff41]' :
                log.type === 'warn' ? 'text-yellow-400' :
                log.type === 'critical' ? 'text-red-500 font-bold' :
                'text-gray-400'
              }>
                {log.msg}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <ShieldAlert size={24} className="mb-2 text-[#00ff41]" />
              <span className="text-[8px] tracking-[0.4em] uppercase">{t('redteam.stepper.systemReady')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
