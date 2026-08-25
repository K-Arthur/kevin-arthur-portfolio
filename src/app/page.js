import { getSortedCaseStudiesData } from '@/lib/case-studies';
import HomeClient from './HomeClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Kevin Arthur | Product Designer',
  description: 'Product Designer specializing in AI interfaces, healthcare UX, and complex enterprise systems. Case studies with measurable outcomes.',
  openGraph: {
    title: 'Kevin Arthur | Product Designer',
    description: 'Product Designer specializing in AI interfaces, healthcare UX, and complex enterprise systems.',
  },
};

export default function HomePage() {
    const allPostsData = getSortedCaseStudiesData();

    return <HomeClient posts={allPostsData} />;
}
