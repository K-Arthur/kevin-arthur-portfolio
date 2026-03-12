import { FaArrowDown, FaBrain } from 'react-icons/fa';
import SocialProofSection from '@/components/SocialProofSection';
import dynamic from 'next/dynamic';
import { IOSafeContainer } from '@/components/IOSafeMotion';
import { InfiniteGridBackground } from '@/components/ui/the-infinite-grid';
import DesignSystemCard from './DesignSystemCard';
import AIReadinessQuiz from './QuizWrapper';

const checklistItems = [
  'Exhaustive state management (Loading, Empty, Errors)',
  'Strict token and naming adherence (PascalCase, Semantic tokens)',
  'WCAG 2.1 AA+ contrast and navigation compliance',
  'Semantic and keyboard navigation (ARIA, tab orders)',
  'Responsive behaviors and fluid breakpoints defined',
  'Motion orchestration (easing curves, staggered reveals)',
  'Data entry workflows and destructive actions handling',
  'Component reorganization rules across viewports',
  'Vector exports and fallback asset readiness',
];

// Resource data - only available resources, no waitlists
const resources = [
  {
    id: 'design-checklist',
    title: 'Design System Handoff Patterns',
    description: 'Component specification architecture developed at MinoHealth to reduce design-dev friction. Includes state management matrix, token naming conventions, and accessibility annotations.',
    type: 'checklist',
    status: 'available',
    tags: ['Design System', 'Handoff', 'Component Architecture'],
    featured: true,
    link: '#design-checklist',
  },
  {
    id: 'ai-readiness-quiz',
    title: 'AI Interface Pattern Explorer',
    description: 'Interactive exploration of confidence UI patterns, uncertainty handling, and human-in-the-loop workflows. Based on design decisions from 500+ facility healthcare AI deployment.',
    type: 'quiz',
    status: 'available',
    tags: ['AI', 'UX Patterns', 'Confidence UI'],
    featured: true,
    link: '#ai-audit',
  },
];

export default function LabPage() {

  return (
    <IOSafeContainer className="min-h-screen">
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
        {/* Hero Section */}
        <section className="py-16 md:py-24 pb-32 md:pb-40 relative overflow-hidden flex flex-col justify-center border-b border-border/10">
          {/* Subtle background glow for Hero */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="container-responsive relative z-10">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                <span className="block">R&D Lab</span>
                <span className="block text-2xl md:text-4xl mt-4 font-bold tracking-tight text-muted-foreground">
                  Technical experiments & design system architecture
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                Prototypes, patterns, and component explorations from production work.
                Each experiment includes problem context, implementation approach, and lessons learned.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <a
                  href="#featured"
                  className="btn-primary-enhanced px-6 md:px-8 py-3 rounded-xl font-semibold flex items-center gap-2 group"
                >
                  <span>Explore Experiments</span>
                  <FaArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <a
            href="#featured"
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Scroll to experiments"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Discover</span>
            <div className="w-px h-10 md:h-12 bg-gradient-to-b from-primary/50 to-transparent" />
          </a>
        </section>

        {/* Trust Indicators */}
        <div className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
          <div className="container-responsive">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl py-4 md:py-6 px-4 md:px-6 shadow-xl shadow-black/5">
              <SocialProofSection />
            </div>
          </div>
        </div>

        {/* Featured Experiments Section */}
        <section className="py-16 md:py-24" id="featured">
          <div className="container-responsive">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                  Featured <span className="text-primary">Experiments</span>
                </h2>
                <p className="text-lg text-muted-foreground mt-4">
                  Technical explorations solving specific friction points in design systems and AI interfaces.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:gap-10 pt-4">
              {/* Primary Experiment: Design System Handoff */}
              <div className="animate-fade-in-up w-full" id="design-checklist">
                <DesignSystemCard checklistItems={checklistItems} />
              </div>

              {/* Second Experiment: AI Interface Patterns */}
              <div className="animate-fade-in-up animation-delay-200 w-full" id="ai-audit">
                <div className="glass-premium rounded-3xl p-6 md:p-8 lg:p-10 border-indigo-500/20 bg-indigo-500/[0.02] relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full -translate-x-1/2 -mt-[15rem] blur-[100px] pointer-events-none" />

                  {/* Compact Header */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <FaBrain className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">AI Interface Pattern Explorer</h3>
                        <p className="text-sm text-muted-foreground">Confidence UI & uncertainty handling</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 w-full">
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-5 md:p-6 shadow-xl shadow-indigo-500/5 text-left">
                      <AIReadinessQuiz compact={false} noBackground={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 relative">
          <div className="container-responsive">
            <div className="text-center py-10 sm:py-16 card-enhanced rounded-2xl bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Ready to Work Together?</h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
                I&apos;m currently accepting new projects. Let&apos;s discuss how I can help bring your vision to life.
              </p>
              <a
                href="https://calendly.com/arthurkevin27/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[44px] px-6 sm:px-8 py-3.5 sm:py-4 btn-primary-enhanced btn-glow font-semibold rounded-xl text-base sm:text-lg transition-all shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 sm:hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>Book a Quick Chat</span>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M432 48h-48v16c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16V48H176v16c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16V48H80c-26.5 0-48 21.5-48 48v368c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V96c0-26.5-21.5-48-48-48zM368 416H144c-8.8 0-16-7.2-16-16v-16c0-8.8 7.2-16 16-16h224c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16zm0-96H144c-8.8 0-16-7.2-16-16v-16c0-8.8 7.2-16 16-16h224c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16zM128 208v-32c0-8.8 7.2-16 16-16h224c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zM368 0h-32c-8.8 0-16 7.2-16 16v16h80V16c0-8.8-7.2-16-16-16zM144 0h-32c-8.8 0-16 7.2-16 16v16h80V16c0-8.8-7.2-16-16-16z"></path></svg>
              </a>
            </div>
          </div>
        </section>
      </InfiniteGridBackground>
    </IOSafeContainer>
  );
}
