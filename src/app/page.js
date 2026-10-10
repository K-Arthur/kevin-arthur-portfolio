import { getListedCaseStudiesData } from '@/lib/case-studies';
import { profilePageSchema, varveSoftwareSchema } from '@/lib/structured-data';
import HomeClient from './HomeClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Kevin Arthur | Design Engineer & Product Designer',
  description: 'Kevin Arthur, Design Engineer in Vancouver. I design product interfaces and ship them in React and TypeScript. Founder of Varve, a local-first design suite.',
  openGraph: {
    title: 'Kevin Arthur | Design Engineer & Product Designer',
    description: 'Kevin Arthur, Design Engineer in Vancouver. I design product interfaces and ship them in React and TypeScript. Founder of Varve, a local-first design suite.',
    url: '/',
    type: 'website',
    siteName: 'Kevin Arthur Design',
    locale: 'en_US',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Kevin Arthur — Design Engineer · Vancouver',
      },
    ],
  },
};

export default function HomePage() {
    const allPostsData = getListedCaseStudiesData();

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(varveSoftwareSchema) }}
        />
        <HomeClient posts={allPostsData} />
      </>
    );
}
