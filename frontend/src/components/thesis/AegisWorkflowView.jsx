import { Compass, Layers, CheckCircle2, BookOpen, Shield, Radio, GitBranch, Target, AlertTriangle, ExternalLink, Workflow, FileCheck, Brain } from 'lucide-react';

// -----------------------------------------------------------------------------
// Source unique de verite : .claude/skills/{research-director,aegis-research-lab,
//                           aegis-validation-pipeline,bibliography-maintainer}/SKILL.md
// Papers cites : research_archive/doc_references/{2025,2026}/methodology/M*.md
// Gap analysis : research_archive/research_notes/SESSION-001_phase_c_gap_analysis_methodology_vs_skills_2026-04-11.md
// Revue : 2026-04-11
// -----------------------------------------------------------------------------

// --- Helper pour citations vers AcademicAgentsView
var PAPER_REFS = {
  M001: { short: 'Agent Laboratory',       arxiv: '2501.04227', authors: 'Schmidgall et al. 2025' },
  M002: { short: 'AI Scientist v1',        arxiv: '2408.06292', authors: 'Lu et al. 2024'         },
  M003: { short: 'AI Scientist v2',        arxiv: '2504.08066', authors: 'Yamada et al. 2025'     },
  M004: { short: 'AI co-scientist',        arxiv: '2502.18864', authors: 'Gottweis et al. 2025'   },
  M005: { short: 'agentRxiv',              arxiv: '2503.18102', authors: 'Schmidgall & Moor 2025' },
  M006: { short: 'AgentReview',            arxiv: '2406.12708', authors: 'Jin et al. 2024'        },
  M007: { short: 'MLR-Copilot',            arxiv: '2408.14033', authors: 'Li et al. 2024'         },
  M008: { short: 'ScienceAgentBench',      arxiv: '2410.05080', authors: 'Chen et al. 2024'       },
  M009: { short: 'ResearchBench',          arxiv: '2503.21248', authors: 'Liu et al. 2025'        },
  M010: { short: '4 Channels',             arxiv: '2510.09901', authors: 'Zhou et al. 2025'       },
  M011: { short: 'Survey AI Scientists',   arxiv: '2510.23045', authors: 'Tie et al. 2025'        },
  M012: { short: 'Tongyi DeepResearch',    arxiv: '2510.24701', authors: 'Tongyi Team 2025'       },
  M013: { short: 'Jr. AI Scientist',       arxiv: '2511.04583', authors: 'Miyai et al. 2026'      },
  M014: { short: 'Securing MCP',           arxiv: '2511.20920', authors: 'Errico et al. 2025'     },
  M015: { short: 'Step-DeepResearch',      arxiv: '2512.20491', authors: 'StepFun Team 2025'      },
  M016: { short: 'SAGA',                   arxiv: '2512.21782', authors: 'Du et al. 2025'         },
  M017: { short: "Why LLMs Aren't Scientists Yet", arxiv: '2601.03315', authors: 'Trehan & Chopra 2026' },
};

function Ref({ ids, note }) {
  var list = Array.isArray(ids) ? ids : [ids];
  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {list.map(function(id, i) {
        var ref = PAPER_REFS[id];
        if (!ref) return <span key={i} className="font-mono text-xs text-rose-400">{id}?</span>;
        return (
          <a
            key={i}
            href={'https://arxiv.org/abs/' + ref.arxiv}
            target="_blank"
            rel="noreferrer"
            title={ref.short + ' · ' + ref.authors}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
          >
            {id}<ExternalLink className="w-2.5 h-2.5" />
          </a>
        );
      })}
      {note && <span className="text-[10px] text-neutral-500 italic">{note}</span>}
    </span>
  );
}

// -----------------------------------------------------------------------------
// DATA — Workflow des 4 skills
// -----------------------------------------------------------------------------

