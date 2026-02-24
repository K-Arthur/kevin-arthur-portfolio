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
      // Explicitly test homepage (/) and other key pages
      // Without this, LHCI tests all HTML files including 404.html
      url: [
        'http://localhost/',
        'http://localhost/case-studies.html',
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
    // Assert against performance budgets
    assert: {
      // Use minimal preset (no PWA requirements)
      // Options: 'lighthouse:all', 'lighthouse:recommended', 'lighthouse:no-pwa'
      preset: 'lighthouse:no-pwa',
      // Custom assertions for stricter requirements
      assertions: {
        // Performance categories
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals - adjusted for 3D animation site
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // 2.0s target
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }], // 3.0s target (3D content)
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.15 }], // 0.15 target
        'total-blocking-time': ['warn', { maxNumericValue: 350 }], // 350ms target (Three.js)
        'interactive': ['warn', { minScore: 0.6 }], // TTI score adjusted
        'max-potential-fid': ['warn', { minScore: 0.7 }], // FID score adjusted
        
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
        
        // Disabled insights that are too strict for this stack
        'unused-css-rules': 'off',
        'errors-in-console': 'off',
        'legacy-javascript': 'off',
        'legacy-javascript-insight': 'off',
        'image-delivery-insight': 'off',
        'forced-reflow-insight': 'off',
        'network-dependency-tree-insight': 'off',
        'render-blocking-resources': 'off',
        'render-blocking-insight': 'off',
        'mainthread-work-breakdown': 'off',
        'cls-culprits-insight': 'off',
        'modern-image-formats': 'off',
        'uses-responsive-images': 'off',
        'dom-size-insight': 'off'
      },
    },
  },
};
