/**
 * Lighthouse CI — localhost production server (mobile).
 * Preview / desktop budgets live in lighthouserc.preview.js.
 */
const { mobileAssertions } = require('./scripts/lhci-assertions');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/about',
        'http://localhost:3000/case-studies',
        'http://localhost:3000/case-studies/varve',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: 'http://localhost:3000/?$',
          assertions: mobileAssertions('/'),
        },
        {
          matchingUrlPattern: 'http://localhost:3000/about/?$',
          assertions: mobileAssertions('/about'),
        },
        {
          matchingUrlPattern: 'http://localhost:3000/case-studies/?$',
          assertions: mobileAssertions('/case-studies'),
        },
        {
          matchingUrlPattern: 'http://localhost:3000/case-studies/varve/?$',
          assertions: mobileAssertions('/case-studies/varve'),
        },
      ],
    },
  },
};
