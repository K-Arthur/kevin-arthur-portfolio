import { Partytown } from '@builder.io/partytown/react';

/**
 * PartytownSetup Component
 * 
 * Configures Partytown for offloading third-party scripts to a web worker.
 * 
 * NOTE: Deprecation Warnings for SharedStorage & AttributionReporting
 * ------------------------------------------------------------------------
 * Lighthouse may report deprecation warnings for SharedStorage and 
 * AttributionReporting APIs. These warnings originate from Partytown's 
 * sandbox property enumeration, not from this application's code.
 * 
 * Issue tracked in Partytown repository:
 * - https://github.com/QwikDev/partytown/issues/693
 * - https://github.com/QwikDev/partytown/issues/694
 * 
 * These APIs are part of Chrome's Privacy Sandbox initiative and are 
 * being deprecated. The warnings do not affect functionality as we 
 * don't use these APIs directly. They appear because Partytown's 
 * sandbox enumerates window properties to create the worker environment.
 * 
 * Current Status:
 * - This is a known issue affecting all Partytown users
 * - Waiting for official fix from Partytown maintainers
 * - Warnings are harmless and only appear in Lighthouse/PageSpeed audits
 */
export function PartytownSetup() {
    return (
        <Partytown 
            debug={process.env.NODE_ENV === 'development'} 
            forward={['dataLayer.push']} 
        />
    );
}

export default PartytownSetup;