var SKILLS = [
  {
    key: 'research-director',
    title: 'research-director',
    subtitle: 'Directeur de laboratoire — boucle OODA/6-étapes',
    icon: Compass,
    tint: 'blue',
    role: "Prend les décisions stratégiques : quoi chercher, pourquoi maintenant, quelles ressources. Ne délègue pas à aegis-research-lab — il propose des Research Requests (RR) et arbitre.",
    phases: [
      { name: 'OBJECTIVE',       desc: "Snapshot du laboratoire (MEMORY_STATE.md + THESIS_GAPS.md + CONJECTURES_TRACKER.md + action journal + tool-hits log).", refs: ['M011'], note: "6-stage framework" },
      { name: 'LITREVIEW',       desc: "Revue biblio AEGIS formelle avant DECOMPOSE : interrogation ChromaDB `aegis_bibliography`, seuil 0.55, max 2 tours.", refs: ['M001'], note: "mécanisme literature_review" },
      { name: '4-CHANNELS',      desc: "Tag obligatoire `canaux_touches: [1..4]` pour chaque RR (Scientists / Language / Code / Physics). Canal 4 → SUPERVISED automatique.", refs: ['M010'], note: "§7.1 irréversibilité" },
      { name: 'DECOMPOSE',       desc: "Décomposition inspiration-based : background + inspiration → hypothèse testable.", refs: ['M009'], note: "taxonomie inspiration" },
      { name: 'PLAN',            desc: "Production d'une Research Request au format JSON (criteria, success metrics, budget).", refs: ['M002', 'M007'], note: "end-to-end ML" },
      { name: 'PLAN_REVIEW',     desc: "Checklist 5 points avant ACT (clarté objectif / risque canal 4 / budget / conflit avec safety floor / reproductibilité). Max 2 révisions.", refs: ['M001', 'M006'], note: "review loop hostile" },
      { name: 'ACT',             desc: "Délégation à aegis-research-lab (APEX) ou directement à un skill spécialisé. Jamais d'exécution en propre.", refs: ['M016'], note: "bi-niveau Planner/Implementer" },
      { name: 'OBSERVE',         desc: "Lecture des livrables produits, sans reformulation. Capture du raw dans l'action journal.", refs: [] },
      { name: 'EVALUATE',        desc: "Scoring avec règle ±2σ sur conjectures. Wilson CI obligatoire sur les résultats empiriques (N≥30, width≤0.10).", refs: ['M008'], note: "rigorous assessment" },
      { name: 'REPLAN',          desc: "Déclenché si FAILURE ou PARTIAL — relance avec paramètres ajustés, max 3 tours.", refs: [] },
      { name: 'COMPLETE',        desc: "Capitalisation : mise à jour action journal, tool-hits log, MEMORY_STATE.md, regeneration du wiki statique.", refs: ['M005'], note: "AgentRxiv cumulatif" },
    ],
    safetyFloor: true,
    links: {
      skill: '.claude/skills/research-director/SKILL.md',
    },
  },
  {
    key: 'aegis-research-lab',
    title: 'aegis-research-lab',
    subtitle: 'APEX meta-orchestrateur — 9 phases étendues',
    icon: Layers,
    tint: 'emerald',
    role: "Exécute les RR produites par research-director. Couche APEX : agrège les signaux des skills atomiques (aegis-prompt-forge, fiche-attaque, etc.) et produit une note de recherche unifiée par session.",
    phases: [
      { name: 'OPEN',           desc: "Ouverture de session APEX : lecture ordonnée des 7 fichiers d'état + snapshot minimal obligatoire.", refs: ['M011'], note: "6-stage" },
      { name: 'DISCOVER',       desc: "Interrogation ChromaDB `aegis_discoveries` (apprentissage cumulatif inter-sessions). Anti-redondance : ne relance pas ce qui a déjà échoué.", refs: ['M005', 'M001'], note: "state_saves/ + AgentRxiv" },
      { name: 'TRIAGE',         desc: "Classement des bacs de travail (conjectures P0→P3, gaps IMPLEMENTE→A CONCEVOIR, découvertes actives).", refs: ['M008', 'M011'], note: "priorisation rigoureuse" },
      { name: 'DELEGATE',       desc: "Protocole 3-stages Setup/Execute/Validate. Stage 2 (Execute) refuse tout signal numérique au générateur (séparation Stackelberg anti fabrication).", refs: ['M013'], note: "§6 Issue 4 p.15, §7.3 p.16" },
      { name: 'CHECKPOINT',     desc: "Contrôles C2 Provenance (5 items) + C3 Sandbox (5 items) avant chaque exécution d'outil. Audit hash chain obligatoire.", refs: ['M014'], note: "§3.2.3 p.5, §3.2.5 p.6" },
      { name: 'ITERATE',        desc: "Boucle mle-solver : itération sur code/expériences avec validation V1-V6 à chaque cycle (markdown / no-injection / canal / Wilson / citations / hash).", refs: ['M001'], note: "mle-solver" },
      { name: 'CORRELATE',      desc: "Matrices de corrélation trans-skills (la valeur ajoutée apex). Détection de patterns non visibles à l'échelle du skill individuel.", refs: ['M004'], note: "multi-agent reflection" },
      { name: 'SYNTHESIZE',     desc: "Note de recherche avec reviewer hostile en phase 2 (inspirée de la review loop Agent Laboratory).", refs: ['M001', 'M006'], note: "review loop hostile" },
      { name: 'MEMORIZE',       desc: "Mémoire longue inter-sessions : promotion vers `aegis_discoveries`, mise à jour `tool_hits.jsonl`.", refs: ['M005'] },
      { name: 'EVOLVE',         desc: "Recommandation pour la session suivante. Calcul de la prochaine priorité (corrélation émergente + dette scientifique).", refs: ['M016'], note: "goal evolution bi-niveau" },
      { name: 'CLOSE',          desc: "Scoring report + signal SESSION_COMPLETE. Archivage de la note de recherche.", refs: [] },
    ],
    safetyFloor: true,
    links: {
      skill: '.claude/skills/aegis-research-lab/SKILL.md',
    },
  },
  {
    key: 'aegis-validation-pipeline',
    title: 'aegis-validation-pipeline',
    subtitle: 'Pipeline de validation empirique — Wilson CI 95%',
    icon: CheckCircle2,
    tint: 'amber',
    role: "Transforme un gap marqué IMPLEMENTE en fait empirique mesurable. Boucle SCAN → CAMPAGNE → WILSON → UPDATE → SIGNAL. Jamais d'interprétation sur N<30.",
    phases: [
      { name: 'SCAN',           desc: "Détection dans THESIS_GAPS.md des gaps IMPLEMENTE sans preuve empirique. Script `scan_gaps.py`.", refs: ['M008'], note: "benchmark canonique" },
      { name: 'CONFIG',         desc: "Chain mapping gap → chaînes à tester, sélection script (N≤30 standard / N≥100 lourd), définition des deux bras BEFORE/AFTER.", refs: [] },
      { name: 'EXECUTE',        desc: "Lancement `run_thesis_campaign.py` ou `run_mass_campaign_n100.py`. Logging temps réel, diagnostic en cas d'erreur.", refs: [] },
      { name: 'ANALYSE',        desc: "Calcul Wilson CI 95% (k/n, p_hat, z=1.96). Réduction ASR = (BEFORE - AFTER) / BEFORE. Interprétation par seuils (≥80% EFFICACE / 50-79% PARTIELLE / <50% INSUFFISANTE).", refs: ['M008'], note: "rubric-based eval" },
      { name: 'UPDATE',         desc: "Mise à jour THESIS_GAPS.md avec bloc résultats empiriques (ASR_BEFORE, ASR_AFTER, Wilson CI, verdict). Lecture obligatoire avant écriture.", refs: [] },
      { name: 'SIGNAL',         desc: "Emission d'un signal CAMPAIGN_COMPLETE_G-XXX_*.json dans `_staging/signals/` pour notifier les autres skills.", refs: ['M005'], note: "partage cumulatif" },
      { name: 'REVIEWER (hostile)', desc: "Phase REVIEWER hostile inspirée d'AgentReview : challenge des résultats avant intégration au wiki.", refs: ['M006'], note: "peer review dynamics" },
    ],
    safetyFloor: false,
    links: {
      skill: '.claude/skills/aegis-validation-pipeline/SKILL.md',
    },
  },
  {
    key: 'bibliography-maintainer',
    title: 'bibliography-maintainer',
    subtitle: 'Swarm 9 agents — bibliographie doctorale',
    icon: BookOpen,
    tint: 'purple',
    role: "Maintient deux collections ChromaDB disjointes : `aegis_bibliography` (46 papers sécurité LLM / Da Vinci) et `aegis_methodology_papers` (17 fiches P006 d'agents scientifiques). Mode `methodology_refresh` pour l'ingestion des fiches M*.",
    phases: [
      { name: 'COLLECTOR',      desc: "Recherche arXiv ciblée (46 articles sécurité LLM). Boucle auto-corrective si <20 résultats.", refs: ['M002', 'M007'] },
      { name: 'ANALYST',        desc: "Lecture + 34 résumés FR (500 mots). Format P006 long.", refs: [] },
      { name: 'MATHEUX',        desc: "Extraction de 22 formules avec explications pédagogiques.", refs: [] },
      { name: 'CYBERSEC',       desc: "Modèles de menaces pour 34 articles.", refs: ['M014'], note: "MCP threat model" },
      { name: 'WHITEHACKER',    desc: "18 techniques + 12 PoC issus des papers.", refs: [] },
      { name: 'LIBRARIAN',      desc: "Organisation filesystem + index + purge des doublons.", refs: [] },
      { name: 'MATHTEACHER',    desc: "7 modules de cours FR à partir des formules extraites.", refs: [] },
      { name: 'SCIENTIST',      desc: "8 axes de recherche + analyse SWOT.", refs: ['M004'], note: "reflection multi-agent" },
      { name: 'CHUNKER',        desc: "290 chunks RAG → ChromaDB (embeddings all-MiniLM-L6-v2, local, zero API).", refs: ['M005'], note: "infrastructure partage" },
    ],
    safetyFloor: false,
    links: {
      skill: '.claude/skills/bibliography-maintainer/SKILL.md',
      pipeline: 'bibliography-pipeline',
    },
  },
];

