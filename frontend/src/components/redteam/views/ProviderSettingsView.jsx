import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Server, Check, KeyRound, RefreshCw, Star, AlertTriangle, Cpu
} from "lucide-react";

/**
 * ProviderSettingsView
 *
 * Settings panel for the multi-LLM provider catalog (single source of truth:
 * backend/prompts/llm_providers_config.json via /api/redteam/llm-providers/manage).
 *
 * - Enable / disable each provider (persisted server-side via PUT .../config).
 * - Read-only key status: whether the provider's api_key_env is set in the
 *   environment. Keys are NEVER entered or shown here — they live in backend/.env.
 * - Pick the Lab default (active) provider + model (PUT .../active).
 *
 * Campaign runners read LLM_PROVIDER / MEDICAL_MODEL from the environment; this
 * panel sets the default the Lab UI (PromptForge) starts from.
 */
function ProviderSettingsView() {
  const { t } = useTranslation();
  const [providers, setProviders] = useState([]);
  const [activeProvider, setActiveProvider] = useState(null);
  const [activeModel, setActiveModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/redteam/llm-providers/manage");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setProviders(data.providers || []);
      setActiveProvider(data.active_provider || null);
      setActiveModel(data.active_model || null);
      setErr(null);
    } catch (e) {
      setErr(t("redteam.providerSettings.loadError", { defaultValue: "Failed to load providers" }) + ": " + e.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const toggleEnabled = async (name, enabled) => {
    setBusy("toggle:" + name);
    setErr(null);
    try {
      const res = await fetch("/api/redteam/llm-providers/" + name + "/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      await load();
    } catch (e) {
      setErr(t("redteam.providerSettings.toggleError", { defaultValue: "Failed to update provider" }) + ": " + e.message);
    } finally {
      setBusy(null);
    }
  };

  const setActive = async (provider, model) => {
    setBusy("active:" + provider);
    setErr(null);
    try {
      const res = await fetch("/api/redteam/llm-providers/active", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: provider, model: model || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || ("HTTP " + res.status));
      setActiveProvider(data.active_provider);
      setActiveModel(data.active_model);
    } catch (e) {
      setErr(t("redteam.providerSettings.activeError", { defaultValue: "Failed to set active provider" }) + ": " + e.message);
    } finally {
      setBusy(null);
    }
  };

  const enabledCount = providers.filter((p) => p.enabled).length;
  const configuredCount = providers.filter((p) => p.configured).length;

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-mono text-[#00ff41] mb-1 flex items-center gap-2">
              <Server size={20} aria-hidden="true" />
              {t("redteam.providerSettings.title", { defaultValue: "AI Providers" })}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("redteam.providerSettings.subtitle", {
                defaultValue: "Enable providers, check API-key status, and set the Lab default model.",
              })}
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            aria-label={t("redteam.providerSettings.refresh", { defaultValue: "Refresh" })}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-200 rounded font-mono text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} aria-hidden="true" />
            {t("redteam.providerSettings.refresh", { defaultValue: "Refresh" })}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs font-mono text-gray-400">
          <span className="px-2 py-1 bg-neutral-900 border border-gray-800 rounded">
            {providers.length} {t("redteam.providerSettings.providers", { defaultValue: "providers" })}
          </span>
          <span className="px-2 py-1 bg-neutral-900 border border-gray-800 rounded">
            {enabledCount} {t("redteam.providerSettings.enabled", { defaultValue: "enabled" })}
          </span>
          <span className="px-2 py-1 bg-neutral-900 border border-gray-800 rounded">
            {configuredCount} {t("redteam.providerSettings.keysConfigured", { defaultValue: "keys configured" })}
          </span>
        </div>

        {/* Error banner */}
        {err && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm font-mono flex items-center gap-2">
            <AlertTriangle size={16} aria-hidden="true" />
            {err}
          </div>
        )}

        {/* Note: campaigns read the env */}
        <div className="mb-4 p-3 bg-blue-900/15 border border-blue-800/50 rounded text-blue-200/80 text-xs font-mono">
          {t("redteam.providerSettings.envNote", {
            defaultValue: "API keys are read from backend/.env (never entered here). Campaign runners use LLM_PROVIDER / MEDICAL_MODEL from the environment; this panel sets the Lab UI default.",
          })}
        </div>

        {loading && providers.length === 0 ? (
          <div className="p-8 text-neutral-500 font-mono text-sm">
            {t("redteam.providerSettings.loading", { defaultValue: "Loading providers..." })}
          </div>
        ) : (
          <div className="space-y-3">
            {providers.map((p) => {
              const isActive = p.name === activeProvider;
              const toggling = busy === "toggle:" + p.name;
              const settingActive = busy === "active:" + p.name;
              return (
                <div
                  key={p.name}
                  className={
                    "bg-neutral-900 border rounded-lg p-4 " +
                    (isActive ? "border-[#00ff41]/60" : "border-gray-800")
                  }
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Identity */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <span className="text-sm font-mono text-white">{p.display_name}</span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-neutral-800 text-gray-400 border border-gray-700">
                        {p.type === "local"
                          ? t("redteam.providerSettings.local", { defaultValue: "local" })
                          : t("redteam.providerSettings.cloud", { defaultValue: "cloud" })}
                      </span>
                      {isActive && (
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40 flex items-center gap-1">
                          <Star size={10} aria-hidden="true" />
                          {t("redteam.providerSettings.default", { defaultValue: "default" })}
                        </span>
                      )}
                    </div>

                    {/* Key status */}
                    <div className="text-xs font-mono">
                      {!p.requires_api_key ? (
                        <span className="text-gray-500 flex items-center gap-1">
                          <Check size={12} aria-hidden="true" />
                          {t("redteam.providerSettings.noKeyNeeded", { defaultValue: "no key needed" })}
                        </span>
                      ) : p.configured ? (
                        <span className="text-green-400 flex items-center gap-1" title={p.api_key_env}>
                          <KeyRound size={12} aria-hidden="true" />
                          {t("redteam.providerSettings.keySet", { defaultValue: "key set" })}
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1" title={p.api_key_env}>
                          <AlertTriangle size={12} aria-hidden="true" />
                          {t("redteam.providerSettings.keyMissing", { defaultValue: "key missing" })}
                          {p.api_key_env ? " (" + p.api_key_env + ")" : ""}
                        </span>
                      )}
                    </div>

                    {/* Models count */}
                    <div className="text-xs font-mono text-gray-500 flex items-center gap-1">
                      <Cpu size={12} aria-hidden="true" />
                      {(p.models || []).length} {t("redteam.providerSettings.models", { defaultValue: "models" })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEnabled(p.name, !p.enabled)}
                        disabled={toggling}
                        aria-pressed={p.enabled}
                        className={
                          "px-3 py-1.5 rounded font-mono text-xs disabled:opacity-50 " +
                          (p.enabled
                            ? "bg-green-700/30 text-green-300 border border-green-700 hover:bg-green-700/50"
                            : "bg-neutral-800 text-gray-400 border border-gray-700 hover:bg-neutral-700")
                        }
                      >
                        {p.enabled
                          ? t("redteam.providerSettings.enabledOn", { defaultValue: "Enabled" })
                          : t("redteam.providerSettings.enabledOff", { defaultValue: "Disabled" })}
                      </button>
                      <button
                        onClick={() => setActive(p.name, p.default_model)}
                        disabled={!p.enabled || isActive || settingActive}
                        title={
                          !p.enabled
                            ? t("redteam.providerSettings.enableFirst", { defaultValue: "Enable the provider first" })
                            : ""
                        }
                        className="px-3 py-1.5 rounded font-mono text-xs border border-gray-700 text-gray-300 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 flex items-center gap-1"
                      >
                        <Star size={12} aria-hidden="true" />
                        {isActive
                          ? t("redteam.providerSettings.isDefault", { defaultValue: "Default" })
                          : t("redteam.providerSettings.setDefault", { defaultValue: "Set default" })}
                      </button>
                    </div>
                  </div>

                  {/* Active model selector (only on the active provider row) */}
                  {isActive && (p.models || []).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2">
                      <label htmlFor={"active-model-" + p.name} className="text-xs text-gray-400 uppercase font-mono">
                        {t("redteam.providerSettings.activeModel", { defaultValue: "Default model" })}
                      </label>
                      <select
                        id={"active-model-" + p.name}
                        value={activeModel || p.default_model || ""}
                        disabled={settingActive}
                        onChange={(e) => setActive(p.name, e.target.value)}
                        className="px-3 py-1.5 bg-neutral-800 border border-gray-700 rounded text-white text-xs font-mono hover:border-gray-600 disabled:opacity-50"
                      >
                        {(p.models || []).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderSettingsView;
