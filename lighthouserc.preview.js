/**
 * Lighthouse CI against a Vercel preview (or any LHCI_BASE_URL).
 * Set LHCI_FORM_FACTOR=desktop|mobile and optional VERCEL_AUTOMATION_BYPASS_SECRET.
 */
const { mobileAssertions, desktopAssertions } = require('./scripts/lhci-assertions');

const base = (process.env.LHCI_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const isDesktop = process.env.LHCI_FORM_FACTOR === 'desktop';
const extraHeaders = {};
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  extraHeaders['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
}

const settings = {
  chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
};
if (Object.keys(extraHeaders).length) {
  settings.extraHeaders = extraHeaders;
}
if (isDesktop) {
  settings.preset = 'desktop';
  settings.formFactor = 'desktop';
}

const assertFor = isDesktop ? desktopAssertions : mobileAssertions;
const crawlable = false; // Vercel previews are typically noindex

module.exports = {
  ci: {
    collect: {
      url: [
        `${base}/`,
        `${base}/about`,
        `${base}/case-studies`,
        `${base}/case-studies/varve`,
      ],
      numberOfRuns: 3,
      settings,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: `${escapeRegex(base)}/?$`,
          assertions: assertFor('/', { crawlable }),
        },
        {
          matchingUrlPattern: `${escapeRegex(base)}/about/?$`,
          assertions: assertFor('/about', { crawlable }),
        },
        {
          matchingUrlPattern: `${escapeRegex(base)}/case-studies/?$`,
          assertions: assertFor('/case-studies', { crawlable }),
        },
        {
          matchingUrlPattern: `${escapeRegex(base)}/case-studies/varve/?$`,
          assertions: assertFor('/case-studies/varve', { crawlable }),
        },
      ],
    },
  },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
