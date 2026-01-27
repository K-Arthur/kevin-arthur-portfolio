/**
 * Centralized configuration for contextual contact messages
 * Used by the contact page to pre-fill messages based on where users came from
 */

export const contactContexts = {
    pricing: {
        discovery: {
            retainer: "Hi Kevin,\n\nI'm interested in the Discovery Sprint package (Monthly Retainer).\n\nHere are some details about my project:",
            project: "Hi Kevin,\n\nI'm interested in the Discovery Sprint package (Fixed Scope).\n\nHere are some details about my project:"
        },
        design: {
            retainer: "Hi Kevin,\n\nI'm interested in the Design & Prototype package (Monthly Retainer).\n\nHere are some details about my project:",
            project: "Hi Kevin,\n\nI'm interested in the Design & Prototype package (Fixed Scope).\n\nHere are some details about my project:"
        },
        custom: {
            retainer: "Hi Kevin,\n\nI'm interested in the Full Partnership package.\n\nHere are some details about my project:",
            project: "Hi Kevin,\n\nI'm interested in the Full Partnership package.\n\nHere are some details about my project:"
        }
    },
    sources: {
        home: "Hi Kevin,\n\nI found you through your homepage and I'm interested in working together.\n\nHere's what I'm looking for:",
        lab: "Hi Kevin,\n\nI saw your experimental work in the Lab and I'm impressed! I'd love to discuss a project.\n\nHere are the details:",
        about: "Hi Kevin,\n\nAfter reading about your background and approach, I think we'd be a great fit.\n\nHere's what I have in mind:",
        pricing: "Hi Kevin,\n\nI was looking at your pricing options and would love to discuss which package is right for my project.\n\nHere are some details:",
        'case-study': "Hi Kevin,\n\nI was impressed by your case study work and would love to discuss a similar project.\n\nHere's what I'm thinking:"
    }
};

/**
 * Generate a contextual pre-fill message based on URL parameters
 * @param {Object} params - URL search params
 * @returns {string} Pre-filled message for the contact form
 */
export const getContextualMessage = ({ source, plan, billing, caseStudyId, caseStudyTitle }) => {
    // Pricing page with plan selection takes priority
    if (plan && contactContexts.pricing[plan]) {
        const billingType = billing === 'retainer' ? 'retainer' : 'project';
        return contactContexts.pricing[plan][billingType];
    }

    // Case study with specific project
    if (source === 'case-study' && caseStudyTitle) {
        return `Hi Kevin,\n\nI was inspired by your "${caseStudyTitle}" case study and would love to discuss a similar project.\n\nHere's what I have in mind:`;
    }

    // General source-based messages
    if (source && contactContexts.sources[source]) {
        return contactContexts.sources[source];
    }

    // Default empty for direct contact page visits
    return '';
};

/**
 * Format source name for display
 * @param {string} source - Source identifier
 * @returns {string} Human-readable source name
 */
export const formatSourceName = (source) => {
    const names = {
        home: 'Homepage',
        lab: 'Design Lab',
        about: 'About Page',
        pricing: 'Pricing Page',
        'case-study': 'Case Studies'
    };
    return names[source] || source;
};
