#!/usr/bin/env node
'use strict';

/**
 * Build a single markdown comment with per-URL median scores from .lighthouseci/.
 * Writes .lighthouseci/pr-comment.md and prints the same markdown to stdout.
 */
const fs = require('fs');
const path = require('path');

const LHCI_DIR = path.join(process.cwd(), '.lighthouseci');
const MARKER = '<!-- lighthouse-ci-medians -->';

function median(nums) {
  const sorted = [...nums].filter((n) => typeof n === 'number').sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function scorePct(s) {
  return typeof s === 'number' ? Math.round(s * 100) : null;
}

function emoji(p) {
  return p === null ? '⚪' : p >= 90 ? '🟢' : p >= 50 ? '🟡' : '🔴';
}

function pathKey(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/$/, '') || '/';
  } catch {
    return url;
  }
}

function formFactor(report) {
  return (
    report.configSettings?.formFactor ||
    report.configSettings?.emulatedFormFactor ||
    'mobile'
  );
}

if (!fs.existsSync(LHCI_DIR)) {
  process.stdout.write(`${MARKER}\nNo Lighthouse results found.\n`);
  process.exit(0);
}

const reports = fs
  .readdirSync(LHCI_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'assertion-results.json' && f !== 'manifest.json')
  .map((f) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(LHCI_DIR, f), 'utf8'));
    } catch {
      return null;
    }
  })
  .filter((r) => r && r.categories && r.finalUrl);

const groups = new Map();
for (const report of reports) {
  const key = `${pathKey(report.finalUrl)}|${formFactor(report)}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(report);
}

let body = `${MARKER}\n## ⚡ Lighthouse medians\n\n`;
body += '| URL | Form | Perf | A11y | BP | SEO | CLS | TBT |\n';
body += '|-----|------|------|------|----|-----|-----|-----|\n';

const keys = [...groups.keys()].sort();
for (const key of keys) {
  const runs = groups.get(key);
  const [route, factor] = key.split('|');
  const perf = scorePct(median(runs.map((r) => r.categories.performance?.score)));
  const a11y = scorePct(median(runs.map((r) => r.categories.accessibility?.score)));
  const bp = scorePct(median(runs.map((r) => r.categories['best-practices']?.score)));
  const seo = scorePct(median(runs.map((r) => r.categories.seo?.score)));
  const cls = median(runs.map((r) => r.audits?.['cumulative-layout-shift']?.numericValue));
  const tbt = median(runs.map((r) => r.audits?.['total-blocking-time']?.numericValue));
  const clsTxt = cls == null ? 'n/a' : cls.toFixed(3);
  const tbtTxt = tbt == null ? 'n/a' : `${Math.round(tbt)}ms`;
  body += `| \`${route}\` | ${factor} | ${emoji(perf)} ${perf} | ${emoji(a11y)} ${a11y} | ${emoji(bp)} ${bp} | ${emoji(seo)} ${seo} | ${clsTxt} | ${tbtTxt} |\n`;
}

body += `\n_Medians of ${reports.length} run(s). One updating comment._\n`;

const outFile = path.join(LHCI_DIR, 'pr-comment.md');
try {
  fs.writeFileSync(outFile, body);
} catch {
  // directory may be missing write in some environments
}

process.stdout.write(body);
