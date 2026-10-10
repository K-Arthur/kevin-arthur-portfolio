import { getListedCaseStudiesData } from '@/lib/case-studies';
import CaseStudiesClient from './CaseStudiesClient';
import PageBackdrop from '@/components/PageBackdrop';
import { FaBriefcase } from 'react-icons/fa';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Case Studies',
  description: 'Design engineering and product design case studies: Varve, a local-first design suite; clinical-AI product design at minoHealth; and OpenCode Harness.',
  alternates: {
    canonical: '/case-studies',
  },
  openGraph: {
    title: 'Case Studies | Kevin Arthur Design',
    description: 'Varve, clinical-AI product design, and a deterministic VS Code client — design and code side by side.',
  },
};

export default function CaseStudiesPage() {
  const allPostsData = getListedCaseStudiesData();

  return (
    <div className="relative min-h-screen">
      <PageBackdrop />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <header className="text-center mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/10 rounded-xl border border-primary/20">
            <FaBriefcase className="text-primary text-lg sm:text-xl md:text-2xl" />
            <span className="text-primary font-semibold text-base sm:text-lg">Selected Work</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text-enhanced mb-4 sm:mb-6">
            Case Studies
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            Design Engineer and Product Designer — I take complex products from research and Figma to production React and TypeScript.
            Featured work: Varve, a local-first design suite I founded and shipped, then clinical-AI product design at minoHealth and OpenCode Harness.
          </p>
        </header>

        <CaseStudiesClient posts={allPostsData} />
      </div>
    </div>
  );
}
