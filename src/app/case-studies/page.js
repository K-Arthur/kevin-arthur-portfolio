import { getSortedCaseStudiesData } from '@/lib/case-studies';
import CaseStudyList from '@/components/CaseStudyList';
import { FaLightbulb } from 'react-icons/fa';

export default function CaseStudiesPage() {
  const allPostsData = getSortedCaseStudiesData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20 animate-fade-in-up animation-delay-200">
            <FaLightbulb className="text-primary text-2xl" />
            <span className="text-primary font-semibold text-lg">Design Solutions</span>
          </div>
          
          <h1 className="text-hero font-bold tracking-tight mb-8 gradient-text-enhanced animate-fade-in-up animation-delay-400">
          Case Studies
        </h1>
          
          <p className="text-subtitle text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up animation-delay-600">
            Deep dives into real projects where design meets strategy, 
            showcasing the process behind impactful digital solutions.
                  </p>
                </div>

        {/* Case Studies Grid */}
        <div className="animate-fade-in-up animation-delay-800">
          <CaseStudyList posts={allPostsData} />
              </div>
      </div>
    </div>
  );
}