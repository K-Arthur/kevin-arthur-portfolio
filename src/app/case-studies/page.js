import { getSortedCaseStudiesData } from '@/lib/case-studies';
import CaseStudiesClient from './CaseStudiesClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Case Studies',
  description: 'Product design case studies: AI-powered medical platform achieving 97% diagnostic accuracy, telemedicine collaboration reducing review time by 40%, and more.',
  alternates: {
    canonical: '/case-studies',
  },
  openGraph: {
    title: 'Case Studies | Kevin Arthur Design',
    description: 'In-depth case studies showcasing AI interface design and healthcare UX projects with measurable outcomes.',
  },
};

export default function CaseStudiesPage() {
  const allPostsData = getSortedCaseStudiesData();

  return <CaseStudiesClient posts={allPostsData} />;
}