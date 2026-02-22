'use client';

import { useState, useMemo } from 'react';
import { FaClipboardCheck, FaBrain, FaArrowRight, FaArrowDown, FaCheckCircle, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AIReadinessQuiz from '@/components/AIReadinessQuiz';
import SocialProofSection from '@/components/SocialProofSection';
import dynamic from 'next/dynamic';

// Lazy load heavy background component
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then(mod => ({ default: mod.InfiniteGridBackground }))
);

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
  const [showPreview, setShowPreview] = useState(false);

  // Scroll to section handler for smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
      {/* Hero Section */}
      <section className="py-16 md:py-24 pb-32 md:pb-40 relative overflow-hidden flex flex-col justify-center border-b border-border/10">
        {/* Subtle background glow for Hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-responsive relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
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
              <button
                onClick={() => scrollToSection('featured')}
                className="btn-primary-enhanced px-6 md:px-8 py-3 rounded-xl font-semibold flex items-center gap-2 group"
                type="button"
              >
                <span>Explore Experiments</span>
                <FaArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection('featured')}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Scroll to experiments"
          type="button"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Discover</span>
          <div className="w-px h-10 md:h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </button>
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
              <div className="glass-premium rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden group flex flex-col lg:flex-row gap-8 lg:gap-10 items-center border-primary/20">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] transition-colors group-hover:bg-primary/20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-[100px]" />

                <div className="relative z-10 flex-1 space-y-4 lg:max-w-xl">
                  {/* Compact Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <FaClipboardCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">Design System Handoff Patterns</h3>
                      <p className="text-sm text-muted-foreground">9 specification dimensions</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Component specification architecture I developed at MinoHealth to reduce design-dev friction. 
                    Includes state management matrix, token naming conventions, and accessibility annotations.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <a
                      href="/Developer-Ready-Design-Checklist.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-enhanced px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group/btn"
                    >
                      <span>View Patterns</span>
                      <FaArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                    >
                      <FaEye className="w-4 h-4" />
                      <span>{showPreview ? 'Hide Preview' : 'Preview Contents'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 lg:w-2/5 w-full lg:flex-shrink-0">
                  <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-xl shadow-primary/5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Specification Dimensions</h4>
                    <ul className="space-y-2.5">
                      {checklistItems.slice(0, 5).map((item, index) => (
                        <li key={index} className="flex items-start gap-3 group/item">
                          <FaCheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5 transition-transform group-hover/item:scale-110" />
                          <span className="text-sm text-foreground/90 font-medium leading-normal">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {showPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-border/30"
                      >
                        <ul className="space-y-2.5">
                          {checklistItems.slice(5).map((item, index) => (
                            <li key={index} className="flex items-start gap-3 group/item">
                              <FaCheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground/90 font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    {!showPreview && <p className="text-xs text-muted-foreground mt-3">+ 4 more dimensions</p>}
                  </div>
                </div>
              </div>
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
      <section className="py-16 md:py-24 relative">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Let&apos;s Build Something <span className="text-primary">Together</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Interested in discussing design systems, AI interfaces, or complex product challenges?
            </p>
            <a
              href="https://calendly.com/arthurkevin27/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 btn-primary-enhanced px-8 py-4 rounded-xl font-semibold"
            >
              <span>Schedule a Call</span>
              <FaArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </InfiniteGridBackground>
  );
}
