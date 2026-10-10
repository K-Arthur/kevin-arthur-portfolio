/**
 * Structured data schemas for SEO (JSON-LD)
 * Used to help search engines understand portfolio content
 */

import { getSiteUrl, toAbsoluteUrl } from '@/lib/site-url';

const BASE_URL = getSiteUrl();

// Person schema for layout/about pages
export const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    "name": "Kevin Arthur",
    "givenName": "Kevin",
    "familyName": "Arthur",
    "jobTitle": "Design Engineer & Product Designer",
    "description": "Design Engineer and Product Designer who ships product interfaces in React and TypeScript. Founder of Varve. Based in Vancouver, Canada; open to remote roles in Canada. MSc Applied Computer Science at Fairleigh Dickinson University Vancouver, expected Dec 2026.",
    "url": BASE_URL,
    "image": toAbsoluteUrl('/images/profile-image.jpg'),
    "sameAs": [
        "https://www.linkedin.com/in/kevinoarthur/",
        "https://www.behance.net/arthurkevin",
        "https://github.com/K-Arthur"
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
            "name": "Kwame Nkrumah University of Science And Technology"
        }
    ],
    "knowsAbout": [
        "Design Engineering",
        "Product Design",
        "React",
        "TypeScript",
        "Next.js",
        "AI Interface Design",
        "Healthcare UX",
        "Design Systems",
        "Local-First Software",
        "Cross-Platform Applications",
        "Interaction Design"
    ]
};

/**
 * Generate CreativeWork schema for a case study
 * @param {Object} caseStudy - Case study data from MDX frontmatter
 * @returns {Object} JSON-LD CreativeWork schema
 */
export function getCaseStudySchema(caseStudy) {
    if (!caseStudy) return null;
    const imageUrl = toAbsoluteUrl(caseStudy.heroImage);

    const schema = {
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
        "keywords": caseStudy.tags?.join(', ') || "Design Engineering, Product Design, Case Study",
        "articleSection": "Case Studies",
        "inLanguage": "en-US"
    };

    if (caseStudy.industry === 'creative-tools' && caseStudy.id === 'varve') {
        schema.mentions = {
            "@type": "SoftwareApplication",
            "name": "Varve",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Linux, macOS, Windows",
            "url": "https://varve.studio",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Community Edition — free, no subscription, source-available (FSL-1.1-MIT)"
            }
        };
    }

    return schema;
}

/**
 * Portfolio/Website schema for home page
 */
export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "name": "Kevin Arthur Design",
    "description": "Design Engineer and Product Designer in Vancouver. I design product interfaces and ship them in React and TypeScript. Open to remote roles in Canada.",
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
    }
};
