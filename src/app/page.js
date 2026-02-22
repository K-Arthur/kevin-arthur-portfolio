import { getSortedCaseStudiesData } from '@/lib/case-studies';
import HomeClient from './HomeClient';

export const metadata = {
    title: 'Kevin Arthur | Product Designer',
    description: 'Product Designer specializing in complex systems—AI interfaces, enterprise tools, and design systems. Recent work includes healthcare platforms and fintech products.',
};

export default function HomePage() {
    const allPostsData = getSortedCaseStudiesData();

    return <HomeClient posts={allPostsData} />;
}
