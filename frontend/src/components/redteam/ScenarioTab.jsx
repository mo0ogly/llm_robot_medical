// frontend/src/components/redteam/ScenarioTab.jsx
import { useState, useEffect, useRef } from "react";
import { Play, Square, ChevronDown, ChevronRight, Shield, AlertTriangle } from "lucide-react";

const ATTACK_TYPE_COLORS = {
  prompt_leak: "border-purple-500/30 text-purple-400",
  rule_bypass: "border-orange-500/30 text-orange-400",
  injection: "border-red-500/30 text-red-400",
};

const ATTACK_TYPE_LABELS = {
  prompt_leak: "PROMPT LEAK",
  rule_bypass: "RULE BYPASS",
  injection: "INJECTION",
};

const STATUS_STYLES = {
  pending: "bg-gray-800 text-gray-500 border-gray-700",
  running: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse",
  passed: "bg-red-500/10 text-red-400 border-red-500/30",
  blocked: "bg-[#00ff41]/10 text-[#00ff41] border-[#00ff41]/30",
};

export default function ScenarioTab() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [running, setRunning] = useState(false);
  const [stepStates, setStepStates] = useState([]);
  const [scenarioSummary, setSummary] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    fetch("/api/redteam/scenarios")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setScenarios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const runScenario = async (scenarioId) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setSelectedId(scenarioId);
    setRunning(true);
    setSummary(null);
    setExpandedStep(null);
    setStepStates(scenario.steps.map((s) => ({ ...s, status: "pending", result: null })));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/redteam/scenario/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scenarioId }),
        signal: controller.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === "step_start") {
              setStepStates((prev) =>
                prev.map((s, i) =>
                  i === payload.step_index ? { ...s, status: "running" } : s
                )
              );
            } else if (payload.type === "step_result") {
              setStepStates((prev) =>
                prev.map((s, i) =>
                  i === payload.step_index
                    ? { ...s, status: payload.status, result: payload }
                    : s
                )
              );
            } else if (payload.type === "scenario_done") {
              setSummary(payload);
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    }
    setRunning(false);
  };

  const stopScenario = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  if (loading) return <p className="text-gray-600 animate-pulse">Loading scenarios...</p>;

  const selected = scenarios.find((s) => s.id === selectedId);

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <div className="space-y-2">
        {scenarios.map((s) => (
          <div
            key={s.id}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedId === s.id
                ? "border-[#00ff41]/50 bg-[#00ff41]/5"
                : "border-gray-800 hover:border-gray-600"
            }`}
            onClick={() => !running && setSelectedId(s.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-gray-200">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600">{s.steps.length} etapes</span>
                {s.mitre_ttps.map((ttp) => (
                  <span
                    key={ttp}
                    className="text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-500/5"
                  >
                    {ttp}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Run button */}
      {selectedId && (
        <div className="flex gap-2">
          {!running ? (
            <button
              onClick={() => runScenario(selectedId)}
              className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                         text-[#00ff41] border border-[#00ff41]/50 rounded
                         hover:bg-[#00ff41]/10 transition-colors"
            >
              <Play size={12} /> LANCER SCENARIO
            </button>
          ) : (
            <button
              onClick={stopScenario}
              className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold
                         text-red-400 border border-red-500/50 rounded
                         hover:bg-red-500/10 transition-colors"
            >
              <Square size={12} /> STOP
            </button>
          )}
        </div>
      )}

      {/* Timeline */}
      {stepStates.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] text-gray-600 tracking-wider mb-2">
            EXECUTION — {selected?.name}
          </div>
          {stepStates.map((step, i) => (
            <div key={i} className="relative">
              {i < stepStates.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gray-800" />
              )}
              <div
                className={`border rounded p-2 cursor-pointer transition-colors ${STATUS_STYLES[step.status]}`}
                onClick={() => step.result && setExpandedStep(expandedStep === i ? null : i)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                      step.status === "pending"
                        ? "bg-gray-600"
                        : step.status === "running"
                        ? "bg-yellow-400"
                        : step.status === "passed"
                        ? "bg-red-400"
                        : "bg-[#00ff41]"
                    }`}
                  />
                  <span className="text-xs font-bold flex-1">{step.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded border ${
                      ATTACK_TYPE_COLORS[step.attack_type]
                    }`}
                  >
                    {ATTACK_TYPE_LABELS[step.attack_type]}
                  </span>
                  <span className="text-[9px] uppercase font-bold">{step.status}</span>
                  {step.result && (
                    expandedStep === i ? <ChevronDown size={10} /> : <ChevronRight size={10} />
                  )}
                </div>
              </div>

              {expandedStep === i && step.result && (
                <div className="ml-4 mt-1 mb-2 border border-gray-800 rounded p-3 bg-[#0d0d0d] space-y-2">
                  <div>
                    <div className="text-[10px] text-gray-600 mb-1">OBJECTIF</div>
                    <div className="text-xs text-gray-400">{step.result.objective}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 mb-1">ATTAQUE</div>
                    <pre className="text-xs text-red-400/70 whitespace-pre-wrap">
                      {step.result.attack_message}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 mb-1">REPONSE DA VINCI</div>
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {step.result.target_response}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 mb-1">ANALYSE AEGIS</div>
                    <pre className="text-xs text-blue-400/70 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {step.result.audit_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scenario summary */}
      {scenarioSummary && (
        <div
          className={`border rounded p-3 ${
            scenarioSummary.steps_passed > 0
              ? "border-red-500/30 bg-red-500/5"
              : "border-[#00ff41]/30 bg-[#00ff41]/5"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {scenarioSummary.steps_passed > 0 ? (
              <AlertTriangle size={14} className="text-red-400" />
            ) : (
              <Shield size={14} className="text-[#00ff41]" />
            )}
            <span
              className={`text-xs font-bold ${
                scenarioSummary.steps_passed > 0 ? "text-red-400" : "text-[#00ff41]"
              }`}
            >
              {scenarioSummary.steps_passed > 0 ? "BRECHE DETECTEE" : "DEFENSES INTACTES"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <span className="text-gray-500">Etapes:</span>
            <span className="text-gray-300">
              {scenarioSummary.steps_passed}/{scenarioSummary.total_steps} reussies
            </span>
            <span className="text-gray-500">Breach point:</span>
            <span className="text-gray-300">
              {scenarioSummary.breach_point !== null
                ? `Etape ${scenarioSummary.breach_point + 1}`
                : "Aucun"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
