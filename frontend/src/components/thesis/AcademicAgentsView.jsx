import { FlaskConical, Gauge, Network, Factory, AlertTriangle, BookMarked, ExternalLink, Database, Sparkles } from 'lucide-react';

// -----------------------------------------------------------------------------
// Source unique de verite :
//   research_archive/doc_references/{2025,2026}/methodology/M*.md  (format P006)
// Collection ChromaDB : aegis_methodology_papers (136 chunks, 17 fiches)
// Dump extrait via : backend/chroma_db + script ingest_methodology_paper.py
// Date de revue : 2026-04-11
// -----------------------------------------------------------------------------

var PAPERS = [
  {
    id: 'M001',
    arxiv: '2501.04227',
    short: 'Agent Laboratory',
    title: 'Agent Laboratory: Using LLM Agents as Research Assistants',
    authors: 'Schmidgall et al.',
    year: 2025,
    venue: 'arXiv preprint (cs.AI)',
    category: 'foundations',
    pertinence: "Fonde les quatre phases ITERATE / CHECKPOINT / REVIEWER / LITREVIEW reprises par aegis-research-lab. Mode co-pilot vs autonomous directement transposable.",
    source: 'research_archive/doc_references/2025/methodology/M001_AgentLaboratory_2025_ResearchAssistant.md',
  },
  {
    id: 'M002',
    arxiv: '2408.06292',
    short: 'AI Scientist v1',
    title: 'The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery',
    authors: 'Lu et al. (Sakana AI)',
    year: 2024,
    venue: 'arXiv preprint (cs.AI)',
    category: 'foundations',
    pertinence: "Premier systeme end-to-end 2024 : idee -> code -> experience -> redaction -> review. Baseline historique pour mesurer les gains des versions ulterieures.",
    source: 'research_archive/doc_references/2025/methodology/M002_AIScientist_v1_2024_AutomatedDiscovery.md',
  },
  {
    id: 'M003',
    arxiv: '2504.08066',
    short: 'AI Scientist v2',
    title: 'The AI Scientist-v2: Workshop-Level Automated Scientific Discovery via Agentic Tree Search',
    authors: 'Yamada et al.',
    year: 2025,
    venue: 'ICLR 2025 Workshop',
    category: 'foundations',
    pertinence: "Tree search agentique -> premier paper genere par IA accepte en peer-review workshop. Preuve operationnelle que la methode converge au-dela du jouet.",
    source: 'research_archive/doc_references/2025/methodology/M003_AIScientist_v2_2025_TreeSearchDiscovery.md',
  },
  {
    id: 'M004',
    arxiv: '2502.18864',
    short: 'AI co-scientist',
    title: 'Towards an AI co-scientist',
    authors: 'Gottweis et al. (Google DeepMind)',
    year: 2025,
    venue: 'Preprint arXiv',
    category: 'foundations',
    pertinence: "Architecture multi-agent Gemini 2.0 : generation, reflection, ranking, evolution, meta-review. Paradigme scientist-in-the-loop a opposer au full-autonomy.",
    source: 'research_archive/doc_references/2025/methodology/M004_AIcoScientist_2025_MultiAgentHypothesis.md',
  },
  {
    id: 'M007',
    arxiv: '2408.14033',
    short: 'MLR-Copilot',
    title: 'MLR-Copilot: Autonomous Machine Learning Research based on Large Language Models Agents',
    authors: 'Li et al.',
    year: 2024,
    venue: 'arXiv preprint',
    category: 'foundations',
    pertinence: "Systeme end-to-end focalise ML research : hypothese, experiment design, implementation, evaluation. Architecture mappable sur aegis-research-lab.",
    source: 'research_archive/doc_references/2025/methodology/M007_MLRCopilot_2024_AutonomousMLResearch.md',
  },

  {
    id: 'M006',
    arxiv: '2406.12708',
    short: 'AgentReview',
    title: 'AgentReview: Exploring Peer Review Dynamics with LLM Agents',
    authors: 'Jin et al.',
    year: 2024,
    venue: 'EMNLP 2024',
    category: 'benchmarks',
    pertinence: "Simulation de dynamiques de peer review multi-agent. Fonde la phase REVIEWER hostile d'aegis-validation-pipeline.",
    source: 'research_archive/doc_references/2025/methodology/M006_AgentReview_2024_PeerReviewSimulation.md',
  },
  {
    id: 'M008',
    arxiv: '2410.05080',
    short: 'ScienceAgentBench',
    title: 'ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery',
    authors: 'Chen et al.',
    year: 2024,
    venue: 'ICLR 2025',
    category: 'benchmarks',
    pertinence: "Format canonique de tache scientifique (instruction / dataset / expected artifact / rubric). Base du format RoboAttackBench propose en SESSION-002.",
    source: 'research_archive/doc_references/2025/methodology/M008_ScienceAgentBench_2024_RigorousAssessment.md',
  },
  {
    id: 'M009',
    arxiv: '2503.21248',
    short: 'ResearchBench',
    title: 'ResearchBench: Benchmarking LLMs in Scientific Discovery via Inspiration-Based Task Decomposition',
    authors: 'Liu et al.',
    year: 2025,
    venue: 'arXiv preprint',
    category: 'benchmarks',
    pertinence: "Taxonomie inspiration-based (background + inspiration -> hypothese). Methodologie directement informante de la phase DECOMPOSE d'aegis-research-lab.",
    source: 'research_archive/doc_references/2025/methodology/M009_ResearchBench_2025_InspirationDecomposition.md',
  },

  {
    id: 'M005',
    arxiv: '2503.18102',
    short: 'agentRxiv',
    title: 'AgentRxiv: Towards Collaborative Autonomous Research',
    authors: 'Schmidgall & Moor',
    year: 2025,
    venue: 'arXiv preprint',
    category: 'infrastructure',
    pertinence: "Paper fondateur du partage cumulatif entre agents. AEGIS est une implementation locale adaptee au domaine securite LLM medicale.",
    source: 'research_archive/doc_references/2025/methodology/M005_agentRxiv_2025_CumulativeLearning.md',
  },
  {
    id: 'M014',
    arxiv: '2511.20920',
    short: 'Securing MCP',
    title: 'Securing the Model Context Protocol (MCP): Risks, Controls, and Governance',
    authors: 'Errico, Ngiam, Sojan',
    year: 2025,
    venue: 'arXiv preprint (cs.CR)',
    category: 'infrastructure',
    priority: 'P0',
    pertinence: "Threat model MCP : content-injection, supply-chain, unintentional adversarial agents. Le CHECKPOINT AEGIS doit integrer validation provenance + verification sandbox avant execution outil. Fonde MC8/MC9 (conjectures P0 CRITIQUE).",
    source: 'research_archive/doc_references/2025/methodology/M014_SecuringMCP_2025_ThreatModel.md',
  },
  {
    id: 'M015',
    arxiv: '2512.20491',
    short: 'Step DeepResearch',
    title: 'Step-DeepResearch Technical Report',
    authors: 'StepFun Agent Team',
    year: 2025,
    venue: 'arXiv preprint (cs.CL)',
    category: 'infrastructure',
    pertinence: "Quatre atomic capabilities : planning / deep search / reflection / reporting. Decomposition directement reutilisable pour AEGIS.",
    source: 'research_archive/doc_references/2025/methodology/M015_StepDeepResearch_2025_AtomicCapabilities.md',
  },

  {
    id: 'M012',
    arxiv: '2510.24701',
    short: 'Tongyi DeepResearch',
    title: 'Tongyi DeepResearch: premier deep research agent open-source de niveau industriel',
    authors: 'Tongyi DeepResearch Team (Alibaba)',
    year: 2025,
    venue: 'arXiv preprint (cs.CL)',
    category: 'industrial',
    pertinence: "Pipeline d'entrainement Mid-training -> SFT -> RL avec environments customises par stage. Plan d'entrainement credible pour un aegis-research-agent interne.",
    source: 'research_archive/doc_references/2025/methodology/M012_TongyiDeepResearch_2025_OpenSourceIndustrial.md',
  },
  {
    id: 'M013',
    arxiv: '2511.04583',
    short: 'Jr. AI Scientist',
    title: 'Jr. AI Scientist and Its Risk Report: Exploration Autonome depuis un Baseline Paper (Claude Code)',
    authors: 'Miyai et al.',
    year: 2026,
    venue: 'TMLR 02/2026 (peer reviewed)',
    category: 'industrial',
    priority: 'P0',
    pertinence: "Risk report officiel : fabrication, plagiat, deformation de resultats observes sur 4 tentatives autonomes. Cadre 3-stage de l'Experiment Phase transposable a aegis-research-lab. Fonde G-053.",
    source: 'research_archive/doc_references/2025/methodology/M013_JrAIScientist_2025_RiskReport.md',
  },
  {
    id: 'M016',
    arxiv: '2512.21782',
    short: 'SAGA',
    title: 'Accelerating Scientific Discovery with Autonomous Goal-evolving Agents (SAGA)',
    authors: 'Du, Yu, Liu, Shen et al.',
    year: 2025,
    venue: 'arXiv preprint (cs.AI)',
    category: 'industrial',
    priority: 'P0',
    pertinence: "Architecture bi-niveau director / executor avec evolution d'objectif. Prototype le plus proche d'un directeur de laboratoire autonome. Introduit l'alignment drift comme surface d'attaque. Fonde MC11/MC12 (P0 CRITIQUE).",
    source: 'research_archive/doc_references/2025/methodology/M016_SAGA_2025_GoalEvolving.md',
  },

  {
    id: 'M010',
    arxiv: '2510.09901',
    short: '4 Channels',
    title: 'Autonomous Agents for Scientific Discovery: Orchestrating Scientists, Language, Code, and Physics',
    authors: 'Zhou et al.',
    year: 2025,
    venue: 'arXiv preprint (cs.AI)',
    category: 'limits',
    priority: 'P0',
    pertinence: "Cadre 4-canaux Scientists / Language / Code / Physics directement reinterpretable en 4 surfaces d'entree pour un attaquant. Fonde le design 4x4 de RoboAttackBench et le gap G-050 (canal physique).",
    source: 'research_archive/doc_references/2025/methodology/M010_AutonomousAgentsScientificDiscovery_2025_FourChannels.md',
  },
  {
    id: 'M011',
    arxiv: '2510.23045',
    short: 'Survey AI Scientists',
    title: 'A Survey of AI Scientists',
    authors: 'Tie et al.',
    year: 2025,
    venue: 'arXiv preprint (cs.AI)',
    category: 'limits',
    pertinence: "Decomposition six-stage : fournit un gabarit direct pour les etats de la machine OODA du research-director.",
    source: 'research_archive/doc_references/2025/methodology/M011_SurveyAIScientists_2025_SixStageFramework.md',
  },
  {
    id: 'M017',
    arxiv: '2601.03315',
    short: "Why LLMs Aren't Scientists Yet",
    title: "Why LLMs Aren't Scientists Yet: Lessons from Four Autonomous Research Attempts",
    authors: 'Trehan & Chopra',
    year: 2026,
    venue: 'arXiv preprint (cs.LG)',
    category: 'limits',
    pertinence: "Taxonomie des 6 failure modes observes sur 4 tentatives autonomes. Baseline de detection directement reutilisable pour REVIEWER.",
    source: 'research_archive/doc_references/2026/methodology/M017_WhyLLMsArentScientistsYet_2026_FailureModes.md',
  },
];

