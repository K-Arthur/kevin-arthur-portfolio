import { getSortedCaseStudiesData } from '@/lib/case-studies';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kevinarthur.design';

  // Static pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/case-studies',
    '/lab',
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

  return [...routes, ...caseStudies];
}
