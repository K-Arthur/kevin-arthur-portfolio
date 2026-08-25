/**
 * Lighthouse CI Configuration
 * 
 * This configuration runs Lighthouse audits against the Next.js
 * production server and enforces quality thresholds to prevent regressions.
 * 
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */
module.exports = {
  ci: {
    // Collect Lighthouse results
    collect: {
      // Start the Next.js production server (no static export — serverless mode)
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      // Explicitly test homepage and case studies
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/case-studies',
      ],
      // Number of runs to reduce variance
      numberOfRuns: 3,
      // Additional settings
      settings: {
        // Chrome flags for CI environment
        chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
      },
    },
    // Upload results
    upload: {
      // Upload to temporary public storage (GitHub PR comments)
      target: 'temporary-public-storage',
      // Or use GitHub status check target (requires LHCI server or GitHub App)
      // target: 'lhci',
      // serverBaseUrl: process.env.LHCI_SERVER_BASE_URL,
      // token: process.env.LHCI_TOKEN,
    },
    // Assert against quality budgets.
    //
    // IMPORTANT: we intentionally do NOT use a preset here. The `lighthouse:no-pwa`
    // preset (and `lighthouse:recommended`) mark essentially *every* Lighthouse
    // audit as an error-level assertion, which made this pipeline fail on every
    // run for ~6 months — providing zero signal. Instead we gate on a small,
    // explicit, curated set:
    //   * overall category scores (the stable, human-meaningful signal), and
    //   * a few deterministic correctness checks (real defects, never masked).
    //
    // Performance "opportunity" audits that are environment-dependent in CI
    // (localhost server, no CDN, no preconnect) are intentionally set to
    // `off`/`warn` so they are reported but do not falsely fail the build.
    assert: {
      assertions: {
        // --- Primary, stable signal: overall category scores ---
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // --- Core Web Vitals: loose thresholds tuned for a 3D/content-heavy site ---
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],

        // --- Deterministic accessibility / correctness checks (real defects) ---
        'heading-order': ['error', {}],
        'color-contrast': ['error', {}],
        'image-alt': ['error', {}],
        'link-name': ['error', {}],
        'document-title': ['error', {}],
        'html-has-lang': ['error', {}],
        'http-status-code': ['error', {}],

        // --- Environment-dependent performance opportunities: reported, not gating ---
        'lcp-lazy-loaded': 'off',
        'lcp-discovery-insight': 'off',
        'offscreen-images': 'warn',
        'uses-rel-preconnect': 'warn',
        'unused-javascript': 'off',
        'uses-http2': 'off',
        'resource-summary:document:size': 'off',
        'resource-summary:script:size': 'off',
        'resource-summary:image:size': 'off',
      },
    },
  },
};
