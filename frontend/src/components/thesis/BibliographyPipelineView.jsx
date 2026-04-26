import { useEffect, useRef, useState } from 'react';
import { BookOpen, Users, RefreshCw, Clock, Zap, AlertCircle } from 'lucide-react';

// Raw imports of mermaid source files maintained in docs/ (single source of truth)
import pipelineMmd from '../../../../docs/mermaid_bibliography_pipeline.mmd?raw';
import communicationsMmd from '../../../../docs/mermaid_bibliography_communications.mmd?raw';
import agenticLoopMmd from '../../../../docs/mermaid_bibliography_agentic_loop.mmd?raw';

// Lazy mermaid: avoid shipping ~500KB in the main bundle
var mermaidPromise = null;
function loadMermaid() {
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = import('mermaid').then(function(m) {
    var mermaid = m.default || m;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        background: '#0a0a0a',
        primaryColor: '#162447',
        primaryTextColor: '#fff',
        primaryBorderColor: '#4472C4',
        lineColor: '#4472C4',
        secondaryColor: '#1a1a2e',
        tertiaryColor: '#0f3460',
      },
      securityLevel: 'loose',
      flowchart: { htmlLabels: true, curve: 'basis' },
    });
    return mermaid;
  });
  return mermaidPromise;
}

function MermaidDiagram({ source, id }) {
  var containerRef = useRef(null);
  var [error, setError] = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    var cancelled = false;
    setLoading(true);
    setError(null);

    loadMermaid().then(function(mermaid) {
      if (cancelled) return;
      var uniqueId = 'mmd-' + id + '-' + Math.random().toString(36).slice(2, 8);
      mermaid.render(uniqueId, source).then(function(result) {
        if (cancelled) return;
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
        setLoading(false);
      }).catch(function(err) {
        if (cancelled) return;
        console.error('Mermaid render error', id, err);
        setError(err && err.message ? err.message : String(err));
        setLoading(false);
      });
    }).catch(function(err) {
      if (cancelled) return;
      setError('Failed to load mermaid: ' + (err && err.message ? err.message : String(err)));
      setLoading(false);
    });

    return function() { cancelled = true; };
  }, [source, id]);

  return (
    <div className="relative w-full overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4 min-h-[200px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          Rendering diagram...
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <div ref={containerRef} className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto" />
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

var TIME_DATA = [
  { task: 'Recherche 46 articles',            manual: '8-12h',    agent: '10 min', gain: '×50'  },
  { task: '34 résumés FR (500 mots)',         manual: '34-51h',   agent: '8 min',  gain: '×250' },
  { task: '22 formules expliquées',           manual: '11-15h',   agent: '5 min',  gain: '×150' },
  { task: 'Modèles de menaces (34 articles)', manual: '17-25h',   agent: '5 min',  gain: '×250' },
  { task: '18 techniques + 12 PoC',           manual: '18-24h',   agent: '5 min',  gain: '×250' },
  { task: 'Organisation filesystem + index',  manual: '4-6h',     agent: '3 min',  gain: '×100' },
  { task: '7 modules de cours FR',            manual: '21-35h',   agent: '5 min',  gain: '×300' },
  { task: '8 axes de recherche + SWOT',       manual: '8-12h',    agent: '3 min',  gain: '×200' },
  { task: '290 chunks RAG',                   manual: '4-6h',     agent: '2 min',  gain: '×150' },
];

var TIME_TOTAL = { task: 'TOTAL', manual: '~125-186h', agent: '~45 min', gain: '×170-250' };

var MODES = [
  { mode: 'full_search',        trigger: '"full", "complete"',   agents: '9 agents (pipeline complet)' },
  { mode: 'incremental',        trigger: '"update", "weekly"',   agents: '9 agents (nouveaux articles)' },
  { mode: 'analyze_only',       trigger: '"analyze"',            agents: '8 agents (sans COLLECTOR)' },
  { mode: 'curriculum_update',  trigger: '"math", "modules"',    agents: 'MATHEUX + MATHTEACHER' },
  { mode: 'research_axes',      trigger: '"axes", "research"',   agents: 'SCIENTIST uniquement' },
  { mode: 'rag_refresh',        trigger: '"chunks", "refresh"',  agents: 'CHUNKER uniquement' },
];

export default function BibliographyPipelineView() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* HERO */}
        <header className="mb-10 pb-8 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-3">
            <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30">
              AEGIS · THÈSE ENS 2026
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
              bibliography-maintainer
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-3">
            9 Agents IA Autonomes pour une Thèse Doctorale
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            De la recherche bibliographique manuelle à un swarm d'agents spécialisés qui
            découvrent, analysent, enseignent et préparent 46 articles en 45 minutes.
          </p>
          <p className="text-neutral-500 text-sm mt-3">
            Florent Pizzini · Doctorant ENS 2026 · Sécurité IA &amp; Prompt Injection
          </p>
        </header>

        {/* SECTION 1 — PIPELINE */}
        <section className="mb-12">
          <SectionHeader
            icon={BookOpen}
            title="1. Pipeline 5 phases + gates"
            subtitle="Chaque phase produit un livrable validé par une porte de sortie. Si la gate échoue, l'agent relance avec des paramètres ajustés."
          />
          <MermaidDiagram source={pipelineMmd} id="pipeline" />
          <p className="text-xs text-neutral-500 mt-3 font-mono">
            Source : <code>docs/mermaid_bibliography_pipeline.mmd</code>
          </p>
        </section>

        {/* SECTION 2 — COMMUNICATIONS */}
        <section className="mb-12">
          <SectionHeader
            icon={Users}
            title="2. Communications inter-agents"
            subtitle="La vraie innovation n'est pas d'avoir 9 agents — c'est la façon dont ils communiquent via une mémoire partagée (MEMORY_STATE.md) et des livrables structurés."
          />
          <MermaidDiagram source={communicationsMmd} id="comms" />
          <p className="text-xs text-neutral-500 mt-3 font-mono">
            Source : <code>docs/mermaid_bibliography_communications.mmd</code>
          </p>
        </section>

        {/* SECTION 3 — BOUCLE AGENTIQUE */}
        <section className="mb-12">
          <SectionHeader
            icon={RefreshCw}
            title="3. Boucle agentique 8 étapes"
            subtitle="Chaque agent n'est pas un simple script — il suit une boucle cognitive auto-corrective. Si le COLLECTOR ne trouve que 15 articles (sous le seuil de 20), il REPLANIFIE."
          />
          <div className="max-w-2xl mx-auto">
            <MermaidDiagram source={agenticLoopMmd} id="loop" />
          </div>
          <p className="text-xs text-neutral-500 mt-3 font-mono text-center">
            Source : <code>docs/mermaid_bibliography_agentic_loop.mmd</code>
          </p>
        </section>

        {/* SECTION 4 — GAINS DE TEMPS */}
        <section className="mb-12">
          <SectionHeader
            icon={Clock}
            title="4. Gains de temps — chiffres réels"
            subtitle="Comparaison factuelle entre le travail manuel et le système multi-agent sur un RUN-001 (full_search)."
          />
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-900 border-b border-neutral-800">
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300">Tâche</th>
                    <th className="text-right px-4 py-3 font-semibold text-neutral-300">Manuel</th>
                    <th className="text-right px-4 py-3 font-semibold text-neutral-300">Multi-agent</th>
                    <th className="text-right px-4 py-3 font-semibold text-neutral-300">Gain</th>
                  </tr>
                </thead>
                <tbody>
                  {TIME_DATA.map(function(row, i) {
                    return (
                      <tr key={i} className="border-b border-neutral-800 hover:bg-neutral-900/80">
                        <td className="px-4 py-2.5 text-neutral-200">{row.task}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-neutral-400">{row.manual}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{row.agent}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-semibold text-blue-400">{row.gain}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-neutral-900/90 font-bold">
                    <td className="px-4 py-3 text-neutral-100">{TIME_TOTAL.task}</td>
                    <td className="px-4 py-3 text-right font-mono text-neutral-200">{TIME_TOTAL.manual}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-300">{TIME_TOTAL.agent}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-300">{TIME_TOTAL.gain}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5">
            <p className="text-sm text-neutral-300">
              <span className="font-semibold text-emerald-400">
                Facteur multiplicateur réel : ×170 à ×250.
              </span>{' '}
              Les exécutions suivantes (mode incremental) prennent ~15 minutes car les
              agents ne traitent que les nouveaux articles. Sur un an de thèse avec des
              mises à jour hebdomadaires, le gain cumulé est de l'ordre de{' '}
              <strong>500-800 heures</strong>.
            </p>
          </div>
        </section>

        {/* SECTION 5 — MODES */}
        <section className="mb-12">
          <SectionHeader
            icon={Zap}
            title="5. Six modes pour six besoins"
            subtitle="Le système offre 6 modes d'exécution, chacun adapté à un besoin spécifique."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODES.map(function(m, i) {
              return (
                <div key={i} className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-600 transition-all">
                  <div className="font-mono text-sm font-semibold text-blue-400 mb-2">{m.mode}</div>
                  <div className="text-xs text-neutral-500 mb-1.5">Déclencheur</div>
                  <div className="font-mono text-xs text-neutral-300 mb-3">{m.trigger}</div>
                  <div className="text-xs text-neutral-500 mb-1.5">Agents actifs</div>
                  <div className="text-xs text-neutral-200">{m.agents}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 mt-12 border-t border-neutral-800 text-xs text-neutral-500">
          <p>
            Article original : <code className="font-mono text-neutral-400">research_archive/_staging/Article_LinkedIn_Multi_Agent_Research_Team.docx</code>
          </p>
          <p className="mt-1">
            Source reproductible : <code className="font-mono text-neutral-400">research_archive/_staging/generate_linkedin_article.py</code>
          </p>
          <p className="mt-1">
            Schémas : <code className="font-mono text-neutral-400">docs/mermaid_bibliography_*.mmd</code>
          </p>
          <p className="pt-3">
            Pages liées :{' '}
            <a href="aegis-workflow" className="text-blue-400 hover:underline">aegis-workflow (workflow détaillé 4 skills)</a>
            {' · '}
            <a href="academic-agents" className="text-blue-400 hover:underline">academic-agents (17 papers méthodologiques)</a>
            {' · '}
            <span className="text-neutral-600">bibliography-pipeline (page actuelle)</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