var TINT_CLASSES = {
  blue:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    text: 'text-blue-400',    strong: 'text-blue-300'    },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', strong: 'text-emerald-300' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   strong: 'text-amber-300'   },
  purple:  { border: 'border-purple-500/30',  bg: 'bg-purple-500/10',  text: 'text-purple-400',  strong: 'text-purple-300'  },
  rose:    { border: 'border-rose-500/30',    bg: 'bg-rose-500/10',    text: 'text-rose-400',    strong: 'text-rose-300'    },
};

// --- 4 canaux Zhou et al. 2025
var CHANNELS = [
  { id: 1, name: 'Scientists', short: 'Humains / hypothèses / idées', attack: "Persuasion, social engineering, alignment drift", color: 'blue' },
  { id: 2, name: 'Language',   short: 'Prompts / contextes / outputs', attack: "Prompt injection directe, indirecte, RAG poisoning", color: 'purple' },
  { id: 3, name: 'Code',       short: 'Tools / fonctions / API',       attack: "MCP content-injection, supply-chain, sandbox escape", color: 'amber' },
  { id: 4, name: 'Physics',    short: 'Effecteurs / capteurs / Da Vinci Xi', attack: "Commande chirurgicale irréversible — SUPERVISED obligatoire", color: 'rose' },
];

