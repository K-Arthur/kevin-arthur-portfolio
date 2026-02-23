/**
 * Structured data schemas for SEO (JSON-LD)
 * Used to help search engines understand portfolio content
 */

const BASE_URL = "https://kevinarthur.design";

// Person schema for layout/about pages
export const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    "name": "Kevin Arthur",
    "givenName": "Kevin",
    "familyName": "Arthur",
    "jobTitle": "Design Engineer & AI Interface Design Expert",
    "description": "Design Engineer specializing in AI interface design, healthcare UX, and SaaS product design. Based in Vancouver, Canada.",
    "url": BASE_URL,
    "image": `${BASE_URL}/images/profile-image.jpg`,
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
    if (!caseStudy) return null;
    // Ensure image URL is absolute
    const imageUrl = caseStudy.heroImage?.startsWith('http')
        ? caseStudy.heroImage
        : caseStudy.heroImage
            ? `${BASE_URL}${caseStudy.heroImage.startsWith('/') ? '' : '/'}${caseStudy.heroImage}`
            : null;

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${BASE_URL}/case-studies/${caseStudy.id || caseStudy.slug}`,
        "headline": caseStudy.title,
        "name": caseStudy.title,
        "description": caseStudy.metaDescription || caseStudy.summary,
        "author": {
            "@type": "Person",
            "@id": `${BASE_URL}/#person`,
            "name": "Kevin Arthur",
            "url": BASE_URL
        },
        "publisher": {
            "@type": "Person",
            "@id": `${BASE_URL}/#person`,
            "name": "Kevin Arthur",
            "url": BASE_URL
        },
        "datePublished": caseStudy.publishedAt,
        "dateModified": caseStudy.updatedAt || caseStudy.publishedAt,
        "image": imageUrl ? {
            "@type": "ImageObject",
            "url": imageUrl,
            "caption": caseStudy.heroImageAlt || caseStudy.title
        } : undefined,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${BASE_URL}/case-studies/${caseStudy.id || caseStudy.slug}`
        },
        "keywords": caseStudy.tags?.join(', ') || "AI Interface Design, Healthcare UX, Case Study, Product Design",
        "articleSection": "Case Studies",
        "inLanguage": "en-US"
    };
}

/**
 * Portfolio/Website schema for home page
 */
export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "name": "Kevin Arthur Design Portfolio",
    "description": "Design Engineer and SaaS Product Designer in Vancouver specializing in AI interface design",
    "url": BASE_URL,
    "inLanguage": "en-US",
    "author": {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        "name": "Kevin Arthur"
    },
    "publisher": {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        "name": "Kevin Arthur"
    },
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${BASE_URL}/case-studies?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
    }
};
