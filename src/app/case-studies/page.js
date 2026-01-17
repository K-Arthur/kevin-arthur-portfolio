import { getSortedCaseStudiesData } from '@/lib/case-studies';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata = {
  title: 'Case Studies | AI Interface Design Portfolio',
  description: 'Design Engineer case studies: AI-powered medical platform achieving 97% diagnostic accuracy, telemedicine collaboration reducing review time by 40%. Expert AI interface design with measurable results.',
  alternates: {
    canonical: '/case-studies',
  },
  openGraph: {
    title: 'Case Studies | Kevin Arthur Design Portfolio',
    description: 'In-depth case studies showcasing AI interface design and healthcare UX projects',
  },
};

export default function CaseStudiesPage() {
  const allPostsData = getSortedCaseStudiesData();

  return <CaseStudiesClient posts={allPostsData} />;
}