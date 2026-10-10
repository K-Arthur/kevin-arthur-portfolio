import { getSiteUrl } from '@/lib/site-url';

// Force static generation for export
export const dynamic = 'force-static';

export default function robots() {
  const baseUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
