/**
 * Centralized configuration for contextual contact messages
 * Used by the contact page to pre-fill messages based on where users came from
 */

export const contactContexts = {
    sources: {
        home: "Hi Kevin,\n\nI found you through your homepage. I'm hiring for a design engineer / frontend role and would like to talk.\n\nHere's the role:",
        lab: "Hi Kevin,\n\nI saw your experimental work in the Lab. I'd like to talk about a design engineer or frontend role.\n\nHere are the details:",
        about: "Hi Kevin,\n\nAfter reading about your background, I think you'd be a fit for a role on our team.\n\nHere's what I have in mind:",
        'case-study': "Hi Kevin,\n\nI was impressed by your case study work and would like to discuss a role.\n\nHere's what I'm thinking:"
    }
};

/**
 * Generate a contextual pre-fill message based on URL parameters
 * @param {Object} params - URL search params
 * @returns {string} Pre-filled message for the contact form
 */
export const getContextualMessage = ({ source, caseStudyTitle }) => {
    // Case study with specific project
    if (source === 'case-study' && caseStudyTitle) {
        return `Hi Kevin,\n\nI was inspired by your "${caseStudyTitle}" case study and would like to discuss a role.\n\nHere's what I have in mind:`;
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
        'case-study': 'Case Studies'
    };
    return names[source] || source;
};
