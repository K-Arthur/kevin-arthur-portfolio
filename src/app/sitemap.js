import { getSortedCaseStudiesData } from '@/lib/case-studies';
import { PROJECT_CONFIG } from '@/lib/projectConfig';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kevinarthur.design';

  // Static pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/case-studies',
    '/work',
    '/pricing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic pages (Case Studies from Markdown)
  let caseStudies = [];
  try {
    const allPostsData = getSortedCaseStudiesData();
    caseStudies = allPostsData.map((post) => ({
      url: `${baseUrl}/case-studies/${post.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating sitemap for case studies:", error);
  }

  // Dynamic pages (Work Projects from Config)
  let workProjects = [];
  try {
    // Filter out projects that are actually case studies if they are duplicated
    // But for now, let's include them and rely on canonicals if they differ, or exclusion if they are identical.
    // However, if /work/[slug] renders the same "project" as /case-studies/[id], we have a problem.
    // Based on my reading, /work/[slug] is a media gallery/project details page.
    // /case-studies/[id] is a long-form text/MDX page.
    // They are likely distinct enough to both exist, but they should probably cross-link or be clear about intent.
    // If they are distinct, they are not "Duplicate". "Duplicate" means same content.
    // "Duplicate without user-selected canonical" often means Google sees them as similar enough.

    workProjects = Object.keys(PROJECT_CONFIG).map((slug) => ({
      url: `${baseUrl}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating sitemap for work projects:", error);
  }

  return [...routes, ...caseStudies, ...workProjects];
}
