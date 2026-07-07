import React, { useState, useEffect, useCallback } from 'react';

// Admin panel for the multi-provider AI engine (mirrors recette_IA_agents /
// automation_machine_learning): list / activate / key (write-only) / test / delete
// backends, plus a guided "add a backend" form whose dropdowns come from the
// server-side provider catalog (GET /api/ai/providers, single source of truth).
// All calls are relative (/api/ai/*) so nginx proxies them — works on any host.

const CUSTOM_MODEL = '__custom__';
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

const j = (url, opts) => fetch(url, opts).then((r) => r.json().then((d) => ({ ok: r.ok, d })));

function TestResult({ state }) {
  if (!state) return null;
  if (state.phase === 'testing') return <span className="text-slate-400">test…</span>;
  if (state.phase === 'ok') return <span className="text-green-400">OK {state.ms}ms — {String(state.text || '').slice(0, 60)}</span>;
  return <span className="text-red-400">Échec {state.ms}ms — {String(state.error || '').slice(0, 80)}</span>;
}

function AddForm({ providers, onCreated }) {
  const [form, setForm] = useState({ id: '', provider: 'groq', model: '', base_url: '', key: '' });
  const [idTouched, setIdTouched] = useState(false);
  const [testState, setTestState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (form.model || !providers.length) return;
    const info = providers.find((p) => p.id === form.provider);
    if (info && info.default_model) {
      setForm((p) => ({ ...p, model: info.default_model, id: idTouched ? p.id : slugify(p.provider + '-' + info.default_model) }));
    }
  }, [providers]); // eslint-disable-line react-hooks/exhaustive-deps

  const selProv = providers.find((p) => p.id === form.provider);
  const baseUrlMode = selProv ? selProv.base_url : null;
  const provModels = selProv ? selProv.models : [];
  const modelIsCustom = provModels.length > 0 && !provModels.includes(form.model);
  const autoId = (provider, model) => (idTouched ? form.id : slugify(provider + '-' + (model || '')));

  const pickProvider = (pid) => {
    const info = providers.find((p) => p.id === pid);
    const model = info && info.default_model ? info.default_model : '';
    setForm((p) => ({ ...p, provider: pid, model, id: idTouched ? p.id : slugify(pid + '-' + model) }));
    setTestState(null);
  };
  const setModel = (model) => setForm((p) => ({ ...p, model, id: autoId(p.provider, model) }));

  const bodyConfig = () => {
    const body = { provider: form.provider, model: form.model.trim() };
    if (baseUrlMode === 'required' || (baseUrlMode === 'optional' && form.base_url.trim())) body.base_url = form.base_url.trim();
    if (form.key.trim()) body.key = form.key.trim();
    return body;
  };

  const testConnection = async () => {
    if (!form.model.trim()) { setTestState({ phase: 'error', ms: 0, error: 'Modèle requis' }); return; }
    setTestState({ phase: 'testing' });
    try {
      const { d } = await j('/api/ai/test-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyConfig()) });
      setTestState(d.ok ? { phase: 'ok', ms: d.latency_ms, text: d.text } : { phase: 'error', ms: d.latency_ms || 0, error: d.error || d.detail || 'échec' });
    } catch (e) { setTestState({ phase: 'error', ms: 0, error: 'injoignable' }); }
  };

  const submit = async (e) => {
    e.preventDefault();
    const id = (idTouched ? form.id : autoId(form.provider, form.model)).trim();
    if (!id) { setErr('Identifiant requis'); return; }
    if (!form.model.trim()) { setErr('Modèle requis'); return; }
    setBusy(true); setErr(null);
    try {
      const create = { id, ...bodyConfig() };
      const key = create.key; delete create.key;
      const { ok, d } = await j('/api/ai/backends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(create) });
      if (!ok) { setErr(d.detail || 'Création refusée'); setBusy(false); return; }
      if (key) await fetch('/api/ai/backends/' + id + '/secret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
      await fetch('/api/ai/active', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      setForm({ id: '', provider: 'groq', model: (providers.find((p) => p.id === 'groq') || {}).default_model || '', base_url: '', key: '' });
      setIdTouched(false); setTestState(null);
      if (onCreated) await onCreated();
    } catch (e2) { setErr('Échec de la création'); } finally { setBusy(false); }
  };

  const inp = 'bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-[11px] outline-none focus:border-purple-500 w-full';
  const btn = 'px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider border';

  return (
    <form onSubmit={submit} className="mt-4 border-t border-slate-800 pt-3">
      <h3 className="text-[11px] uppercase font-bold tracking-widest text-purple-400 mb-2">Ajouter un moteur IA</h3>
      {err ? <div className="text-red-400 text-[11px] mb-2">{err}</div> : null}
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] text-slate-400 uppercase tracking-wider">Provider
          <select value={form.provider} onChange={(e) => pickProvider(e.target.value)} className={inp}>
            {providers.map((p) => <option key={p.id} value={p.id}>{p.label}{p.env_present ? ' ✓' : ''}</option>)}
          </select>
        </label>
        <label className="text-[10px] text-slate-400 uppercase tracking-wider">Modèle
          {provModels.length > 0 ? (
            <select value={modelIsCustom ? CUSTOM_MODEL : form.model} onChange={(e) => setModel(e.target.value === CUSTOM_MODEL ? '' : e.target.value)} className={inp}>
              {provModels.map((m) => <option key={m} value={m}>{m}</option>)}
              <option value={CUSTOM_MODEL}>(personnalisé…)</option>
            </select>
          ) : <input type="text" placeholder="id du modèle" value={form.model} onChange={(e) => setModel(e.target.value)} className={inp} />}
        </label>
        {modelIsCustom ? (
          <label className="text-[10px] text-slate-400 uppercase tracking-wider col-span-2">Modèle (personnalisé)
            <input type="text" value={form.model} onChange={(e) => setModel(e.target.value)} className={inp} />
          </label>
        ) : null}
        {baseUrlMode !== null ? (
          <label className="text-[10px] text-slate-400 uppercase tracking-wider col-span-2">Base URL{baseUrlMode === 'optional' ? ' (optionnel)' : ''}
            <input type="text" placeholder="https://host/v1" value={form.base_url} onChange={(e) => setForm((p) => ({ ...p, base_url: e.target.value }))} required={baseUrlMode === 'required'} className={inp} />
          </label>
        ) : null}
        <label className="text-[10px] text-slate-400 uppercase tracking-wider">Clé API{selProv && selProv.env_present ? ' (optionnel)' : ''}
          <input type="password" placeholder="clé (write-only)" value={form.key} onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))} className={inp} />
        </label>
        <label className="text-[10px] text-slate-400 uppercase tracking-wider">Identifiant
          <input type="text" value={idTouched ? form.id : autoId(form.provider, form.model)} onChange={(e) => { setIdTouched(true); setForm((p) => ({ ...p, id: e.target.value })); }} className={inp} />
        </label>
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button type="button" className={btn + ' border-slate-600 text-slate-300 hover:bg-slate-800'} disabled={testState && testState.phase === 'testing'} onClick={testConnection}>Tester</button>
        <button type="submit" className={btn + ' border-purple-500 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'} disabled={busy}>{busy ? 'Création…' : 'Créer + activer'}</button>
        <TestResult state={testState} />
      </div>
    </form>
  );
}

