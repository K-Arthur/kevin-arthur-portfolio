'use strict';

/** Soft script budget (bytes). Warn only. */
const SCRIPT_BUDGET = 700000;

const PERF = {
  '/': { mobile: 0.65, desktop: 0.95, cls: 0.05 },
  '/about': { mobile: 0.5, desktop: 0.7, cls: 0.1 },
  '/case-studies': { mobile: 0.62, desktop: 0.85, cls: 0.05 },
  '/case-studies/varve': { mobile: 0.8, desktop: 0.95, cls: 0.05 },
};

function baseAssertions({ perf, cls, tbt, crawlable = true }) {
  return {
    'categories:performance': ['error', { minScore: perf }],
    'categories:accessibility': ['error', { minScore: 0.95 }],
    'categories:best-practices': ['error', { minScore: 0.95 }],
    'categories:seo': ['error', { minScore: 0.95 }],
    'cumulative-layout-shift': ['error', { maxNumericValue: cls }],
    'total-blocking-time': ['error', { maxNumericValue: tbt }],
    'resource-summary:script:size': ['warn', { maxNumericValue: SCRIPT_BUDGET }],
    'heading-order': ['error', {}],
    'color-contrast': ['error', {}],
    'image-alt': ['error', {}],
    'link-name': ['error', {}],
    'document-title': ['error', {}],
    'html-has-lang': ['error', {}],
    'http-status-code': ['error', {}],
    'is-crawlable': crawlable ? ['warn', {}] : 'off',
    'lcp-lazy-loaded': 'off',
    'lcp-discovery-insight': 'off',
    'offscreen-images': 'warn',
    'uses-rel-preconnect': 'warn',
    'unused-javascript': 'off',
    'uses-http2': 'off',
  };
}

function mobileAssertions(path, { crawlable = true } = {}) {
  const spec = PERF[path];
  return baseAssertions({
    perf: spec.mobile,
    cls: spec.cls,
    tbt: 450,
    crawlable,
  });
}

function desktopAssertions(path, { crawlable = true } = {}) {
  const spec = PERF[path];
  return baseAssertions({
    perf: spec.desktop,
    cls: spec.cls,
    tbt: 150,
    crawlable,
  });
}

module.exports = {
  PERF,
  SCRIPT_BUDGET,
  mobileAssertions,
  desktopAssertions,
};
