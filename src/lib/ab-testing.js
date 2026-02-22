'use client';

/**
 * A/B Testing Library
 * 
 * Core A/B testing logic for the UX Lab page
 * Supports variant assignment based on user ID (localStorage)
 * Tracks which variant each user is assigned to
 */

const AB_TEST_STORAGE_KEY = 'ab-test-variants';
const AB_TEST_USER_ID_KEY = 'ab-test-user-id';

/**
 * Get or generate a unique user ID for A/B testing
 * @returns {string} Unique user ID
 */
export function getUserId() {
  if (typeof window === 'undefined') return null;
  
  try {
    let userId = localStorage.getItem(AB_TEST_USER_ID_KEY);
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(AB_TEST_USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

/**
 * Get all assigned variants for the current user
 * @returns {Object} Object with test names as keys and variant names as values
 */
export function getAssignedVariants() {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(AB_TEST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting assigned variants:', error);
    return {};
  }
}

/**
 * Assign a variant for a specific A/B test
 * Uses consistent hashing to ensure the same user always gets the same variant
 * @param {string} testName - Name of the A/B test
 * @param {Array<string>} variants - Array of variant names to choose from
 * @returns {string} Assigned variant name
 */
export function assignVariant(testName, variants) {
  if (typeof window === 'undefined') return variants[0];
  
  try {
    const userId = getUserId();
    if (!userId) return variants[0];
    
    const assignedVariants = getAssignedVariants();
    
    // Return existing assignment if already assigned
    if (assignedVariants[testName]) {
      return assignedVariants[testName];
    }
    
    // Use simple hash of userId + testName to assign variant
    const hash = simpleHash(userId + testName);
    const variantIndex = hash % variants.length;
    const assignedVariant = variants[variantIndex];
    
    // Store the assignment
    assignedVariants[testName] = {
      variant: assignedVariant,
      assignedAt: Date.now(),
    };
    
    localStorage.setItem(AB_TEST_STORAGE_KEY, JSON.stringify(assignedVariants));
    
    // Track the assignment
    trackABTestEvent(testName, assignedVariant, 'assigned');
    
    return assignedVariant;
  } catch (error) {
    console.error('Error assigning variant:', error);
    return variants[0];
  }
}

/**
 * Simple string hash function
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Track an A/B test event
 * @param {string} testName - Name of the A/B test
 * @param {string} variant - Variant name
 * @param {string} eventType - Event type (assigned, viewed, clicked, converted)
 * @param {Object} metadata - Additional event metadata
 */
export async function trackABTestEvent(testName, variant, eventType, metadata = {}) {
  if (typeof window === 'undefined') return;
  
  try {
    const userId = getUserId();
    
    // Track with Plausible if available
    if (window.plausible) {
      window.plausible('A/B Test Event', {
        props: {
          test_name: testName,
          variant,
          event_type: eventType,
          ...metadata,
        },
      });
    }
    
    // Track with GA4 if available
    if (window.gtag) {
      window.gtag('event', 'ab_test_event', {
        test_name: testName,
        variant,
        event_type: eventType,
        ...metadata,
      });
    }
    
    // Send to our tracking API
    await fetch('/api/ab-test/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        testName,
        variant,
        eventType,
        metadata,
        timestamp: Date.now(),
      }),
    }).catch((error) => {
      console.error('Error tracking A/B test event:', error);
    });
  } catch (error) {
    console.error('Error tracking A/B test event:', error);
  }
}

/**
 * Get the variant for a specific test (assigns if not already assigned)
 * @param {string} testName - Name of the A/B test
 * @param {Array<string>} variants - Array of variant names
 * @returns {string} Variant name
 */
export function getVariant(testName, variants) {
  return assignVariant(testName, variants);
}

/**
 * Check if a specific variant is active for a test
 * @param {string} testName - Name of the A/B test
 * @param {string} variant - Variant name to check
 * @param {Array<string>} variants - Array of variant names
 * @returns {boolean} True if the variant is active
 */
export function isVariant(testName, variant, variants) {
  const assignedVariant = getVariant(testName, variants);
  return assignedVariant === variant;
}

/**
 * Reset all A/B test assignments (for testing purposes)
 */
export function resetABTests() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AB_TEST_STORAGE_KEY);
    localStorage.removeItem(AB_TEST_USER_ID_KEY);
  } catch (error) {
    console.error('Error resetting A/B tests:', error);
  }
}

/**
 * Get variant content for a test
 * @param {string} testName - Name of the A/B test
 * @param {Object} variants - Object with variant names as keys and content as values
 * @returns {*} Content for the assigned variant
 */
export function getVariantContent(testName, variants) {
  const variantNames = Object.keys(variants);
  const assignedVariant = getVariant(testName, variantNames);
  return variants[assignedVariant];
}

// Predefined A/B tests for the UX Lab page
export const AB_TESTS = {
  HEADLINE: {
    name: 'headline',
    variants: ['stop-losing-weeks', 'cut-handoff-time', 'reduce-friction'],
    content: {
      'stop-losing-weeks': 'Stop losing weeks to design-dev handoff friction.',
      'cut-handoff-time': 'Cut handoff time by 80% with this checklist.',
      'reduce-friction': 'Reduce design-dev friction by 80%.',
    },
  },
  CTA_BUTTON: {
    name: 'cta-button',
    variants: ['send-me-checklist', 'download-now', 'get-free-checklist'],
    content: {
      'send-me-checklist': 'Send Me the Checklist',
      'download-now': 'Download Now',
      'get-free-checklist': 'Get Free Checklist',
    },
  },
  SOCIAL_PROOF_PLACEMENT: {
    name: 'social-proof-placement',
    variants: ['above-fold', 'below-fold', 'inline'],
    content: {
      'above-fold': 'Above the fold',
      'below-fold': 'Below the fold',
      'inline': 'Inline with content',
    },
  },
};
