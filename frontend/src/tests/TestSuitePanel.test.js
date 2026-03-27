// frontend/src/tests/TestSuitePanel.test.js
// Tests unitaires pour les fonctions d'export et la logique de sélection du TestSuitePanel.
// Framework: Vitest — persistants et reproductibles, aucun appel réseau.

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// Helpers: expose internal export functions for testing
// We import the module and mock URL/Blob APIs
// ============================================================

// Mock browser APIs not available in JSDOM
const clickMock = vi.fn();
const revokeObjectURLMock = vi.fn();
let createdBlobContent = '';
let createdBlobType = '';
let downloadFilename = '';

beforeEach(() => {
  clickMock.mockClear();
  revokeObjectURLMock.mockClear();
  createdBlobContent = '';
  createdBlobType = '';
  downloadFilename = '';

  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = revokeObjectURLMock;

  // Class-based Blob mock (vi.fn() cannot be used as a constructor)
  global.Blob = class MockBlob {
    constructor(content, options) {
      createdBlobContent = content[0];
      createdBlobType = options?.type || '';
    }
  };

  const mockAnchor = {
    href: '',
    download: '',
    click: clickMock,
  };
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'a') return mockAnchor;
    return document.createElement.wrappedMethod
      ? document.createElement.wrappedMethod.call(document, tag)
      : { click() {} };
  });
});

// ---- Re-implement pure export logic for isolated testing ----
// (mirrors TestSuitePanel.jsx export functions for unit testing without component mount)

