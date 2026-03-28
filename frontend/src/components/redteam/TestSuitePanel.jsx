// frontend/src/components/redteam/TestSuitePanel.jsx
// Provides: attack selection checkboxes, category filter, run-selected, and export (JSON/CSV/MD)

import { useState, useMemo } from 'react';
import { CheckSquare, Square, Filter, FlaskConical, Download, FileJson, FileText, Table2, HelpCircle } from 'lucide-react';
import { ATTACK_TEMPLATES } from './attackTemplates';
import ScenarioHelpModal from './ScenarioHelpModal';

const CATEGORIES = ['all', 'injection', 'rule_bypass', 'prompt_leak'];

const CATEGORY_COLORS = {
  injection: 'text-red-400 border-red-500/40 bg-red-500/5',
  rule_bypass: 'text-orange-400 border-orange-500/40 bg-orange-500/5',
  prompt_leak: 'text-purple-400 border-purple-500/40 bg-purple-500/5',
};

// ---- Export helpers --------------------------------------------------------

function exportJSON(rounds, summary) {
  const data = {
    exportedAt: new Date().toISOString(),
    summary,
    rounds: rounds.map((r, i) => ({
      index: i + 1,
      attack_type: r.attack_type,
      attack_name: r.attack_name || '—',
      scores: r.scores,
      target_response_snippet: (r.target_response || '').slice(0, 400),
      audit_analysis_snippet: (r.audit_analysis || '').slice(0, 400),
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aegis_redteam_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function formatPct(val) {
  return val != null ? (val * 100).toFixed(1) + '%' : '';
}

function exportCSV(rounds, summary) {
  const header = [
    'Round', 'Attack Type', 'Prompt Leak', 'Rule Bypass', 'Injection Success',
    'Unauthorized Side Effect', 'Formal Metric Violation', 'Details',
  ];
  const rows = rounds.map((r, i) => [
    i + 1,
    r.attack_type || '',
    r.scores?.prompt_leak ? 1 : 0,
    r.scores?.rule_bypass ? 1 : 0,
    r.scores?.injection_success ? 1 : 0,
    r.scores?.unauthorized_side_effect ? 1 : 0,
    r.scores?.metric_reachable_subset_allowed === false ? 1 : 0,
    '"' + (r.scores?.details || '').replace(/"/g, "'") + '"',
  ]);
  const summaryRows = [
    [],
    ['SUMMARY'],
    ['Total Rounds', summary?.total_rounds ?? ''],
    ['Formal Metric Violations', summary?.formal_metric_violations ?? ''],
    ['Rule Bypasses', summary?.rule_bypasses ?? ''],
    ['Violation Rate', formatPct(summary?.violation_rate_ci?.rate)],
    ['Wilson CI 95% Lower', formatPct(summary?.violation_rate_ci?.ci_95_lower)],
    ['Wilson CI 95% Upper', formatPct(summary?.violation_rate_ci?.ci_95_upper)],
  ];
  const csv = [header, ...rows, ...summaryRows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aegis_redteam_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportMarkdown(rounds, summary) {
  var ts = new Date().toISOString();
  var md = '# AEGIS Red Team Lab - Audit Report\n\n';
  md += '**Exported:** ' + ts + '  \n';
  md += '**Aegis DY-AGENT Theorem:** `Integrity(S) := Reachable(M,i) <= Allowed(i)`\n\n---\n\n';

  if (summary) {
    md += '## Summary\n\n';
    md += '| Metric | Value |\n|---|---|\n';
    md += '| Total Rounds | ' + (summary.total_rounds ?? '-') + ' |\n';
    md += '| Formal Metric Violations | **' + (summary.formal_metric_violations ?? '-') + '** |\n';
    md += '| Rule Bypasses | ' + (summary.rule_bypasses ?? '-') + ' |\n';
    md += '| Prompt Leaks | ' + (summary.prompt_leaks ?? '-') + ' |\n';
    md += '| Injection Successes | ' + (summary.injection_successes ?? '-') + ' |\n';
    if (summary.violation_rate_ci) {
      var ci = summary.violation_rate_ci;
      md += '| Violation Rate | ' + (ci.rate * 100).toFixed(1) + '% |\n';
      md += '| Wilson 95% CI | [' + (ci.ci_95_lower * 100).toFixed(1) + '%, ' + (ci.ci_95_upper * 100).toFixed(1) + '%] (n=' + ci.n + ') |\n';
    }
    md += '\n';
  }

  md += '## Round-by-Round Results\n\n';
  rounds.forEach(function(r, i) {
    var violated = r.scores?.metric_reachable_subset_allowed === false;
    var icon = violated ? 'X' : 'OK';
    md += '### [' + icon + '] Round ' + (i + 1) + ' - ' + (r.attack_type || 'unknown') + '\n\n';
    md += '**Formal Metric:** ' + (violated ? '`Reachable(M) not subset Allowed(i)` **VIOLATED**' : '`Reachable(M) subset Allowed(i)` SATISFIED') + '\n\n';
    if (r.scores?.details) {
      md += '**Details:** ' + r.scores.details + '\n\n';
    }
    if (r.scores?.heuristics?.length) {
      md += '**Heuristics:**\n' + r.scores.heuristics.map(function(h) { return '- ' + h; }).join('\n') + '\n\n';
    }
    md += '---\n\n';
  });

  var blob = new Blob([md], { type: 'text/markdown' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'aegis_audit_' + new Date().toISOString().slice(0, 10) + '.md';
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Component -------------------------------------------------------------

export default function TestSuitePanel({ onRunSelected, rounds, summary, running }) {
  const [selected, setSelected] = useState(() => new Set(ATTACK_TEMPLATES.map((_, i) => i)));
  const [filter, setFilter] = useState('all');
  const [showExport, setShowExport] = useState(false);
  const [helpTemplate, setHelpTemplate] = useState(null);

  const filtered = useMemo(
    () => ATTACK_TEMPLATES.map((t, i) => ({ ...t, idx: i }))
      .filter((t) => filter === 'all' || t.category === filter),
    [filter],
  );

  const allFilteredSelected = filtered.every((t) => selected.has(t.idx));

  const toggleOne = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((t) => next.delete(t.idx));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((t) => next.add(t.idx));
        return next;
      });
    }
  };

  const selectedTemplates = ATTACK_TEMPLATES.filter((_, i) => selected.has(i));

  return (
    <div className="space-y-3">

      {/* ---- Category Filter ---- */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={12} className="text-gray-500" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
              filter === cat
                ? 'bg-[#00ff41]/10 border-[#00ff41]/50 text-[#00ff41]'
                : 'border-gray-700 text-gray-500 hover:border-gray-500'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
        <span className="text-[10px] text-gray-600 ml-auto font-mono">
          {selected.size} / {ATTACK_TEMPLATES.length} selected
        </span>
      </div>

      {/* ---- Toggle All ---- */}
      <button
        onClick={toggleAll}
        className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white transition-colors"
      >
        {allFilteredSelected
          ? <CheckSquare size={12} className="text-[#00ff41]" />
          : <Square size={12} />}
        {allFilteredSelected ? 'Deselect all' : 'Select all'} (filtered)
      </button>

      {/* ---- Test List ---- */}
      <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
        {filtered.map(({ idx, name, category }) => {
          const isChecked = selected.has(idx);
          const colorClass = CATEGORY_COLORS[category] || 'text-gray-400 border-gray-700';
          return (
            <button
              key={idx}
              onClick={() => toggleOne(idx)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded border transition-all text-left ${
                isChecked
                  ? `${colorClass} opacity-100`
                  : 'border-gray-800 text-gray-600 bg-transparent opacity-60'
              }`}
            >
              {isChecked
                ? <CheckSquare size={12} className="flex-shrink-0" />
                : <Square size={12} className="flex-shrink-0" />}
              <span className="text-[10px] font-mono truncate">{name}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setHelpTemplate(name); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setHelpTemplate(name); } }}
                className="p-0.5 rounded hover:bg-white/10 transition-colors flex-shrink-0 opacity-30 hover:opacity-100 cursor-pointer"
                title="View attack documentation"
              >
                <HelpCircle size={11} />
              </span>
              <span className="text-[9px] opacity-50 flex-shrink-0">{category}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Run & Export Row ---- */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onRunSelected(selectedTemplates)}
          disabled={running || selected.size === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] text-[11px] font-mono font-bold hover:bg-[#00ff41]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <FlaskConical size={12} />
          Run {selected.size} test{selected.size !== 1 ? 's' : ''}
        </button>

        {/* Export dropdown */}
        {rounds?.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowExport((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[11px] font-mono hover:bg-blue-500/20 transition-all"
            >
              <Download size={12} />
              Export
            </button>
            {showExport && (
              <div className="absolute bottom-full mb-1 left-0 z-50 bg-gray-900 border border-gray-700 rounded shadow-xl w-44 py-1">
                <button
                  onClick={() => { exportJSON(rounds, summary); setShowExport(false); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <FileJson size={12} className="text-yellow-400" /> Export JSON
                </button>
                <button
                  onClick={() => { exportCSV(rounds, summary); setShowExport(false); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <Table2 size={12} className="text-green-400" /> Export CSV
                </button>
                <button
                  onClick={() => { exportMarkdown(rounds, summary); setShowExport(false); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <FileText size={12} className="text-blue-400" /> Export Markdown
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Modal */}
      {helpTemplate && (
        <ScenarioHelpModal
          templateName={helpTemplate}
          onClose={() => setHelpTemplate(null)}
        />
      )}
    </div>
  );
}
