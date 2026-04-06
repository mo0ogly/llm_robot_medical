import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Play, Zap, Download, Trash2, ChevronDown } from "lucide-react";
import useFetchWithCache from "../../hooks/useFetchWithCache";

/**
 * PromptForgeMultiLLM Component
 *
 * Interface dynamique pour tester des prompts sur plusieurs LLMs:
 * - Ollama (local)
 * - Claude (Anthropic)
 * - GPT (OpenAI)
 * - Gemini (Google)
 * - Grok (xAI)
 * - Groq (cloud)
 *
 * Features:
 * - Test single provider avec streaming
 * - Compare multiple providers en parallèle
 * - Configuration dynamique via JSON backend
 * - Memoization & performance optimization
 */
function PromptForgeMultiLLMComponent() {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState("ollama");
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [isStreaming, setIsStreaming] = useState(false);
  const [output, setOutput] = useState("");
  const [providers, setProviders] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState({});
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Memoize enabled providers list to prevent unnecessary re-renders
  const enabledProviders = useMemo(() => {
    return providers.filter(p => p.status !== "error");
  }, [providers]);

  // Memoize available models list
  const availableModels = useMemo(() => {
    return models;
  }, [models]);

  // Retry helper with exponential backoff
  const retryWithBackoff = async (fn, maxAttempts = 3, initialDelay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        if (attempt === maxAttempts) {
          throw err;
        }
        const delay = initialDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Fetch providers list on mount (deduplicated via cache)
  var { data: _providersData, error: _providersErr } = useFetchWithCache("/api/redteam/llm-providers");
  useEffect(function() {
    if (_providersData) {
      setProviders(_providersData.providers || []);
      if (_providersData.providers && _providersData.providers.length > 0) {
        setSelectedProvider(_providersData.providers[0].name);
      }
      setError(null);
    }
    if (_providersErr) {
      setError("Failed to load providers: " + _providersErr.message);
      setProviders([]);
    }
  }, [_providersData, _providersErr]);

  // Fetch models when provider changes with retry
  useEffect(() => {
    if (!selectedProvider) return;
    const fetchModels = async () => {
      try {
        const data = await retryWithBackoff(async () => {
          const res = await fetch(`/api/redteam/llm-providers/${selectedProvider}/models`, {
            signal: AbortSignal.timeout(10000)
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        }, 2, 500);

        setModels(data.models || []);
        setSelectedModel(data.models?.[0] || "");
        setError(null);
      } catch (err) {
        setError("Failed to load models: " + err.message);
        setModels([]);
      }
    };
    fetchModels();
  }, [selectedProvider]);

  // Test single provider (streaming) with retry logic
  const handleTestSingle = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsStreaming(true);
    setOutput("");
    setError(null);
    setCompareMode(false);
    abortControllerRef.current = new AbortController();

    try {
      const res = await retryWithBackoff(async () => {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const response = await fetch("/api/redteam/llm-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: selectedProvider,
            model: selectedModel,
            prompt,
            system_prompt: systemPrompt || undefined,
            temperature,
            max_tokens: maxTokens
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `HTTP ${response.status}`);
        }

        return response;
      }, 2, 1000);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "API error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let totalTokens = 0;
      let startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "complete") {
              totalTokens = data.tokens;
            } else if (data.token) {
              setOutput(prev => prev + data.token);
            }
          } catch { }
        }
      }

      const duration = Date.now() - startTime;
      const tokensPerSec = totalTokens > 0 ? (totalTokens / (duration / 1000)).toFixed(1) : 0;
      setOutput(prev => prev + `\n\n[${selectedProvider} • ${totalTokens} tokens • ${tokensPerSec} T/s]`);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Test failed: " + err.message);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  // Compare multiple providers with retry
  const handleCompare = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsStreaming(true);
    setCompareMode(true);
    setCompareResults({});
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const data = await retryWithBackoff(async () => {
        const res = await fetch("/api/redteam/llm-compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            system_prompt: systemPrompt || undefined,
            temperature,
            max_tokens: maxTokens,
            providers: enabledProviders.map(p => p.name)
          }),
          signal: abortControllerRef.current.signal
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `HTTP ${res.status}`);
        }

        return res.json();
      }, 2, 1000);

      setCompareResults(data.results || {});
      setOutput("");
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Comparison failed (retried 2x): " + err.message);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const handleClear = () => {
    setPrompt("");
    setSystemPrompt("");
    setOutput("");
    setCompareResults({});
    setError(null);
  };

  const handleExport = () => {
    const exportData = {
      prompt,
      system_prompt: systemPrompt,
      provider: selectedProvider,
      model: selectedModel,
      parameters: { temperature, max_tokens },
      results: compareMode ? compareResults : { [selectedProvider]: output },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'prompt_forge_' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Provider status badge
  const getStatusBadge = (provider) => {
    if (provider.status === "error") {
      return <span className="text-xs text-red-400">[OFFLINE]</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-mono text-[#00ff41] mb-2">
            {t("redteam.promptforge.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            Test prompts across {providers.length} LLM providers in parallel
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm font-mono">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 min-h-[600px]">
          {/* Panel A: Input Controls */}
          <div className="col-span-1 flex flex-col space-y-4 bg-neutral-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-mono text-[#00ff41]">{t("redteam.promptforge.settings")}</h2>

            {/* Provider Selector */}
            <div>
              <label
                htmlFor="provider-select"
                className="block text-xs text-gray-400 uppercase mb-2"
              >
                {t("redteam.promptforge.provider")}
              </label>
              <select
                id="provider-select"
                aria-label={t("redteam.promptforge.provider")}
                value={selectedProvider}
                onChange={e => setSelectedProvider(e.target.value)}
                disabled={isStreaming}
                className="w-full px-3 py-2 bg-neutral-800 border border-gray-700 rounded text-white text-sm font-mono hover:border-gray-600 disabled:opacity-50"
              >
                {providers.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.display_name} {p.status === "error" ? "[OFFLINE]" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div>
              <label
                htmlFor="model-select"
                className="block text-xs text-gray-400 uppercase mb-2"
              >
                {t("redteam.promptforge.model")}
              </label>
              <select
                id="model-select"
                aria-label={t("redteam.promptforge.model")}
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={isStreaming || models.length === 0}
                className="w-full px-3 py-2 bg-neutral-800 border border-gray-700 rounded text-white text-sm font-mono hover:border-gray-600 disabled:opacity-50"
              >
                {models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* System Prompt */}
            <div>
              <label
                htmlFor="system-prompt"
                className="block text-xs text-gray-400 uppercase mb-2"
              >
                {t("redteam.promptforge.system_prompt")}
              </label>
              <textarea
                id="system-prompt"
                aria-label={t("redteam.promptforge.system_prompt")}
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                disabled={isStreaming}
                rows={3}
                className="w-full px-3 py-2 bg-neutral-800 border border-gray-700 rounded text-white text-xs font-mono hover:border-gray-600 disabled:opacity-50"
                placeholder="Optional system prompt (leave empty for default)..."
              />
            </div>

            {/* Main Prompt */}
            <div className="flex-1">
              <label
                htmlFor="main-prompt"
                className="block text-xs text-gray-400 uppercase mb-2"
              >
                {t("redteam.promptforge.prompt")}
              </label>
              <textarea
                id="main-prompt"
                aria-label={t("redteam.promptforge.prompt")}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={isStreaming}
                className="w-full h-full px-3 py-2 bg-neutral-800 border border-gray-700 rounded text-white text-sm font-mono hover:border-gray-600 disabled:opacity-50 resize-none"
                placeholder="Enter your prompt here..."
              />
            </div>

            {/* Sliders */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="temperature-slider" className="text-gray-400 uppercase">
                    Temperature
                  </label>
                  <span className="text-[#00ff41] font-mono" aria-live="polite">
                    {temperature.toFixed(2)}
                  </span>
                </div>
                <input
                  id="temperature-slider"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  disabled={isStreaming}
                  aria-label="Temperature control"
                  aria-valuemin="0"
                  aria-valuemax="2"
                  aria-valuenow={temperature}
                  className="w-full disabled:opacity-50"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="max-tokens-slider" className="text-gray-400 uppercase">
                    Max Tokens
                  </label>
                  <span className="text-[#00ff41] font-mono" aria-live="polite">
                    {maxTokens}
                  </span>
                </div>
                <input
                  id="max-tokens-slider"
                  type="range"
                  min="1"
                  max="4096"
                  step="128"
                  value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  disabled={isStreaming}
                  aria-label="Maximum tokens control"
                  aria-valuemin="1"
                  aria-valuemax="4096"
                  aria-valuenow={maxTokens}
                  className="w-full disabled:opacity-50"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestSingle}
                disabled={isStreaming || !prompt}
                aria-label={t("redteam.promptforge.test_single")}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-mono text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Play size={16} aria-hidden="true" />
                {isStreaming && selectedProvider ? t("redteam.promptforge.testing") : t("redteam.promptforge.test_single")}
              </button>
              <button
                onClick={handleCompare}
                disabled={isStreaming || !prompt}
                aria-label={t("redteam.promptforge.compare_all")}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-mono text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Zap size={16} aria-hidden="true" />
                {isStreaming ? "Compare..." : t("redteam.promptforge.compare_all")}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                disabled={isStreaming || (!output && Object.keys(compareResults).length === 0)}
                aria-label="Export results as JSON"
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-mono text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Download size={16} aria-hidden="true" />
                Export
              </button>
              <button
                onClick={handleClear}
                disabled={isStreaming}
                aria-label="Clear all inputs and results"
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-mono text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Trash2 size={16} aria-hidden="true" />
                Clear
              </button>
            </div>

            {isStreaming && (
              <button
                onClick={handleStop}
                aria-label="Stop the current streaming operation"
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-mono text-sm w-full"
              >
                Stop
              </button>
            )}
          </div>

          {/* Panel B: Output Results */}
          <div className="col-span-2 flex flex-col space-y-4 bg-neutral-900 border border-gray-800 rounded-lg p-4 overflow-hidden">
            <h2 className="text-lg font-mono text-[#00ff41]">
              {compareMode ? "Comparison Results" : "Output"}
            </h2>

            {compareMode && Object.keys(compareResults).length > 0 ? (
              <div className="flex-1 grid grid-cols-2 gap-3 overflow-auto">
                {Object.entries(compareResults).map(([providerName, result]) => (
                  <div key={providerName} className="bg-neutral-800 border border-gray-700 rounded p-3 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-[#00ff41]">{providerName.toUpperCase()}</span>
                      <span className={`text-xs px-2 py-1 rounded font-mono ${
                        result.status === "ok" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {result.duration_ms}ms • {result.tokens} tokens
                    </div>
                    <div className="flex-1 text-xs text-white font-mono bg-neutral-700/50 p-2 rounded max-h-56 overflow-auto">
                      {result.response ? result.response.substring(0, 500) : "No response"}
                      {result.response && result.response.length > 500 ? "..." : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 bg-neutral-800 border border-gray-700 rounded p-3 overflow-auto font-mono text-sm text-white">
                {output || (
                  <span className="text-gray-500">
                    {isStreaming ? "Streaming response..." : "Test output appears here..."}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(PromptForgeMultiLLMComponent, (prevProps, nextProps) => {
  // Custom comparison: re-render only if props actually change
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
