import { getListedCaseStudiesData } from '@/lib/case-studies';
import HomeClient from './HomeClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Kevin Arthur | Design Engineer & Product Designer',
  description: 'I design product interfaces and ship them in code. Design Engineer and Product Designer in Vancouver, open to remote roles in Canada. Founder of Varve (v0.5.0). React, TypeScript, Next.js.',
  openGraph: {
    title: 'Kevin Arthur | Design Engineer & Product Designer',
    description: 'I design product interfaces and ship them in code. Founder of Varve, a local-first design suite in public beta.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Kevin Arthur — Design Engineer and Product Designer',
      },
    ],
  },
};

export default function HomePage() {
    const allPostsData = getListedCaseStudiesData();

    return <HomeClient posts={allPostsData} />;
}
