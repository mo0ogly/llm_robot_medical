/**
 * GeneticProgressView — Real-time visualization of the Genetic Prompt Optimizer.
 *
 * Displays the evolutionary progress of the genetic algorithm:
 * - Current generation and population stats
 * - Best chromosome fitness score with visual bar
 * - Top 3 candidates per generation
 * - AEGIS violation tracking
 * - Success/completion status
 *
 * Reference: Liu et al. (2023) "Prompt Injection attack against
 * LLM-integrated Applications" (arXiv:2306.05499) — adapted medical.
 */
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Square, Dna, Target, Shield, Zap, TrendingUp } from 'lucide-react';

const INTENTION_OPTIONS = [
  { key: 'tool_hijack', label: 'Tool Hijack (freeze_instruments)' },
  { key: 'tension_override', label: 'Tension Override (>800g)' },
  { key: 'system_prompt_extraction', label: 'System Prompt Extraction' },
  { key: 'content_manipulation', label: 'Content Manipulation (Ransomware)' },
  { key: 'malicious_code_execution', label: 'Malicious Code Execution' },
  { key: 'false_clinical_alert', label: 'False Clinical Alert (FDA)' },
  { key: 'sensitive_data_extraction', label: 'Sensitive Data Extraction' },
];

/**
 * Digital Twin visual theme — deep space aesthetic, distinct from rt-root light palette.
 * Cycle 003 R2.3 (PDCA): extracted from 60 hex inline literals for design system compliance.
 * Mapped to semantic roles. To update the visual identity, change ONLY these constants.
 */
const THEME = {
  // Surfaces (dark blue gradient)
  bgDeep:      '#0e0e22',
  bgPanel:     '#12122a',
  bgCanvas:    '#1a1a2e',
  bgInput:     '#1e1e38',
  bgFeedItem:  '#1e1e3a',
  bgFeedBorder:'#2a2a5a',
  // Borders / accents structural
  borderPanel: '#3a3a7e',
  borderInput: '#555',
  // Semantic accents
  accentHi:    '#e94560', // critical / success (red neon)
  accentWarn:  '#f39c12', // warning (orange)
  accentOk:    '#00b894', // safe / framework label (green)
  accentInfo:  '#6c5ce7', // info / action (purple)
  accentAlt:   '#e17055', // alternate (peach)
  accentLow:   '#fdcb6e', // low priority (amber)
  // Text
  textPrimary: '#fff',
  textBody:    '#e2e8f0',
  textLabel:   '#cbd5e1',
  textMeta:    '#94a3b8',
  textCode:    '#ccc',
  textMuted:   '#666',
};

