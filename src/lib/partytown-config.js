/**
 * Partytown Configuration
 * 
 * This module provides configuration to suppress deprecation warnings for
 * deprecated Chrome APIs (SharedStorage and AttributionReporting) that
 * Partytown's sandbox property enumeration inadvertently accesses.
 * 
 * The issue is tracked in the Partytown repository:
 * - https://github.com/QwikDev/partytown/issues/693
 * - https://github.com/QwikDev/partytown/issues/694
 * 
 * These APIs are part of Chrome's Privacy Sandbox initiative and are being
 * deprecated. The warnings appear in Lighthouse audits but don't affect
 * functionality since we don't use these APIs directly.
 */

/**
 * List of deprecated API property names that should not be accessed
 * during Partytown's property enumeration to avoid console warnings.
 */
export const DEPRECATED_API_PROPS = [
  'sharedStorage',
  'SharedStorage',
  'attributionReporting',
  'AttributionReporting',
];

/**
 * Check if a property name is a known deprecated API
 */
export function isDeprecatedApi(propName) {
  return DEPRECATED_API_PROPS.includes(propName);
}

/**
 * Creates a proxy handler that intercepts property access to deprecated APIs
 * and returns undefined without triggering the browser's deprecation warning.
 * 
 * This is used as a workaround until Partytown officially fixes the issue.
 */
export function createSafePropertyProxy(target) {
  return new Proxy(target, {
    get(target, prop) {
      // Intercept access to deprecated APIs
      if (typeof prop === 'string' && isDeprecatedApi(prop)) {
        return undefined;
      }
      return target[prop];
    },
    has(target, prop) {
      // Pretend deprecated APIs don't exist
      if (typeof prop === 'string' && isDeprecatedApi(prop)) {
        return false;
      }
      return prop in target;
    }
  });
}

/**
 * Partytown configuration object
 * 
 * Note: Partytown doesn't have a built-in option to exclude specific
 * interfaces from enumeration. The actual fix needs to be applied at
 * the sandbox level. This configuration provides a forward-compatible
 * structure for when such an option becomes available.
 */
export const partytownConfig = {
  // Forward dataLayer.push for Google Tag Manager
  forward: ['dataLayer.push'],
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Library path
  lib: '/~partytown/',
  
  // Log configuration (helps with debugging)
  logCalls: false,
  logGetters: false,
  logSetters: false,
  logScriptExecution: false,
};

export default partytownConfig;
