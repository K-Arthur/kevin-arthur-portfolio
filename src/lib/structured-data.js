/**
 * Structured data schemas for SEO (JSON-LD)
 * Used to help search engines understand portfolio content
 */

// Person schema for layout/about pages
export const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kevin Arthur",
    "jobTitle": "Design Engineer & AI Interface Design Expert",
    "description": "Design Engineer specializing in AI interface design, healthcare UX, and SaaS product design. Based in Vancouver, Canada.",
    "url": "https://kevinarthur.design",
    "sameAs": [
        "https://www.linkedin.com/in/kevinoarthur/",
        "https://www.behance.net/arthurkevin"
    ],
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Vancouver",
        "addressRegion": "BC",
        "addressCountry": "CA"
    },
    "alumniOf": [
        {
            "@type": "CollegeOrUniversity",
            "name": "Fairleigh Dickinson University"
        },
        {
            "@type": "CollegeOrUniversity",
            "name": "Kwame Nkrumah University of Science And Technology"
        }
    ],
    "knowsAbout": [
        "AI Interface Design",
        "Healthcare UX",
        "SaaS Product Design",
        "Design Systems",
        "Telemedicine UX",
        "Data Visualization"
    ]
};

/**
 * Generate CreativeWork schema for a case study
 * @param {Object} caseStudy - Case study data from MDX frontmatter
 * @returns {Object} JSON-LD CreativeWork schema
 */
export function getCaseStudySchema(caseStudy) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": caseStudy.title,
        "description": caseStudy.metaDescription || caseStudy.summary,
        "author": {
            "@type": "Person",
            "name": "Kevin Arthur",
            "url": "https://kevinarthur.design"
        },
        "datePublished": caseStudy.publishedAt,
        "image": caseStudy.heroImage,
        "keywords": ["AI Interface Design", "Healthcare UX", "Case Study", "Product Design"],
        "about": {
            "@type": "Thing",
            "name": "AI Interface Design"
        },
        "creator": {
            "@type": "Person",
            "name": "Kevin Arthur"
        }
    };
}

/**
 * Portfolio/Website schema for home page
 */
export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kevin Arthur Design Portfolio",
    "description": "Design Engineer and SaaS Product Designer in Vancouver specializing in AI interface design",
    "url": "https://kevinarthur.design",
    "author": {
        "@type": "Person",
        "name": "Kevin Arthur"
    }
};