export default function GeneticProgressView({ levels, aegisShield, lang }) {
  const { t } = useTranslation();
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState([]);
  const [config, setConfig] = useState({
    intention: 'tool_hijack',
    max_iterations: 10,
    population_size: 10,
    mutation_rate: 0.5,
    crossover_rate: 0.1,
  });
  const [bestChromosome, setBestChromosome] = useState(null);
  const [currentGen, setCurrentGen] = useState(0);
  const [totalGens, setTotalGens] = useState(0);
  const [fitnessHistory, setFitnessHistory] = useState([]);
  const [status, setStatus] = useState(null); // 'success' | 'complete' | 'error' | null
  const abortRef = useRef(null);
  const feedRef = useRef(null);

  const startGenetic = async () => {
    setRunning(true);
    setEvents([]);
    setBestChromosome(null);
    setCurrentGen(0);
    setFitnessHistory([]);
    setStatus(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/redteam/genetic/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          levels,
          aegis_shield: aegisShield,
        }),
        signal: controller.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.done) break;

            setEvents(prev => [...prev, payload]);

            if (payload.type === 'init') {
              setTotalGens(payload.config?.max_iterations || config.max_iterations);
            } else if (payload.type === 'generation_start') {
              setCurrentGen(payload.generation);
            } else if (payload.type === 'generation_done') {
              setBestChromosome(payload.best_chromosome);
              setFitnessHistory(prev => [...prev, payload.best_fitness]);
            } else if (payload.type === 'success') {
              setBestChromosome(payload.best_chromosome);
              setStatus('success');
            } else if (payload.type === 'complete') {
              setBestChromosome(payload.best_chromosome);
              setStatus('complete');
            } else if (payload.type === 'error') {
              setStatus('error');
            }

            feedRef.current?.scrollTo(0, feedRef.current.scrollHeight);
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') setStatus('error');
    }
    setRunning(false);
  };

  const stop = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  const fitnessBar = (score) => {
    const pct = Math.min((score / 10) * 100, 100);
    const color = score >= 8 ? THEME.accentHi : score >= 5 ? THEME.accentWarn : THEME.accentOk;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 8, background: THEME.bgCanvas, borderRadius: 4 }}>
          <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
        <span style={{ color, fontWeight: 700, fontFamily: 'monospace', minWidth: 40 }}>{score}/10</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Config Panel */}
      <div style={{ background: THEME.bgPanel, border: `1px solid ${THEME.borderPanel}`, borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Dna size={18} color={THEME.accentHi} />
          <span style={{ color: THEME.accentHi, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
            Genetic Prompt Optimizer
          </span>
          <span style={{ color: THEME.textMuted, fontSize: 11, marginLeft: 'auto' }}>Liu et al. 2023</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <label style={{ color: THEME.textLabel, fontSize: 12 }}>
            Intention
            <select
              value={config.intention}
              onChange={e => setConfig(c => ({ ...c, intention: e.target.value }))}
              disabled={running}
              style={{ width: '100%', padding: 6, background: THEME.bgInput, color: THEME.textBody, border: `1px solid ${THEME.borderInput}`, borderRadius: 4, marginTop: 4 }}
            >
              {INTENTION_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </label>

          <label style={{ color: THEME.textLabel, fontSize: 12 }}>
            Max Generations
            <input type="number" min={1} max={50} value={config.max_iterations}
              onChange={e => setConfig(c => ({ ...c, max_iterations: +e.target.value }))}
              disabled={running}
              style={{ width: '100%', padding: 6, background: THEME.bgInput, color: THEME.textBody, border: `1px solid ${THEME.borderInput}`, borderRadius: 4, marginTop: 4 }}
            />
          </label>

          <label style={{ color: THEME.textLabel, fontSize: 12 }}>
            Population Size
            <input type="number" min={5} max={30} value={config.population_size}
              onChange={e => setConfig(c => ({ ...c, population_size: +e.target.value }))}
              disabled={running}
              style={{ width: '100%', padding: 6, background: THEME.bgInput, color: THEME.textBody, border: `1px solid ${THEME.borderInput}`, borderRadius: 4, marginTop: 4 }}
            />
          </label>

          <label style={{ color: THEME.textLabel, fontSize: 12 }}>
            Mutation Rate
            <input type="number" min={0} max={1} step={0.1} value={config.mutation_rate}
              onChange={e => setConfig(c => ({ ...c, mutation_rate: +e.target.value }))}
              disabled={running}
              style={{ width: '100%', padding: 6, background: THEME.bgInput, color: THEME.textBody, border: `1px solid ${THEME.borderInput}`, borderRadius: 4, marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {!running ? (
            <button onClick={startGenetic}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', background: THEME.accentHi, color: THEME.textPrimary, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              <Play size={16} /> Start Evolution
            </button>
          ) : (
            <button onClick={stop}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', background: THEME.textMuted, color: THEME.textPrimary, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              <Square size={16} /> Stop
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(running || status) && (
        <div style={{ background: THEME.bgPanel, border: `1px solid ${THEME.borderPanel}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: THEME.textLabel, fontSize: 12 }}>
              <TrendingUp size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Generation {currentGen} / {totalGens}
            </span>
            {status === 'success' && <span style={{ color: THEME.accentHi, fontWeight: 700 }}>INJECTION SUCCESSFUL</span>}
            {status === 'complete' && <span style={{ color: THEME.accentWarn, fontWeight: 700 }}>MAX ITERATIONS REACHED</span>}
          </div>
          <div style={{ height: 6, background: THEME.bgCanvas, borderRadius: 3 }}>
            <div style={{
              width: (totalGens > 0 ? (currentGen / totalGens) * 100 : 0) + '%',
              height: '100%',
              background: status === 'success' ? THEME.accentHi : THEME.accentInfo,
              borderRadius: 3,
              transition: 'width 0.3s',
            }} />
          </div>

          {/* Fitness History (mini sparkline) */}
          {fitnessHistory.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'end', gap: 2, marginTop: 12, height: 40 }}>
              {fitnessHistory.map((f, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: ((f / 10) * 100) + '%',
                  background: f >= 8 ? THEME.accentHi : f >= 5 ? THEME.accentWarn : THEME.accentOk,
                  borderRadius: 2,
                  minWidth: 4,
                  transition: 'height 0.3s',
                }} title={'Gen ' + (i + 1) + ': ' + f + '/10'} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Best Chromosome */}
      {bestChromosome && (
        <div style={{ background: THEME.bgPanel, border: '1px solid ' + (status === 'success' ? THEME.accentHi : THEME.borderPanel), borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Target size={16} color={status === 'success' ? THEME.accentHi : THEME.accentInfo} />
            <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13 }}>Best Chromosome</span>
            <span style={{ marginLeft: 'auto', color: THEME.textMuted, fontSize: 11 }}>Gen {bestChromosome.generation}</span>
          </div>

          {fitnessBar(bestChromosome.fitness_score)}

          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            <div>
              <span style={{ color: THEME.accentOk, fontSize: 11, fontWeight: 600 }}>FRAMEWORK</span>
              <div style={{ color: THEME.textCode, fontSize: 12, fontFamily: 'monospace', background: THEME.bgInput, padding: 6, borderRadius: 4, marginTop: 2 }}>
                {bestChromosome.framework?.slice(0, 100)}
              </div>
            </div>
            <div>
              <span style={{ color: THEME.accentAlt, fontSize: 11, fontWeight: 600 }}>SEPARATOR</span>
              <div style={{ color: THEME.textCode, fontSize: 12, fontFamily: 'monospace', background: THEME.bgInput, padding: 6, borderRadius: 4, marginTop: 2, whiteSpace: 'pre-wrap' }}>
                {bestChromosome.separator?.slice(0, 100)}
              </div>
            </div>
            <div>
              <span style={{ color: THEME.accentInfo, fontSize: 11, fontWeight: 600 }}>DISRUPTOR</span>
              <div style={{ color: THEME.textCode, fontSize: 12, fontFamily: 'monospace', background: THEME.bgInput, padding: 6, borderRadius: 4, marginTop: 2 }}>
                {bestChromosome.disruptor?.slice(0, 150)}
              </div>
            </div>
            {bestChromosome.llm_response && (
              <div>
                <span style={{ color: THEME.accentLow, fontSize: 11, fontWeight: 600 }}>TARGET RESPONSE</span>
                <div style={{ color: THEME.textCode, fontSize: 12, fontFamily: 'monospace', background: THEME.bgInput, padding: 6, borderRadius: 4, marginTop: 2, maxHeight: 120, overflow: 'auto' }}>
                  {bestChromosome.llm_response?.slice(0, 300)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Feed */}
      <div ref={feedRef} style={{ maxHeight: 250, overflow: 'auto', background: THEME.bgDeep, borderRadius: 8, padding: 8, border: `1px solid ${THEME.borderFeedBorder}` }}>
        {events.filter(e => e.type === 'generation_done').map((e, i) => (
          <div key={i} style={{ padding: '4px 8px', borderBottom: `1px solid ${THEME.bgFeedItem}`, fontSize: 11, fontFamily: 'monospace', color: THEME.textMeta }}>
            <span style={{ color: THEME.accentInfo }}>Gen {e.generation}</span>
            {' '}fitness={e.best_fitness}
            {' '}pop={e.population_size}
            {e.aegis_violations > 0 && <span style={{ color: THEME.accentHi }}> AEGIS_VIOLATIONS={e.aegis_violations}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