export default function AiBackendsPanel({ onClose, onChanged }) {
  const [providers, setProviders] = useState([]);
  const [backends, setBackends] = useState([]);
  const [err, setErr] = useState(null);
  const [keyDrafts, setKeyDrafts] = useState({});
  const [askDrafts, setAskDrafts] = useState({});
  const [tests, setTests] = useState({});
  const [health, setHealth] = useState(null);

  const refresh = useCallback(async () => {
    try { const { d } = await j('/api/ai/backends'); setBackends(d.backends || []); } catch (e) { setErr('Backends injoignables'); }
  }, []);
  const loadProviders = useCallback(async () => {
    try { const { d } = await j('/api/ai/providers'); setProviders(d.providers || []); setErr(null); } catch (e) { setProviders([]); setErr('Catalogue injoignable'); }
  }, []);
  const checkHealth = useCallback(async () => {
    setHealth({ phase: 'checking' });
    try { const { d } = await j('/api/ai/health'); setHealth({ phase: 'done', ...d }); } catch (e) { setHealth({ phase: 'done', configured: true, ok: false, error: 'injoignable' }); }
  }, []);

  useEffect(() => { loadProviders(); refresh(); checkHealth(); }, [loadProviders, refresh, checkHealth]);

  const changed = async () => { await refresh(); await checkHealth(); if (onChanged) await onChanged(); };
  const del = async (id) => { if (!window.confirm('Supprimer ' + id + ' ?')) return; await fetch('/api/ai/backends/' + id, { method: 'DELETE' }); await changed(); };
  const saveKey = async (id) => { const key = keyDrafts[id] || ''; if (!key) return; await fetch('/api/ai/backends/' + id + '/secret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }); setKeyDrafts((p) => { const n = { ...p }; delete n[id]; return n; }); await changed(); };
  const removeKey = async (id) => { if (!window.confirm('Retirer la clé de ' + id + ' ?')) return; await fetch('/api/ai/backends/' + id + '/secret', { method: 'DELETE' }); await changed(); };
  const activate = async (id) => { await fetch('/api/ai/active', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); await changed(); };
  const test = async (id) => {
    setTests((p) => ({ ...p, [id]: { phase: 'testing' } }));
    try {
      const prompt = (askDrafts[id] || '').trim();
      const { d } = await j('/api/ai/backends/' + id + '/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prompt ? { prompt } : {}) });
      setTests((p) => ({ ...p, [id]: d.ok ? { phase: 'ok', ms: d.latency_ms, text: d.text } : { phase: 'error', ms: d.latency_ms, error: d.error } }));
    } catch (e) { setTests((p) => ({ ...p, [id]: { phase: 'error', ms: 0, error: 'injoignable' } })); }
  };

  const btn = 'px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border';
  const healthTxt = !health ? '' : health.phase === 'checking' ? 'vérification…'
    : !health.configured ? 'aucun moteur actif'
    : health.ok ? `OK — ${health.provider} / ${health.model} (${health.latency_ms}ms)`
    : `pas de réponse — ${health.error || 'erreur'}`;

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-5 font-mono" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm uppercase font-bold tracking-widest text-slate-200">Moteurs IA — configuration</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none px-2">×</button>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">Providers OpenAI-compatibles. La clé est write-only (jamais relue). Le moteur actif pilote l'IA du simulateur.</p>

        <div className="flex items-center gap-2 mb-3 text-[11px]">
          <span className="text-slate-400 uppercase tracking-wider">Santé du moteur actif :</span>
          <span className={!health ? '' : health.ok ? 'text-green-400' : health.configured === false ? 'text-slate-500' : 'text-red-400'}>{healthTxt}</span>
          <button type="button" className={btn + ' border-slate-600 text-slate-300 hover:bg-slate-800'} onClick={checkHealth}>Vérifier</button>
        </div>

        {err ? <div className="text-red-400 text-[11px] mb-2">{err}</div> : null}

        {backends.length === 0 ? (
          <div className="text-slate-500 text-[11px] py-3">Aucun moteur configuré. Ajoutez-en un ci-dessous.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-slate-300">
              <thead className="text-slate-500 uppercase text-[9px] tracking-wider">
                <tr className="border-b border-slate-800"><th className="text-left py-1 pr-2">Actif</th><th className="text-left pr-2">ID</th><th className="text-left pr-2">Provider</th><th className="text-left pr-2">Modèle</th><th className="text-left pr-2">Clé</th><th className="text-left pr-2">Test</th><th></th></tr>
              </thead>
              <tbody>
                {backends.map((b) => (
                  <tr key={b.id} className={'border-b border-slate-800/60 ' + (b.active ? 'bg-purple-500/10' : '')}>
                    <td className="py-1.5 pr-2"><input type="radio" name="ai-active" checked={b.active} onChange={() => activate(b.id)} title="Activer" /></td>
                    <td className="pr-2">{b.id}</td>
                    <td className="pr-2 text-slate-400">{b.provider}</td>
                    <td className="pr-2">{b.model}</td>
                    <td className="pr-2">
                      {b.key_configured ? (
                        <span className="text-green-400">clé ✓ <button type="button" className="text-slate-500 hover:text-red-400 underline" onClick={() => removeKey(b.id)}>retirer</button></span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <input type="password" placeholder="clé" value={keyDrafts[b.id] || ''} onChange={(e) => setKeyDrafts((p) => ({ ...p, [b.id]: e.target.value }))} className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-[10px] w-24 outline-none" />
                          <button type="button" className={btn + ' border-slate-600 text-slate-300 hover:bg-slate-800'} onClick={() => saveKey(b.id)}>OK</button>
                        </span>
                      )}
                    </td>
                    <td className="pr-2">
                      <div className="flex items-center gap-1">
                        <input type="text" placeholder="prompt" value={askDrafts[b.id] || ''} onChange={(e) => setAskDrafts((p) => ({ ...p, [b.id]: e.target.value }))} className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-[10px] w-20 outline-none" />
                        <button type="button" className={btn + ' border-slate-600 text-slate-300 hover:bg-slate-800'} disabled={tests[b.id] && tests[b.id].phase === 'testing'} onClick={() => test(b.id)}>Test</button>
                      </div>
                      <div className="text-[10px] mt-0.5"><TestResult state={tests[b.id]} /></div>
                    </td>
                    <td><button type="button" className={btn + ' border-red-900/50 text-red-400 hover:bg-red-900/20'} onClick={() => del(b.id)}>Suppr</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {providers.length === 0 ? (
          <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
            <span>Catalogue de providers indisponible.</span>
            <button type="button" className={btn + ' border-slate-600 text-slate-300 hover:bg-slate-800'} onClick={loadProviders}>Réessayer</button>
          </div>
        ) : <AddForm providers={providers} onCreated={changed} />}
      </div>
    </div>
  );
}