// --- Safety floor S1-S6
var SAFETY_FLOOR = [
  { id: 'S1', label: 'Mandat thèse AEGIS non négociable',                    src: "Spécification utilisateur SESSION-001" },
  { id: 'S2', label: 'Canal 4 (Physics) toujours en mode SUPERVISED',         src: 'M010 §7.1 p.29' },
  { id: 'S3', label: 'REVIEWER ne fournit jamais de signal numérique au générateur (Stackelberg)', src: 'M013 §7.3 p.16' },
  { id: 'S4', label: 'Règle ±2σ sur le scoring des conjectures',               src: "CONJECTURES_TRACKER.md" },
  { id: 'S5', label: 'Pas de modification SKILL.md sans autorisation supervisée', src: "Mémoire utilisateur" },
  { id: 'S6', label: 'Canal 3 outil externe nécessite validation MCP C2+C3',   src: 'M014 §3.2.3/§3.2.5' },
];

// --- 14 GAP-OPs (4 P0 fermes, 10 residuels)
var GAP_OPS = [
  { id: 'GAP-OP-01', prio: 'P0', status: 'CLOS', title: "CHECKPOINT: controles C2 provenance + C3 sandbox", skill: 'aegis-research-lab', refs: ['M014'] },
  { id: 'GAP-OP-02', prio: 'P0', status: 'CLOS', title: "Architecture bi-niveau + safety floor S1-S6 + autopilot INTERDIT", skill: 'research-director', refs: ['M016'] },
  { id: 'GAP-OP-03', prio: 'P0', status: 'CLOS', title: "Modele 4-canaux Zhou + tag canaux_touches + SUPERVISED auto canal 4", skill: 'research-director', refs: ['M010'] },
  { id: 'GAP-OP-04', prio: 'P0', status: 'CLOS', title: "Protocole DELEGATE 3-stages + refus signal numerique (Stackelberg) + V1-V6", skill: 'aegis-research-lab', refs: ['M013'] },
  { id: 'GAP-OP-05', prio: 'P1', status: 'OUVERT', title: "Checklist 6 failure modes TC-6 dans REVIEWER hostile", skill: 'aegis-research-lab', refs: ['M017'] },
  { id: 'GAP-OP-06', prio: 'P1', status: 'OUVERT', title: "4 atomic capabilities (planning/search/reflection/reporting) dans APEX", skill: 'aegis-research-lab', refs: ['M015'] },
  { id: 'GAP-OP-07', prio: 'P2', status: 'OUVERT', title: "Script scripts/checkpoint.py (automatisation C2/C3)", skill: 'aegis-research-lab', refs: ['M014'] },
  { id: 'GAP-OP-08', prio: 'P2', status: 'OUVERT', title: "Citation AgentReview dans phase REVIEWER hostile", skill: 'aegis-validation-pipeline', refs: ['M006'] },
  { id: 'GAP-OP-09', prio: 'P2', status: 'OUVERT', title: "Taxonomie inspiration-based dans DECOMPOSE", skill: 'research-director', refs: ['M009'] },
  { id: 'GAP-OP-10', prio: 'P2', status: 'OUVERT', title: "Mapping 6-stage framework vers phases OODA", skill: 'research-director', refs: ['M011'] },
  { id: 'GAP-OP-11', prio: 'P3', status: 'OUVERT', title: "Agentic Tree Search (ATS) en mode exploration", skill: 'aegis-research-lab', refs: ['M003'] },
  { id: 'GAP-OP-12', prio: 'P3', status: 'OUVERT', title: "Sous-agents generation/reflection/ranking/evolution", skill: 'aegis-research-lab', refs: ['M004'] },
  { id: 'GAP-OP-13', prio: 'P3', status: 'OUVERT', title: "Format ScienceAgentBench pour RoboAttackBench", skill: 'aegis-validation-pipeline', refs: ['M008'] },
  { id: 'GAP-OP-14', prio: 'P3', status: 'OUVERT', title: "Module d'ideation style MLR-Copilot", skill: 'research-director', refs: ['M007'] },
];

