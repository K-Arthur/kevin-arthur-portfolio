'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getVariant, trackABTestEvent, AB_TESTS } from '@/lib/ab-testing';

/**
 * A/B Testing Context Provider
 * 
 * Provides A/B testing state and utilities to child components
 */

const ABTestContext = createContext(null);

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
}

export function ABTestProvider({ children, enabled = true }) {
  const [variants, setVariants] = useState({});
  const [isReady, setIsReady] = useState(false);

  // Initialize A/B test variants on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setIsReady(true);
      return;
    }

    try {
      const assignedVariants = {};
      
      // Assign variants for all defined tests
      Object.values(AB_TESTS).forEach(test => {
        const variant = getVariant(test.name, test.variants);
        assignedVariants[test.name] = variant;
      });

      setVariants(assignedVariants);
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing A/B tests:', error);
      setIsReady(true);
    }
  }, [enabled]);

  /**
   * Get the variant for a specific test
   * @param {string} testName - Name of the A/B test
   * @returns {string|null} Variant name or null if not assigned
   */
  const getTestVariant = (testName) => {
    return variants[testName] || null;
  };

  /**
   * Check if a specific variant is active for a test
   * @param {string} testName - Name of the A/B test
   * @param {string} variant - Variant name to check
   * @returns {boolean} True if the variant is active
   */
  const isTestVariant = (testName, variant) => {
    return variants[testName] === variant;
  };

  /**
   * Track an event for a specific test
   * @param {string} testName - Name of the A/B test
   * @param {string} eventType - Event type (viewed, clicked, converted)
   * @param {Object} metadata - Additional event metadata
   */
  const trackEvent = (testName, eventType, metadata = {}) => {
    const variant = getTestVariant(testName);
    if (variant) {
      trackABTestEvent(testName, variant, eventType, metadata);
    }
  };

  /**
   * Get content for the assigned variant of a test
   * @param {string} testName - Name of the A/B test
   * @returns {string|null} Content for the assigned variant or null
   */
  const getVariantContent = (testName) => {
    const test = Object.values(AB_TESTS).find(t => t.name === testName);
    if (!test) return null;
    
    const variant = getTestVariant(testName);
    return test.content[variant] || null;
  };

  const value = {
    isReady,
    enabled,
    variants,
    getTestVariant,
    isTestVariant,
    trackEvent,
    getVariantContent,
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
}

/**
 * Component to conditionally render based on A/B test variant
 */
export function ABTestVariant({ testName, variant, children, fallback = null }) {
  const { isTestVariant, isReady } = useABTest();

  if (!isReady) return fallback;
  
  if (isTestVariant(testName, variant)) {
    return <>{children}</>;
  }

  return fallback;
}

/**
 * Component to render content based on assigned variant
 */
export function ABTestContent({ testName, children }) {
  const { getTestVariant, isReady } = useABTest();

  if (!isReady) return null;

  const variant = getTestVariant(testName);
  
  if (typeof children === 'function') {
    return children(variant);
  }

  return null;
}

/**
 * Component to display A/B test variant for debugging
 */
export function ABTestDebug({ testName }) {
  const { getTestVariant, isReady } = useABTest();

  if (!isReady || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const variant = getTestVariant(testName);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono z-50">
      <div>{testName}: {variant}</div>
    </div>
  );
}
