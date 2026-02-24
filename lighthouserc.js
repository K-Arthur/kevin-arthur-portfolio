/**
 * Lighthouse CI Configuration
 * 
 * This configuration runs Lighthouse audits on the static export
 * and enforces quality thresholds to prevent regressions.
 * 
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */
module.exports = {
  ci: {
    // Collect Lighthouse results
    collect: {
      // Serve static files from the output directory
      staticDistDir: './out',
      // Number of runs to reduce variance
      numberOfRuns: 3,
      // Additional settings
      settings: {
        // Use mobile emulation (default)
        preset: 'mobile',
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
    // Assert against performance budgets
    assert: {
      // Use the recommended preset as a base
      preset: 'lighthouse:recommended',
      // Custom assertions for stricter requirements
      assertions: {
        // Performance categories
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }], // 1.8s target
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }], // 2.5s target
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }], // 0.1 target
        'total-blocking-time': ['warn', { maxNumericValue: 200 }], // 200ms target
        
        // Resource budgets
        'resource-summary:document:size': ['warn', { maxNumericValue: 50000 }], // 50KB HTML
        'resource-summary:script:size': ['warn', { maxNumericValue: 500000 }], // 500KB JS
        'resource-summary:image:size': ['warn', { maxNumericValue: 2000000 }], // 2MB images
        
        // Disabled assertions (customize as needed)
        'unused-javascript': 'off', // May have false positives with Next.js
        'uses-http2': 'off', // Not applicable for static file serving in CI
        'offline-start-url': 'off', // PWA requirement, enable if you have a service worker
        'service-worker': 'off', // PWA requirement, enable if you have a service worker
        'works-offline': 'off', // PWA requirement, enable if you have a service worker
        'redirects-http': 'off', // HTTPS redirects handled by hosting provider
        'maskable-icon': 'off', // PWA requirement
        'splash-screen': 'off', // PWA requirement
        'themed-omnibox': 'off', // PWA requirement
        'viewport': 'off', // Next.js handles this automatically
      },
    },
  },
};