// -----------------------------------------------------------------------------
// UI helpers
// -----------------------------------------------------------------------------

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-neutral-100">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function PhaseRow({ phase, tint }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-neutral-800 last:border-b-0">
      <div className={'shrink-0 w-28 font-mono text-[11px] font-semibold ' + tint.text}>
        {phase.name}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-neutral-300 leading-snug mb-1">{phase.desc}</div>
        {phase.refs && phase.refs.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Ref ids={phase.refs} note={phase.note} />
          </div>
        )}
      </div>
    </div>
  );
}

function SkillBlock({ skill }) {
  var tint = TINT_CLASSES[skill.tint];
  var Icon = skill.icon;
  return (
    <section className="mb-10">
      <div className={'rounded-xl border ' + tint.border + ' ' + tint.bg + ' p-5 mb-4'}>
        <div className="flex items-start gap-3 mb-3">
          <div className={'p-2 rounded-lg bg-neutral-950/60 border ' + tint.border}>
            <Icon className={'w-5 h-5 ' + tint.text} />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className={'text-lg font-semibold ' + tint.strong}>{skill.title}</h3>
              {skill.safetyFloor && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40">
                  SAFETY FLOOR S1-S6
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{skill.subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed">{skill.role}</p>
        <div className="mt-3 text-[11px] font-mono text-neutral-500">
          <code>{skill.links.skill}</code>
          {skill.links.pipeline && (
            <span>
              {' · '}
              <a href={skill.links.pipeline} className="text-blue-400 hover:underline">voir pipeline détaillé</a>
            </span>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-3">
          <Workflow className="w-3.5 h-3.5" />
          <span>Workflow détaillé · {skill.phases.length} phases</span>
        </div>
        <div className="divide-y divide-neutral-800">
          {skill.phases.map(function(p, i) { return <PhaseRow key={i} phase={p} tint={tint} />; })}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Page principale
// -----------------------------------------------------------------------------

export default function AegisWorkflowView() {
  var closedCount = GAP_OPS.filter(function(g) { return g.status === 'CLOS'; }).length;
  var openCount = GAP_OPS.length - closedCount;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* HERO */}
        <header className="mb-10 pb-8 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-3 flex-wrap">
            <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30">
              AEGIS · THÈSE ENS 2026
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
              Workflow opérationnel
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
              Revue 2026-04-11
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-3">
            Workflow AEGIS : 4 skills, 36 phases, 17 papers méthodologiques
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            Le laboratoire doctoral AEGIS n'est pas un monolithe. C'est une architecture
            bi-niveau (directeur / exécuteurs) de 4 skills autonomes, chacun ancré dans
            l'état de l'art 2024-2026 des agents scientifiques. Cette page détaille chaque
            phase, cite les papers qui la fondent, et expose le safety floor qui borne
            toute exécution.
          </p>
          <p className="text-neutral-500 text-sm mt-3">
            Florent Pizzini · Doctorant ENS 2026 · Sécurité offensive des LLM intégrés au robot chirurgical Da Vinci Xi
          </p>
        </header>

        {/* INTRO — architecture bi-niveau */}
        <section className="mb-12">
          <SectionHeader
            icon={GitBranch}
            title="Architecture bi-niveau (SAGA-style)"
            subtitle="Outer loop : évolution d'objectif / Inner loop : optimisation d'exécution"
          />
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-300 leading-relaxed space-y-4">
            <p>
              L'architecture suit le cadre{' '}
              <Ref ids="M016" note="§3 p.16 + §4.1.3 p.19" /> : un niveau <strong className="text-blue-300">outer</strong>{' '}
              qui fait évoluer les objectifs long terme (conjectures, gaps, priorisation) et un niveau{' '}
              <strong className="text-emerald-300">inner</strong> qui optimise l'exécution à court terme
              (campagnes, notes de recherche, validations empiriques).
            </p>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">
{`┌────────────────────────────────────────────────────────┐
│ OUTER LOOP — évolution d'objectif (goal-evolving)      │
│                                                        │
│   research-director                                    │
│     ├─ OBJECTIVE → LITREVIEW → 4-CHANNELS → DECOMPOSE │
│     ├─ PLAN → PLAN_REVIEW → ACT (délégation)          │
│     └─ OBSERVE → EVALUATE → REPLAN → COMPLETE         │
│                                                        │
│   Produit : Research Requests (RR) + priorisation      │
└───────────────┬────────────────────────────────────────┘
                │ délégation (pas d'exécution propre)
                ▼
┌────────────────────────────────────────────────────────┐
│ INNER LOOP — optimisation d'exécution                  │
│                                                        │
│   aegis-research-lab (APEX meta-orchestrateur)         │
│     OPEN → DISCOVER → TRIAGE → DELEGATE → CHECKPOINT   │
│     ITERATE → CORRELATE → SYNTHESIZE → MEMORIZE        │
│     EVOLVE → CLOSE                                     │
│                                                        │
│   aegis-validation-pipeline (empirie ground-truth)     │
│     SCAN → CONFIG → EXECUTE → ANALYSE → UPDATE → SIGNAL│
│                                                        │
│   bibliography-maintainer (corpus documentaire)        │
│     swarm 9 agents autonomes                           │
└────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
            <p className="text-xs text-neutral-500">
              Séparation stricte : le niveau outer ne reçoit jamais de signal numérique brut du niveau inner
              (règle Stackelberg S3 — cf. safety floor ci-dessous). Le REVIEWER hostile n'envoie jamais de score
              chiffré au générateur, uniquement des verdicts qualitatifs — cette séparation est la contre-mesure
              directe contre la fabrication sous reviewer feedback identifiée par{' '}
              <Ref ids="M013" note="§6 Issue 4 p.15" />.
            </p>
          </div>
        </section>

        {/* SAFETY FLOOR S1-S6 */}
        <section className="mb-12">
          <SectionHeader
            icon={Shield}
            title="Safety floor S1-S6 inaltérable"
            subtitle="6 invariants qui bornent TOUTE exécution du laboratoire, quel que soit le skill"
          />
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rose-500/10 border-b border-rose-500/20">
                    <th className="text-left px-4 py-3 font-semibold text-rose-200 w-16">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-rose-200">Invariant</th>
                    <th className="text-left px-4 py-3 font-semibold text-rose-200 w-56">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {SAFETY_FLOOR.map(function(s) {
                    return (
                      <tr key={s.id} className="border-b border-rose-500/10 last:border-b-0">
                        <td className="px-4 py-3 font-mono font-semibold text-rose-300">{s.id}</td>
                        <td className="px-4 py-3 text-neutral-200">{s.label}</td>
                        <td className="px-4 py-3 text-xs font-mono text-neutral-500">{s.src}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Une violation de safety floor (S1-S6) déclenche un arrêt immédiat et un rapport <code className="text-rose-300">SAFETY_FLOOR_VIOLATION</code>.
            Aucun skill ne peut contourner ces invariants, même en mode autopilot — qui reste de toute façon <strong className="text-rose-300">INTERDIT</strong> en AEGIS.
          </p>
        </section>

        {/* 4 CANAUX */}
        <section className="mb-12">
          <SectionHeader
            icon={Radio}
            title="Modèle de surface d'attaque 4-canaux"
            subtitle="Décomposition Zhou et al. 2025 — chaque RR doit tagger canaux_touches: [1..4]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHANNELS.map(function(c) {
              var tint = TINT_CLASSES[c.color];
              return (
                <div key={c.id} className={'rounded-lg border ' + tint.border + ' ' + tint.bg + ' p-4'}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={'font-mono text-xs font-bold ' + tint.text}>CANAL {c.id}</span>
                    <span className={'font-semibold ' + tint.strong}>{c.name}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">{c.short}</p>
                  <p className="text-sm text-neutral-300">{c.attack}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Référence : <Ref ids="M010" note="§7.1 p.29 — irréversibilité du canal physique" />.
            Le canal 4 (Physics / Da Vinci Xi) bascule automatiquement chaque RR qui le touche en mode{' '}
            <code className="text-rose-300">SUPERVISED</code>, interdisant toute exécution autonome.
          </p>
        </section>

        {/* LES 4 SKILLS — WORKFLOW DETAILLE */}
        <section className="mb-12">
          <SectionHeader
            icon={Workflow}
            title="Workflow détaillé des 4 skills"
            subtitle="Chaque phase est annotée avec les papers méthodologiques qui l'informent"
          />
          {SKILLS.map(function(s) { return <SkillBlock key={s.key} skill={s} />; })}
        </section>

        {/* GAP-OPs */}
        <section className="mb-12">
          <SectionHeader
            icon={Target}
            title="14 GAP-OPs issus de l'analyse formelle phase (c)"
            subtitle={closedCount + ' fermés · ' + openCount + ' résiduels P1-P3'}
          />
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-900 border-b border-neutral-800">
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300 w-28">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300 w-16">Prio</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300 w-24">Statut</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300">Titre</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300 w-48">Skill ciblé</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-300 w-28">Paper</th>
                  </tr>
                </thead>
                <tbody>
                  {GAP_OPS.map(function(g) {
                    var statusTint = g.status === 'CLOS'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30';
                    var prioTint = g.prio === 'P0'
                      ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
                      : g.prio === 'P1'
                        ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                        : 'text-neutral-400 bg-neutral-700/20 border-neutral-600/30';
                    return (
                      <tr key={g.id} className="border-b border-neutral-800 hover:bg-neutral-900/80">
                        <td className="px-4 py-2.5 font-mono text-xs text-neutral-400">{g.id}</td>
                        <td className="px-4 py-2.5">
                          <span className={'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ' + prioTint}>
                            {g.prio}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ' + statusTint}>
                            {g.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-300 text-xs leading-snug">{g.title}</td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-neutral-500">{g.skill}</td>
                        <td className="px-4 py-2.5"><Ref ids={g.refs} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Source complète : <code className="font-mono text-neutral-400">research_archive/research_notes/SESSION-001_phase_c_gap_analysis_methodology_vs_skills_2026-04-11.md</code>
          </p>
        </section>

        {/* CORPUS METHODOLOGIQUE — lien vers AcademicAgentsView */}
        <section className="mb-12">
          <SectionHeader
            icon={Brain}
            title="Corpus méthodologique sous-jacent"
            subtitle="17 papers P006 indexés dans ChromaDB aegis_methodology_papers"
          />
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-300 leading-relaxed">
            <p className="mb-3">
              Les <strong className="text-neutral-100">17 papers</strong> cités ci-dessus sont tous formalisés
              en fiches P006 long template et indexés localement (136 chunks, embeddings all-MiniLM-L6-v2, zero API).
              Ils couvrent les 5 catégories fondatrices : systèmes end-to-end, benchmarks, infrastructure,
              déploiements industriels, taxonomies de limites.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="academic-agents"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-colors text-sm font-semibold"
              >
                <FileCheck className="w-4 h-4" />
                Voir le corpus complet (17 papers)
              </a>
              <a
                href="bibliography-pipeline"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Pipeline bibliography-maintainer
              </a>
            </div>
          </div>
        </section>

        {/* FAILURE MODES (M017) */}
        <section className="mb-12">
          <SectionHeader
            icon={AlertTriangle}
            title="Failure modes à surveiller (détection REVIEWER)"
            subtitle="Taxonomie Trehan & Chopra 2026 — baseline anti-dérive pour le laboratoire"
          />
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-neutral-300 leading-relaxed">
            <p className="mb-3">
              Le paper <Ref ids="M017" /> observe 6 failure modes sur 4 tentatives de recherche autonome
              indépendantes. Cette taxonomie est la baseline que doit utiliser le REVIEWER hostile
              d'aegis-research-lab pour bloquer une note de recherche avant signature.
            </p>
            <ol className="list-decimal ml-6 space-y-1.5 text-xs text-neutral-400">
              <li>Fabrication de résultats ou de citations sous pression (cf. <Ref ids="M013" note="Writing Risk 1" />)</li>
              <li>Plagiat direct ou paraphrase déguisée</li>
              <li>Déformation des résultats expérimentaux observés</li>
              <li>Hypothèses non testables ou non falsifiables</li>
              <li>Absence de rigueur statistique (N insuffisant, pas d'IC, pas de baseline)</li>
              <li>Dérive hors scope du mandat initial (alignment drift — cf. <Ref ids="M016" note="MC11" />)</li>
            </ol>
            <p className="mt-4 text-xs text-neutral-500">
              <strong className="text-amber-300">GAP-OP-05 (P1 ouvert)</strong> : intégrer cette checklist TC-6 dans le scoring REVIEWER.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 mt-12 border-t border-neutral-800 text-xs text-neutral-500 space-y-1">
          <p>
            Sources uniques de vérité :{' '}
            <code className="font-mono text-neutral-400">.claude/skills/{'{'}research-director, aegis-research-lab, aegis-validation-pipeline, bibliography-maintainer{'}'}/SKILL.md</code>
          </p>
          <p>
            Fiches méthodologiques :{' '}
            <code className="font-mono text-neutral-400">research_archive/doc_references/{'{'}2025,2026{'}'}/methodology/M*.md</code>
            {' '}(format P006)
          </p>
          <p>
            Analyse de gap formelle :{' '}
            <code className="font-mono text-neutral-400">research_archive/research_notes/SESSION-001_phase_c_gap_analysis_methodology_vs_skills_2026-04-11.md</code>
          </p>
          <p>
            Tracker de conjectures :{' '}
            <code className="font-mono text-neutral-400">research_archive/discoveries/CONJECTURES_TRACKER.md</code>
          </p>
          <p className="pt-2">
            Pages liées :{' '}
            <a href="academic-agents" className="text-blue-400 hover:underline">academic-agents</a>
            {' · '}
            <a href="bibliography-pipeline" className="text-blue-400 hover:underline">bibliography-pipeline</a>
            {' · '}
            <span className="text-neutral-600">aegis-workflow (page actuelle)</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
