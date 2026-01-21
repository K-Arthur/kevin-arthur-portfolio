'use client';

import { FaLightbulb } from 'react-icons/fa';
import CaseStudyList from '@/components/CaseStudyList';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then(mod => ({ default: mod.InfiniteGridBackground }))
);

export default function CaseStudiesClient({ posts }) {
  return (
    <InfiniteGridBackground
      className="min-h-screen"
      gridSize={50}
      speedX={0.25}
      speedY={0.2}
      revealRadius={350}
      baseOpacity={0.04}
      revealOpacity={0.45}
      fullPage={true}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20 animate-fade-in-up animation-delay-200">
            <FaLightbulb className="text-primary text-2xl" />
            <span className="text-primary font-semibold text-lg">Design Solutions</span>
          </div>

          <h1 className="text-hero font-bold tracking-tight gradient-text-enhanced mb-8 animate-fade-in-up animation-delay-400">
            Case Studies
          </h1>

          <p className="text-subtitle text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up animation-delay-600">
            Deep dives into real projects where design meets strategy,
            showcasing the process behind impactful digital solutions.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="animate-fade-in-up animation-delay-800">
          <CaseStudyList posts={posts} />
        </div>
      </div>
    </InfiniteGridBackground>
  );
}