var CATEGORIES = [
  {
    key: 'foundations',
    icon: FlaskConical,
    label: 'Systemes end-to-end fondateurs',
    subtitle: 'Architectures completes idee -> code -> experience -> redaction',
    tint: 'blue',
  },
  {
    key: 'benchmarks',
    icon: Gauge,
    label: 'Benchmarks & evaluation',
    subtitle: 'Referentiels de mesure de la qualite des agents scientifiques',
    tint: 'purple',
  },
  {
    key: 'infrastructure',
    icon: Network,
    label: 'Protocoles & infrastructure',
    subtitle: 'Partage de resultats, MCP, decomposition atomique',
    tint: 'emerald',
  },
  {
    key: 'industrial',
    icon: Factory,
    label: "Passage a l'echelle industriel",
    subtitle: 'Systemes deployes et rapports de risque peer-reviewed',
    tint: 'amber',
  },
  {
    key: 'limits',
    icon: AlertTriangle,
    label: 'Taxonomies, frameworks & limites',
    subtitle: 'Cadres conceptuels + failure modes observes',
    tint: 'rose',
  },
];

var TINT_CLASSES = {
  blue:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    text: 'text-blue-400'    },
  purple:  { border: 'border-purple-500/30',  bg: 'bg-purple-500/10',  text: 'text-purple-400'  },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-400'   },
  rose:    { border: 'border-rose-500/30',    bg: 'bg-rose-500/10',    text: 'text-rose-400'    },
};

