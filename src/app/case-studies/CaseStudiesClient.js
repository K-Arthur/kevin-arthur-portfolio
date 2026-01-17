'use client';

import { FaLightbulb } from 'react-icons/fa';
import Parallax from '@/components/Parallax';
import CaseStudyList from '@/components/CaseStudyList';
import { InfiniteGridBackground } from '@/components/ui/the-infinite-grid';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';

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
          <Parallax offset={-20}>
            <div className="inline-flex items-center gap-3 mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20 animate-fade-in-up animation-delay-200">
              <FaLightbulb className="text-primary text-2xl" />
              <span className="text-primary font-semibold text-lg">Design Solutions</span>
            </div>

            <AnimatedText
              text="Case Studies"
              className="mb-8 animate-fade-in-up animation-delay-400"
              textClassName="text-hero font-bold tracking-tight gradient-text-enhanced"
              underlineClassName="text-primary"
              underlineDuration={1.2}
              strokeWidth={6}
            />

            <p className="text-subtitle text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up animation-delay-600">
              Deep dives into real projects where design meets strategy,
              showcasing the process behind impactful digital solutions.
            </p>
          </Parallax>
        </div>

        {/* Case Studies Grid */}
        <div className="animate-fade-in-up animation-delay-800">
          <CaseStudyList posts={posts} />
        </div>
      </div>
    </InfiniteGridBackground>
  );
}
