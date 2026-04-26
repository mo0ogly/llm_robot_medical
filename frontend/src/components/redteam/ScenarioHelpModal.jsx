// frontend/src/components/redteam/ScenarioHelpModal.jsx
// Modal help overlay for attack scenarios — explains each attack in detail.
// HELP_DB data split into helpData/ modules (800-line rule enforcement).
import { X, Shield, ShieldAlert, BookOpen, Beaker, Target, AlertTriangle, Lightbulb, Activity, MessageSquare, Table, GitBranch, HardDrive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HELP_DB } from './helpData/index.js';

// Fallback for templates not in HELP_DB
function getDefaultHelp(templateName) {
  return {
    title: templateName,
    icon: 'Target',
    conjecture: 'General',
    severity: 'MEDIUM',
    description: 'This attack template tests the model\'s resistance to prompt injection in the medical surgical context.',
    formal: 'Tests Integrity(S) := Reachable(M, i) subset Allowed(i).',
    mechanism: 'See the template content for detailed payload structure.',
    expected: 'Depends on the active defense level (δ¹, δ², or δ³).',
    defense: 'Delta-3 (validate_output) provides the strongest defense.',
    mitre: 'T1059.009',
  };
}

const SEVERITY_COLORS = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  NONE: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const ICON_MAP = {
  ShieldAlert: ShieldAlert,
  Shield: Shield,
  BookOpen: BookOpen,
  Beaker: Beaker,
  Target: Target,
  AlertTriangle: AlertTriangle,
  Lightbulb: Lightbulb,
  MessageSquare: MessageSquare,
  Table: Table,
  GitBranch: GitBranch,
  HardDrive: HardDrive,
};

export default function ScenarioHelpModal({ templateName, onClose }) {
  var { t } = useTranslation();
  if (!templateName) return null;

  var help = HELP_DB[templateName] || getDefaultHelp(templateName);
  var IconComponent = ICON_MAP[help.icon] || Target;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="bg-neutral-950 border border-neutral-700 rounded-2xl shadow-2xl w-[700px] max-h-[85vh] overflow-hidden flex flex-col"
        onClick={function(e) { e.stopPropagation(); }}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-900/20 border border-red-500/20">
              <IconComponent size={22} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{help.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-blue-900/20 text-blue-400 border-blue-500/30">
                  {help.conjecture}
                </span>
                <span className={'text-[10px] font-mono px-2 py-0.5 rounded border ' + (SEVERITY_COLORS[help.severity] || SEVERITY_COLORS.MEDIUM)}>
                  {help.severity}
                </span>
                {help.mitre && (
                  <span className="text-[10px] font-mono text-neutral-600">{help.mitre}</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors">
            <X size={18} className="text-neutral-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">

          {/* Description */}
          <section>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Lightbulb size={12} /> {t('redteam.help.section.description')}
            </h3>
            <p className="text-neutral-300 leading-relaxed">{help.description}</p>
          </section>

          {/* Formal Link */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
            <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <BookOpen size={12} /> {t('redteam.help.section.formal')}
            </h3>
            <p className="text-neutral-400 leading-relaxed font-mono text-xs whitespace-pre-line">{help.formal}</p>
          </section>

          {/* Mechanism */}
          <section>
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Target size={12} /> {t('redteam.help.section.mechanism')}
            </h3>
            <pre className="text-neutral-400 text-xs leading-relaxed whitespace-pre-line">{help.mechanism}</pre>
          </section>

          {/* Expected Result */}
          <section className="bg-orange-900/10 border border-orange-500/20 rounded-lg p-4">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <AlertTriangle size={12} /> {t('redteam.help.section.expected')}
            </h3>
            <pre className="text-neutral-400 text-xs leading-relaxed whitespace-pre-line">{help.expected}</pre>
          </section>

          {/* Defense */}
          <section>
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Shield size={12} /> {t('redteam.help.section.defense')}
            </h3>
            <p className="text-neutral-400 leading-relaxed text-xs">{help.defense}</p>
          </section>

          {/* SVC Breakdown */}
          {help.svcBreakdown && (
            <section className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Beaker size={12} /> {t('redteam.help.section.svc')}
              </h3>
              <pre className="text-neutral-400 text-xs leading-relaxed whitespace-pre-line">{help.svcBreakdown}</pre>
            </section>
          )}

          {/* Semantic Drift (genetic templates) */}
          {help.semanticDrift && (
            <section className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Activity size={12} /> {t('redteam.help.section.drift')}
              </h3>
              <pre className="text-neutral-400 text-xs leading-relaxed whitespace-pre-line">{help.semanticDrift}</pre>
              <div className="mt-3 pt-3 border-t border-purple-500/10 text-[10px] text-neutral-600">
                <strong className="text-purple-400">Why Cosine over Levenshtein?</strong>{' '}
                Levenshtein measures character edits (syntactic), missing that
                "Kill the patient" and "Cause cardiac arrest" are semantically identical.
                Cosine similarity on dense embeddings (Sentence-BERT) captures meaning
                preservation across mutations — critical for proving the genetic algorithm
                evolves effective attack variants, not just random text changes.
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-900/50 flex justify-between items-center text-[10px] font-mono text-neutral-600">
          <span>{t('redteam.help.footer.label')}</span>
          <span>{t('redteam.help.footer.close')}</span>
        </div>
      </div>
    </div>
  );
}
