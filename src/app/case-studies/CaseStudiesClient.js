'use client';

import { FaBriefcase, FaRocket } from '@/lib/icons';
import CaseStudyList from '@/components/CaseStudyList';
import dynamic from 'next/dynamic';
import { IOSafeContainer } from '@/components/IOSafeMotion';

const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then(mod => ({ default: mod.InfiniteGridBackground })),
  { ssr: false }
);

export default function CaseStudiesClient({ posts }) {
  // Separate posts by status for visual hierarchy
  const shippedPosts = posts.filter(post => post.status === 'shipped' || !post.status);
  const conceptPosts = posts.filter(post => post.status === 'concept');

  return (
    <IOSafeContainer className="min-h-screen">
      <InfiniteGridBackground
        className="min-h-screen"
        gridSize={50}
        speedX={0.2}
        speedY={0.15}
        revealRadius={350}
        baseOpacity={0.03}
        revealOpacity={0.4}
        fullPage={true}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/10 rounded-xl border border-primary/20 animate-fade-in-up animation-delay-200">
              <FaBriefcase className="text-primary text-lg sm:text-xl md:text-2xl" />
              <span className="text-primary font-semibold text-base sm:text-lg">Selected Work</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text-enhanced mb-4 sm:mb-6 animate-fade-in-up animation-delay-400">
              Case Studies
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0 animate-fade-in-up animation-delay-600">
              Product designer with 7+ years shipping complex systems—from AI interfaces to enterprise workflows.
              Recent work includes healthcare platforms at scale, collaboration tools, and accessible design systems.
              I bridge strategy and implementation to ship products users trust.
            </p>

            {/* Quick Stats - Reflecting current scale achieved */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-10 mt-6 sm:mt-8 max-w-lg sm:max-w-none mx-auto px-4 sm:px-0 animate-fade-in-up animation-delay-800">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">50+</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mt-1">Countries Reached</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">$2.9M</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mt-1">Platform Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">40%</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mt-1">Workflow Efficiency</div>
              </div>
            </div>
          </div>

          {/* Shipped Work Section */}
          <div className="mb-12 md:mb-16 animate-fade-in-up animation-delay-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <FaRocket className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground uppercase tracking-wider">
                Shipped Products
              </h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <CaseStudyList posts={shippedPosts} />
          </div>

          {/* Concept Work Section */}
          {conceptPosts.length > 0 && (
            <div className="animate-fade-in-up animation-delay-1000">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <span className="text-amber-500 text-base sm:text-lg">⚗️</span>
                <h2 className="text-base sm:text-lg font-semibold text-foreground uppercase tracking-wider">
                  Experiments & Concepts
                </h2>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              <CaseStudyList posts={conceptPosts} />
            </div>
          )}
        </div>
      </InfiniteGridBackground>
    </IOSafeContainer>
  );
}
