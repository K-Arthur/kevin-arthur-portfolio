#!/usr/bin/env node
'use strict';

/**
 * Lighthouse CI summary generator.
 *
 * Reads the artifacts LHCI writes under `.lighthouseci/` and prints a
 * GitHub-flavored markdown summary that is intended to be appended to
 * `$GITHUB_STEP_SUMMARY`. It surfaces, in one place:
 *   - per-URL category scores, and
 *   - every assertion that did not pass (with level, expected vs. found, and message).
 *
 * This is the "automated failure diagnostics" mechanism: when the Lighthouse
 * job fails, a maintainer can open the job summary and see the first meaningful
 * signal without scrolling thousands of raw log lines.
 *
 * It is deliberately defensive: any failure here must NEVER break the CI step,
 * it only enriches the summary.
 */

const fs = require('fs');
const path = require('path');

const LHCI_DIR = path.join(process.cwd(), '.lighthouseci');

function safe(contents) {
  // Keep table cells readable and valid by escaping pipes and collapsing newlines.
  return String(contents == null ? '' : contents).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function note(message) {
  process.stdout.write(`> Lighthouse summary skipped: ${message}\n`);
  process.exit(0);
}

if (!fs.existsSync(LHCI_DIR)) note('no .lighthouseci directory was produced');

const files = fs
  .readdirSync(LHCI_DIR)
  .filter((f) => f.endsWith('.json'));

const reports = [];
let assertionResults = [];

for (const file of files) {
  const full = path.join(LHCI_DIR, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch {
    continue;
  }
  if (file === 'assertion-results.json' && Array.isArray(data)) {
    assertionResults = data;
  } else if (data && data.categories && data.finalUrl) {
    reports.push(data);
  }
}

if (reports.length === 0 && assertionResults.length === 0) {
  note('no Lighthouse report or assertion results were found');
}

const scorePct = (s) => (typeof s === 'number' ? Math.round(s * 100) : null);
const emoji = (p) => (p === null ? '⚪' : p >= 90 ? '🟢' : p >= 50 ? '🟡' : '🔴');

let out = '## ⚡ Lighthouse CI Results\n\n';

for (const report of reports) {
  out += `### ${report.finalUrl}\n\n`;
  out += '| Category | Score |\n|----------|-------|\n';
  for (const key of Object.keys(report.categories || {})) {
    const category = report.categories[key];
    const pct = scorePct(category.score);
    out += `| ${category.title} | ${emoji(pct)} ${pct === null ? 'n/a' : pct} |\n`;
  }
  out += '\n';
}

if (assertionResults.length > 0) {
  const failed = assertionResults.filter((a) => !a.passed);

  if (failed.length === 0) {
    out += '✅ All Lighthouse assertions passed.\n\n';
  } else {
    out += `### ❌ ${failed.length} assertion(s) did not pass\n\n`;

    const byUrl = {};
    for (const result of failed) {
      const url = result.url || 'unknown';
      (byUrl[url] = byUrl[url] || []).push(result);
    }

    for (const url of Object.keys(byUrl)) {
      out += `**${url}**\n\n`;
      out +=
        '| Level | Audit | Expected | Found | Message |\n' +
        '|-------|-------|----------|-------|---------|\n';
      for (const result of byUrl[url]) {
        const level = result.level === 'error' ? '🔴 error' : '🟡 warn';
        const audit = result.auditId || 'unknown';
        const expected =
          result.expected !== undefined ? `${result.operator || ''} ${result.expected}` : '-';
        const actual = result.actual !== undefined ? result.actual : '-';
        const message = safe(result.message || result.comment || '');
        out += `| ${level} | \`${audit}\` | ${safe(expected)} | ${safe(actual)} | ${message} |\n`;
      }
      out += '\n';
    }
    out +=
      '_Tip: download the `lighthouse-reports` artifact for the full JSON / HTML reports._\n\n';
  }
}

process.stdout.write(out);