// MC conjectures P0 CRITIQUE issues du refresh 2026-04-11
// Source de verite : research_archive/discoveries/CONJECTURES_TRACKER.md
var MC_P0 = [
  { id: 'MC8',  label: 'MCP comme surface d\'attaque primaire Da Vinci', source: 'M014 Securing MCP' },
  { id: 'MC9',  label: 'Content-injection MCP = exfiltration commande chirurgicale', source: 'M014 Securing MCP' },
  { id: 'MC11', label: 'Alignment drift des goal-evolving agents = risque 10/10', source: 'M016 SAGA' },
  { id: 'MC12', label: 'Architecture bi-niveau director/executor = vecteur d\'escalade de privileges', source: 'M016 SAGA' },
];

// -----------------------------------------------------------------------------
// Helpers UI
// -----------------------------------------------------------------------------

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5">
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

function PaperCard({ paper }) {
  var arxivUrl = 'https://arxiv.org/abs/' + paper.arxiv;
  var isP0 = paper.priority === 'P0';
  return (
    <article className={
      'rounded-lg border bg-neutral-900/60 hover:bg-neutral-900/90 transition-all p-4 '
      + (isP0 ? 'border-rose-500/40' : 'border-neutral-800 hover:border-neutral-600')
    }>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-neutral-500">{paper.id}</span>
          <span className="font-mono text-xs text-neutral-600">·</span>
          <span className="font-semibold text-neutral-100 text-sm">{paper.short}</span>
          {isP0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/40">
              P0 CRITIQUE
            </span>
          )}
        </div>
        <a
          href={arxivUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-neutral-500 hover:text-blue-400 transition-colors"
          title={'arXiv:' + paper.arxiv}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <h3 className="text-sm text-neutral-300 leading-snug mb-2">{paper.title}</h3>
      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-3 flex-wrap">
        <span>{paper.authors}</span>
        <span>·</span>
        <span>{paper.year}</span>
        <span>·</span>
        <span className="text-neutral-600 truncate">{paper.venue}</span>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">{paper.pertinence}</p>
    </article>
  );
}

