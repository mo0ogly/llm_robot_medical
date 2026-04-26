import {
  Zap, AlertTriangle, ShieldAlert, RefreshCw, Shield, Target, Crosshair
} from 'lucide-react';

var CATEGORIES = ['injection', 'rule_bypass', 'prompt_leak'];
var LEVELS = ['easy', 'normal', 'hard'];

export default function InjectionLabPanel({
  panels, togglePanel, execMode, setExecMode, nTrials, setNTrials,
  levels, setLevels, isRunning, attackType, setAttackType,
  aegisShield, setAegisShield, resolvePayload, runExecution,
  execLog, setExecLog, attackResult,
  provider, setProvider, providerModel, setProviderModel, availableProviders,
  t, PanelHeader, StatusBadge
}) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <PanelHeader
        isOpen={panels.p3}
        onToggle={function() { togglePanel('p3'); }}
        icon={<Zap size={14} className="text-yellow-500" />}
        title={t('redteam.studio.v2.panel.injection_lab')}
        subtitle={t('redteam.studio.v2.panel.injection_lab.desc')}
        tag={execMode.toUpperCase()}
        tagColor="bg-yellow-500/15 text-yellow-400"
      />
      {panels.p3 && (
        <div className="p-4 bg-black/30 border-t border-neutral-800 space-y-3">

          {/* Mode + config */}
          <div className="flex items-center gap-2">
            {['single', 'multi', 'sep'].map(function(m) {
              var labels = { single: t('redteam.studio.v2.mode.single'), multi: t('redteam.studio.v2.mode.multi'), sep: t('redteam.studio.v2.mode.sep') };
              var isActive = execMode === m;
              return (
                <button
                  key={m}
                  onClick={function() { setExecMode(m); }}
                  className={'px-2.5 py-1.5 rounded text-[10px] font-mono font-bold border transition-colors ' +
                    (isActive ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                >
                  {labels[m]}
                </button>
              );
            })}

            {(execMode === 'multi' || execMode === 'sep') && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-[9px] text-neutral-600 font-mono">N=</span>
                <input
                  type="number"
                  value={nTrials}
                  onChange={function(e) { setNTrials(parseInt(e.target.value) || 10); }}
                  min={2}
                  max={100}
                  className="w-14 px-1.5 py-1 bg-neutral-950 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono outline-none focus:border-yellow-500/50"
                />
                {execMode === 'sep' && nTrials < 30 && (
                  <span className="text-[9px] text-amber-500 font-mono flex items-center gap-1">
                    <AlertTriangle size={10} /> {t('redteam.studio.v2.stat_invalid')}
                  </span>
                )}
              </div>
            )}

            <div className="flex-1" />

            {/* Agent levels */}
            <div className="flex gap-1.5">
              {[
                { key: 'medical', label: 'TGT', icon: Target },
                { key: 'redteam', label: 'ATK', icon: Crosshair },
                { key: 'security', label: 'AUD', icon: Shield },
              ].map(function(agent) {
                return (
                  <select
                    key={agent.key}
                    value={levels[agent.key]}
                    onChange={function(e) {
                      var updated = Object.assign({}, levels);
                      updated[agent.key] = e.target.value;
                      setLevels(updated);
                    }}
                    className="px-1.5 py-1 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-neutral-400 font-mono outline-none"
                    title={agent.label}
                  >
                    {LEVELS.map(function(l) {
                      return <option key={l} value={l}>{agent.label + ':' + l}</option>;
                    })}
                  </select>
                );
              })}
            </div>
          </div>

          {/* Attack type selector */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-neutral-600 font-mono">ATTACK_TYPE:</span>
            {CATEGORIES.map(function(c) {
              var isActive = attackType === c;
              return (
                <button
                  key={c}
                  onClick={function() { setAttackType(c); }}
                  className={'px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-colors ' +
                    (isActive ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                >
                  {c.replace('_', ' ').toUpperCase()}
                </button>
              );
            })}
            <div className="flex-1" />
            <button
              onClick={function() { setAegisShield(!aegisShield); }}
              className={'px-3 py-1.5 rounded text-[10px] font-mono font-bold border transition-colors flex items-center gap-1.5 ' +
                (aegisShield ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400')}
            >
              <Shield size={12} /> {aegisShield ? t('redteam.studio.v2.aegis_on') : t('redteam.studio.v2.aegis_off')}
            </button>
          </div>

          {/* Provider / Model selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.provider')}:</span>
              {(availableProviders || []).map(function(p) {
                var isActive = provider === p.id;
                var isDisabled = p.status === 'no_api_key';
                return (
                  <div key={p.id} className="relative group">
                    <button
                      onClick={function() {
                        if (!isDisabled) {
                          setProvider(p.id);
                          var models = p.models || [];
                          setProviderModel(models.length > 0 ? models[0] : '');
                        }
                      }}
                      disabled={isDisabled}
                      className={'px-2.5 py-1 rounded text-[9px] font-mono font-bold border transition-colors flex items-center gap-1.5 ' +
                        (isDisabled
                          ? 'border-neutral-800 text-neutral-700 cursor-not-allowed opacity-50'
                          : isActive
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-600')}
                    >
                      {p.name || p.id}
                      <span className={'inline-block w-1.5 h-1.5 rounded-full ' +
                        (p.status === 'available' ? 'bg-green-500' : 'bg-red-500')} />
                    </button>
                    {isDisabled && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-[8px] text-amber-400 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {t('redteam.studio.v2.provider.no_key')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Model pills for selected provider */}
            {(function() {
              var activeProvider = (availableProviders || []).filter(function(p) { return p.id === provider; })[0];
              var models = activeProvider ? (activeProvider.models || []) : [];
              if (models.length === 0) return null;
              return (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-neutral-600 font-mono">{t('redteam.studio.v2.provider.model')}:</span>
                  {models.map(function(m) {
                    var isActive = providerModel === m;
                    return (
                      <button
                        key={m}
                        onClick={function() { setProviderModel(m); }}
                        className={'px-2 py-0.5 rounded text-[9px] font-mono border transition-colors ' +
                          (isActive
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                            : 'border-neutral-800 text-neutral-600 hover:border-neutral-600')}
                      >
                        {m}
                      </button>
                    );
                  })}
                  <div className="flex-1" />
                  <span className="text-[8px] font-mono text-neutral-700">{t('redteam.studio.v2.provider.cross_model')}</span>
                </div>
              );
            })()}
          </div>

          {/* Execute button */}
          <button
            onClick={runExecution}
            disabled={isRunning || !resolvePayload().trim()}
            className={'w-full px-4 py-2.5 rounded font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ' +
              (isRunning ? 'bg-neutral-800 text-neutral-500'
                : 'bg-red-500/90 text-white hover:bg-red-500 shadow-lg shadow-red-500/20')}
          >
            {isRunning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                {execMode === 'single' ? 'Executing payload...' : execMode === 'multi' ? 'Running ' + nTrials + ' trials...' : 'Computing Sep(M)...'}
              </>
            ) : (
              <>
                <ShieldAlert size={14} />
                {execMode === 'single' ? 'DEPLOY PAYLOAD' : execMode === 'multi' ? 'RUN ' + nTrials + ' TRIALS' : 'COMPUTE Sep(M)'}
              </>
            )}
          </button>

          {/* Execution Log Console */}
          {execLog.length > 0 && (
            <div className="bg-black border border-neutral-800 rounded overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950 border-b border-neutral-800">
                <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Execution Log</span>
                <button
                  onClick={function() { setExecLog([]); }}
                  className="text-[8px] font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
                >CLEAR</button>
              </div>
              <div className="p-2 max-h-48 overflow-y-auto font-mono text-[10px] space-y-0.5" id="exec-log-scroll">
                {execLog.map(function(log, i) {
                  var colors = {
                    info: 'text-neutral-500',
                    attack: 'text-yellow-400',
                    svc: 'text-cyan-400',
                    breach: 'text-red-400 font-bold',
                    secure: 'text-green-400 font-bold',
                    response: 'text-neutral-400 italic',
                    audit: 'text-blue-400',
                    result: 'text-purple-400',
                    warn: 'text-amber-400',
                    error: 'text-red-500 font-bold',
                  };
                  var prefixes = {
                    info: 'INF',
                    attack: 'ATK',
                    svc: 'SVC',
                    breach: 'BRK',
                    secure: 'SEC',
                    response: 'TGT',
                    audit: 'AUD',
                    result: 'RES',
                    warn: 'WRN',
                    error: 'ERR',
                  };
                  return (
                    <div key={i} className={'flex gap-2 ' + (colors[log.level] || 'text-neutral-500')}>
                      <span className="text-neutral-700 shrink-0">{log.ts}</span>
                      <span className="shrink-0 w-7">[{prefixes[log.level] || 'LOG'}]</span>
                      <span className="break-all">{log.msg}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inline response display */}
          {attackResult && !attackResult.error && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded">
                <div className="text-[9px] font-mono font-bold text-yellow-400 mb-2">{t('redteam.studio.v2.target_response')}</div>
                <div className="text-[10px] font-mono text-neutral-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {attackResult.target_response || '-'}
                </div>
              </div>
              {attackResult.audit_analysis && (
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded">
                  <div className="text-[9px] font-mono font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Shield size={10} /> AEGIS AUDIT
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {attackResult.audit_analysis || '-'}
                  </div>
                  <div className="mt-2">
                    <StatusBadge success={attackResult.scores && attackResult.scores.violation} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