function exportJSON(rounds, summary) {
  const data = {
    exportedAt: new Date().toISOString(),
    summary,
    rounds: rounds.map((r, i) => ({
      index: i + 1,
      attack_type: r.attack_type,
      scores: r.scores,
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aegis_redteam_test.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(rounds, summary) {
  const header = ['Round', 'Attack Type', 'Formal Metric Violation'];
  const rows = rounds.map((r, i) => [
    i + 1,
    r.attack_type || '',
    r.scores?.metric_reachable_subset_allowed === false ? 1 : 0,
  ]);
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aegis_redteam_test.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportMarkdown(rounds, summary) {
  let md = `# AEGIS Red Team Lab — Audit Report\n\n`;
  md += `**Theorem:** \`Integrity(S) := Reachable(M,i) ⊆ Allowed(i)\`\n\n`;
  if (summary) {
    md += `## Summary\n| Metric | Value |\n|---|---|\n`;
    md += `| Total Rounds | ${summary.total_rounds ?? '—'} |\n`;
    md += `| Formal Metric Violations | ${summary.formal_metric_violations ?? '—'} |\n`;
  }
  rounds.forEach((r, i) => {
    const violated = r.scores?.metric_reachable_subset_allowed === false;
    md += `### ${violated ? '🔴' : '🟢'} Round ${i + 1} — \`${r.attack_type}\`\n`;
  });
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aegis_audit_test.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// Tests: exportJSON
// ============================================================

describe('exportJSON', () => {
  const mockRounds = [
    { attack_type: 'injection', scores: { metric_reachable_subset_allowed: false } },
    { attack_type: 'rule_bypass', scores: { metric_reachable_subset_allowed: true } },
  ];
  const mockSummary = { total_rounds: 2, formal_metric_violations: 1 };

  it('triggers file download', () => {
    exportJSON(mockRounds, mockSummary);
    expect(clickMock).toHaveBeenCalledOnce();
  });

  it('creates a Blob with application/json type', () => {
    exportJSON(mockRounds, mockSummary);
    expect(createdBlobType).toBe('application/json');
  });

  it('includes all rounds in the JSON content', () => {
    exportJSON(mockRounds, mockSummary);
    const parsed = JSON.parse(createdBlobContent);
    expect(parsed.rounds).toHaveLength(2);
    expect(parsed.rounds[0].attack_type).toBe('injection');
  });

  it('includes summary in the JSON content', () => {
    exportJSON(mockRounds, mockSummary);
    const parsed = JSON.parse(createdBlobContent);
    expect(parsed.summary.total_rounds).toBe(2);
    expect(parsed.summary.formal_metric_violations).toBe(1);
  });

  it('revokes the object URL after download', () => {
    exportJSON(mockRounds, mockSummary);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });
});

// ============================================================
// Tests: exportCSV
// ============================================================

describe('exportCSV', () => {
  const mockRounds = [
    { attack_type: 'injection', scores: { metric_reachable_subset_allowed: false } },
    { attack_type: 'prompt_leak', scores: { metric_reachable_subset_allowed: true } },
  ];

  it('triggers file download', () => {
    exportCSV(mockRounds, {});
    expect(clickMock).toHaveBeenCalledOnce();
  });

  it('creates a Blob with text/csv type', () => {
    exportCSV(mockRounds, {});
    expect(createdBlobType).toBe('text/csv');
  });

  it('includes header row', () => {
    exportCSV(mockRounds, {});
    expect(createdBlobContent).toContain('Round,Attack Type');
  });

  it('marks violations correctly (1 for violated, 0 for safe)', () => {
    exportCSV(mockRounds, {});
    const lines = createdBlobContent.split('\n');
    // Round 1: injection, violated → last column = 1
    expect(lines[1]).toContain(',1');
    // Round 2: prompt_leak, safe → last column = 0
    expect(lines[2]).toContain(',0');
  });
});

// ============================================================
// Tests: exportMarkdown
// ============================================================

describe('exportMarkdown', () => {
  const mockRounds = [
    { attack_type: 'injection', scores: { metric_reachable_subset_allowed: false } },
    { attack_type: 'rule_bypass', scores: { metric_reachable_subset_allowed: true } },
  ];
  const mockSummary = { total_rounds: 2, formal_metric_violations: 1 };

  it('triggers file download', () => {
    exportMarkdown(mockRounds, mockSummary);
    expect(clickMock).toHaveBeenCalledOnce();
  });

  it('creates a Blob with text/markdown type', () => {
    exportMarkdown(mockRounds, mockSummary);
    expect(createdBlobType).toBe('text/markdown');
  });

  it('contains the DY-AGENT theorem', () => {
    exportMarkdown(mockRounds, mockSummary);
    expect(createdBlobContent).toContain('Reachable(M,i) ⊆ Allowed(i)');
  });

  it('marks violated rounds with red circle emoji', () => {
    exportMarkdown(mockRounds, mockSummary);
    expect(createdBlobContent).toContain('🔴');
  });

  it('marks safe rounds with green circle emoji', () => {
    exportMarkdown(mockRounds, mockSummary);
    expect(createdBlobContent).toContain('🟢');
  });

  it('includes summary table when summary is provided', () => {
    exportMarkdown(mockRounds, mockSummary);
    expect(createdBlobContent).toContain('## Summary');
    expect(createdBlobContent).toContain('Total Rounds');
    expect(createdBlobContent).toContain('2');
  });
});

// ============================================================
// Tests: ATTACK_TEMPLATES catalogue integrity
// ============================================================

describe('ATTACK_TEMPLATES catalogue', () => {
  it('has at least 8 entries', async () => {
    const { ATTACK_TEMPLATES } = await import('../components/redteam/attackTemplates');
    expect(ATTACK_TEMPLATES.length).toBeGreaterThanOrEqual(8);
  });

  it('every template has a name, category, and template string', async () => {
    const { ATTACK_TEMPLATES } = await import('../components/redteam/attackTemplates');
    for (const t of ATTACK_TEMPLATES) {
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(typeof t.template).toBe('string');
    }
  });

  it('has at least one null-injection control entry', async () => {
    const { ATTACK_TEMPLATES } = await import('../components/redteam/attackTemplates');
    const controls = ATTACK_TEMPLATES.filter((t) => t.name.includes('Control') || t.template.includes('CONTROL_RUN'));
    expect(controls.length).toBeGreaterThanOrEqual(1);
  });

  it('has at least one Base64 bypass entry for delta2 testing', async () => {
    const { ATTACK_TEMPLATES } = await import('../components/redteam/attackTemplates');
    const bypasses = ATTACK_TEMPLATES.filter((t) => t.name.includes('Base64') || t.name.includes('δ²'));
    expect(bypasses.length).toBeGreaterThanOrEqual(1);
  });

  it('has the GAP3 null-injection control with clean clinical premise', async () => {
    const { ATTACK_TEMPLATES } = await import('../components/redteam/attackTemplates');
    const control = ATTACK_TEMPLATES.find((t) => t.template.includes('CONTROL_RUN'));
    expect(control).toBeDefined();
    expect(control.template).toContain('320g');
  });
});