function CategoryBlock({ category, papers }) {
  var tint = TINT_CLASSES[category.tint];
  var Icon = category.icon;
  var count = papers.length;
  return (
    <section className="mb-10">
      <div className="flex items-start gap-3 mb-4">
        <div className={'p-2 rounded-lg ' + tint.bg + ' border ' + tint.border}>
          <Icon className={'w-5 h-5 ' + tint.text} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold text-neutral-100">{category.label}</h2>
            <span className={'text-xs font-mono ' + tint.text}>{count} article{count > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{category.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {papers.map(function(p) { return <PaperCard key={p.id} paper={p} />; })}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Page principale
// -----------------------------------------------------------------------------

export default function AcademicAgentsView() {
  var totalPapers = PAPERS.length;
  var p0Count = PAPERS.filter(function(p) { return p.priority === 'P0'; }).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* HERO */}
        <header className="mb-10 pb-8 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-3 flex-wrap">
            <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30">
              AEGIS · THESE ENS 2026
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
              Chapitre Methodologie
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
              Revue 2026-04-11
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-3">
            Agents scientifiques autonomes : {totalPapers} articles fondateurs
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            Les systemes qui automatisent la recherche scientifique end-to-end :
            ce qu'ils font, ce qu'ils prouvent, ou ils echouent. Corpus methodologique
            sur lequel repose le laboratoire <code className="font-mono text-sm text-blue-300">aegis-research-lab</code>.
          </p>
          <p className="text-neutral-500 text-sm mt-3">
            Florent Pizzini · Doctorant ENS 2026 · Securite offensive des LLM integres aux robots chirurgicaux Da Vinci Xi
          </p>
        </header>

        {/* INTRO */}
        <section className="mb-10">
          <SectionHeader
            icon={BookMarked}
            title="Pourquoi ce corpus ?"
            subtitle="Ancrer dans la litterature la methode multi-agent employee dans la these elle-meme"
          />
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-300 leading-relaxed space-y-3">
            <p>
              La these AEGIS n'utilise pas seulement des agents IA comme objet d'etude — elle
              s'appuie elle-meme sur un swarm de 9 agents autonomes
              (<a href="bibliography-pipeline" className="text-blue-400 hover:underline">voir la page bibliography-pipeline</a>).
              Cette meta-utilisation exige que la methodologie soit ancree dans
              l'etat de l'art scientifique, pas reinventee.
            </p>
            <p>
              Ces <strong className="text-neutral-100">{totalPapers} articles</strong> (2024-2026) constituent le
              canon actuel du domaine des agents scientifiques autonomes. Ils couvrent les
              systemes fondateurs (AI Scientist v1/v2, AI co-scientist, Agent Laboratory),
              les benchmarks rigoureux (ScienceAgentBench, ResearchBench), les protocoles
              d'infrastructure (MCP, agentRxiv), les deploiements industriels (Tongyi,
              SAGA), et surtout les <strong className="text-rose-300">limites
              empiriquement observees</strong> (Jr. AI Scientist risk report, Why LLMs Aren't
              Scientists Yet).
            </p>
            <p>
              <strong className="text-neutral-100">{p0Count} articles</strong> sont classes
              P0 CRITIQUE — ils fondent des gaps et conjectures bloquants pour le chapitre
              Contribution de la these.
            </p>
          </div>
        </section>

        {/* GROUPES THEMATIQUES */}
        <div className="mb-12">
          {CATEGORIES.map(function(cat) {
            var papers = PAPERS.filter(function(p) { return p.category === cat.key; });
            return <CategoryBlock key={cat.key} category={cat} papers={papers} />;
          })}
        </div>

        {/* CONJECTURES MC P0 */}
        <section className="mb-12">
          <SectionHeader
            icon={Sparkles}
            title="Ce corpus formalise 13 conjectures methodologiques (MC1-MC13)"
            subtitle="4 conjectures P0 CRITIQUE directement issues du refresh 2026-04-11"
          />
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rose-500/10 border-b border-rose-500/20">
                    <th className="text-left px-4 py-3 font-semibold text-rose-200 w-20">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-rose-200">Conjecture</th>
                    <th className="text-left px-4 py-3 font-semibold text-rose-200 w-64">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {MC_P0.map(function(mc) {
                    return (
                      <tr key={mc.id} className="border-b border-rose-500/10 last:border-b-0">
                        <td className="px-4 py-3 font-mono font-semibold text-rose-300">{mc.id}</td>
                        <td className="px-4 py-3 text-neutral-200">{mc.label}</td>
                        <td className="px-4 py-3 text-xs font-mono text-neutral-500">{mc.source}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Source complete des 13 conjectures :{' '}
            <code className="font-mono text-neutral-400">research_archive/discoveries/CONJECTURES_TRACKER.md</code>
          </p>
        </section>

        {/* PIPELINE RAG */}
        <section className="mb-12">
          <SectionHeader
            icon={Database}
            title="Pipeline d'ingestion ChromaDB"
            subtitle="Les 17 fiches P006 sont indexees localement pour recherche semantique"
          />
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Collection</div>
                <code className="font-mono text-blue-300 text-xs">aegis_methodology_papers</code>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Chunks indexes</div>
                <div className="text-neutral-200 font-mono">136 chunks / {totalPapers} fiches</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Embeddings</div>
                <div className="text-neutral-200 font-mono text-xs">all-MiniLM-L6-v2 (local)</div>
              </div>
            </div>
            <div className="rounded bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs text-neutral-300 overflow-x-auto">
              <div className="text-neutral-500"># Ingestion (non dry-run)</div>
              <div>python .claude/skills/aegis-research-lab/scripts/ingest_methodology_paper.py --all</div>
              <div className="text-neutral-500 mt-2"># Requete semantique</div>
              <div>python .claude/skills/aegis-research-lab/scripts/retrieve_methodology_paper.py "MCP threat model" --top-k 5</div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 mt-12 border-t border-neutral-800 text-xs text-neutral-500 space-y-1">
          <p>
            Source unique de verite :{' '}
            <code className="font-mono text-neutral-400">research_archive/doc_references/{'{'}2025,2026{'}'}/methodology/M*.md</code>
            {' '}(format P006)
          </p>
          <p>
            Collection ChromaDB :{' '}
            <code className="font-mono text-neutral-400">backend/chroma_db</code>
            {' '}(persistent, embeddings locaux, zero API)
          </p>
          <p>
            Scripts d'ingestion et de recuperation :{' '}
            <code className="font-mono text-neutral-400">.claude/skills/aegis-research-lab/scripts/</code>
          </p>
          <p className="pt-2">
            Pages liees :{' '}
            <a href="aegis-workflow" className="text-blue-400 hover:underline">aegis-workflow (workflow detaille)</a>
            {' · '}
            <a href="bibliography-pipeline" className="text-blue-400 hover:underline">bibliography-pipeline</a>
            {' · '}
            <span className="text-neutral-600">academic-agents (page actuelle)</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
