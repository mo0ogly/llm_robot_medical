// parse_help_db_entries.cjs
//
// Phase 2 of the content-filter-safe HELP_DB migration.
// Reads the 48 .txt files produced by extract_help_db.py and converts each
// JSX-literal entry to a structured JSON file via Node's native parser (vm.Script).
//
// Why vm.Script and not eval(): vm.Script runs in an isolated V8 context
// with no access to require, process, fs, or the global scope. Even if one
// of the .txt files had a hostile payload (it doesn't — it's our own code),
// the sandbox contains it.
//
// Input:
//   backend/prompts_help_extracted/<scenario_id>.txt  (JSX entry literal)
//
// Output:
//   backend/prompts_help_extracted/<scenario_id>.json (structured JSON)
//   backend/prompts_help_extracted/_parse_report.json (per-entry status)
//
// Usage:
//   node backend/tools/parse_help_db_entries.cjs
//   node backend/tools/parse_help_db_entries.cjs --verify

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TOOLS_DIR = __dirname;
const REPO_ROOT = path.resolve(TOOLS_DIR, '..', '..');
const EXTRACT_DIR = path.resolve(TOOLS_DIR, '..', 'prompts_help_extracted');

function parseEntry(raw, scenarioId) {
  // Each .txt file contains a JSX entry of the form:
  //   'scenario_id': {
  //       key: value,
  //       ...
  //   },
  //
  // We need to extract just the { ... } object literal and evaluate it.
  //
  // Strategy:
  //   1. Find the first '{' after the scenario_id key
  //   2. Brace-match to find the matching '}'
  //   3. Wrap as "(" + objectLiteral + ")" to make it a valid JS expression
  //   4. Evaluate in a sandbox via vm.runInNewContext

  // Strip leading whitespace
  let text = raw.trim();

  // Remove trailing comma if present
  if (text.endsWith(',')) {
    text = text.slice(0, -1).trimEnd();
  }

  // Find the colon after the key
  const colonIdx = text.indexOf(':');
  if (colonIdx < 0) {
    throw new Error('no colon found after key');
  }

  // Find the opening brace after the colon
  let openIdx = text.indexOf('{', colonIdx);
  if (openIdx < 0) {
    throw new Error('no opening brace after colon');
  }

  // The object literal is text[openIdx..end] where end is the matching brace
  const objLiteral = text.slice(openIdx);

  // Wrap in parens so JS parses it as an expression, not a block statement
  const wrapped = '(' + objLiteral + ')';

  // Evaluate in isolated sandbox (no require, no process, no fs)
  const sandbox = {};
  vm.createContext(sandbox);
  const script = new vm.Script(wrapped, { filename: scenarioId + '.txt' });
  const result = script.runInContext(sandbox, { timeout: 1000 });

  return result;
}

function main() {
  const verifyOnly = process.argv.includes('--verify');

  if (!fs.existsSync(EXTRACT_DIR)) {
    console.error('ERROR: extract dir not found: ' + EXTRACT_DIR);
    console.error('Run: python backend/tools/extract_help_db.py first');
    process.exit(1);
  }

  const txtFiles = fs
    .readdirSync(EXTRACT_DIR)
    .filter((f) => f.endsWith('.txt') && !f.startsWith('_'))
    .sort();

  if (txtFiles.length === 0) {
    console.error('ERROR: no .txt files found in ' + EXTRACT_DIR);
    process.exit(1);
  }

  console.log('=== parse_help_db_entries ===');
  console.log('Source: ' + path.relative(REPO_ROOT, EXTRACT_DIR));
  console.log('Files to parse: ' + txtFiles.length);
  console.log('');

  const report = { ok: [], failed: [] };

  for (const txtFile of txtFiles) {
    const scenarioId = path.basename(txtFile, '.txt');
    const rawPath = path.join(EXTRACT_DIR, txtFile);
    const raw = fs.readFileSync(rawPath, 'utf8');

    try {
      const parsed = parseEntry(raw, scenarioId);

      // Validate that parsed is an object
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('parsed result is not an object: ' + typeof parsed);
      }

      // Count keys for report
      const keys = Object.keys(parsed);
      const entry = {
        scenario_id: scenarioId,
        keys: keys,
        key_count: keys.length,
        sizes: {},
      };
      for (const k of keys) {
        const v = parsed[k];
        if (typeof v === 'string') {
          entry.sizes[k] = v.length + ' chars';
        } else if (Array.isArray(v)) {
          entry.sizes[k] = v.length + ' items';
        } else {
          entry.sizes[k] = typeof v;
        }
      }
      report.ok.push(entry);

      if (!verifyOnly) {
        const jsonPath = path.join(EXTRACT_DIR, scenarioId + '.json');
        fs.writeFileSync(
          jsonPath,
          JSON.stringify(parsed, null, 2) + '\n',
          'utf8'
        );
      }

      console.log(
        '  OK  ' +
          scenarioId.padEnd(45) +
          ' keys=' +
          keys.length +
          ' (' +
          keys.slice(0, 4).join(', ') +
          (keys.length > 4 ? ', ...' : '') +
          ')'
      );
    } catch (e) {
      report.failed.push({ scenario_id: scenarioId, error: e.message });
      console.log('  FAIL ' + scenarioId.padEnd(45) + ' ' + e.message);
    }
  }

  console.log('');
  console.log('Summary: ' + report.ok.length + ' OK, ' + report.failed.length + ' failed');

  if (!verifyOnly) {
    const reportPath = path.join(EXTRACT_DIR, '_parse_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log('Report: ' + path.relative(REPO_ROOT, reportPath));
  }

  process.exit(report.failed.length > 0 ? 1 : 0);
}

main();
