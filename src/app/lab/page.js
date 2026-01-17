'use client';

import { FaClipboardCheck, FaBrain, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { HandWrittenTitle } from '@/components/ui/hand-writing-text';
import LeadMagnetForm from '@/components/LeadMagnetForm';
import AIReadinessQuiz from '@/components/AIReadinessQuiz';
import dynamic from 'next/dynamic';

// Lazy load heavy background component
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then(mod => ({ default: mod.InfiniteGridBackground })),
  { ssr: false }
);

const checklistItems = [
  'Component naming conventions for clean handoffs',
  'All interactive states documented (hover, active, disabled, loading, error)',
  'Responsive breakpoints defined (mobile, tablet, desktop)',
  'Design tokens: colors, typography, spacing systems',
  'Animation timing and easing specifications',
  'Error handling and empty state designs',
  'Icon export specs and image requirements',
  'Accessibility annotations (focus states, ARIA, contrast)',
];

export default function LabPage() {
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
      <section className="py-16 md:py-24">
        <div className="container-responsive animate-fade-in-up">
            <HandWrittenTitle
              title="Free Resources for"
              highlightedText="Product Teams"
              subtitle="Tools I've built from 4+ years of designing and building products. No fluff—just practical frameworks you can use today."
            />
        </div>
      </section>

      {/* Lead Magnet 1: Design Checklist */}
      <section className="py-12 md:py-20" id="design-checklist">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in-up">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <FaClipboardCheck className="w-4 h-4" />
                <span>Free PDF Download</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Developer-Ready Design Checklist
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Stop losing weeks to design-dev handoff friction. This 12-point checklist ensures your designs ship exactly as intended—reducing implementation questions by 80%.
              </p>

              <div className="space-y-3">
                {checklistItems.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FaCheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
                <p className="text-muted-foreground text-sm pl-8">
                  + {checklistItems.length - 4} more critical checks
                </p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Built from 4+ years designing healthcare AI, SaaS, and fintech products.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card-enhanced p-6 md:p-8 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-fade-in-up animation-delay-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Get the Free Checklist
                </h3>
                <p className="text-muted-foreground text-sm">
                  Enter your email and I'll send it right over.
                </p>
              </div>

              <LeadMagnetForm
                resource="design-checklist"
                buttonText="Send Me the Checklist"
                successMessage="Your PDF is downloading! We've also sent a copy to your inbox."
                showName={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container-responsive">
        <div className="border-t border-border/30" />
      </div>

      {/* Lead Magnet 2: AI Readiness Audit */}
      <section className="py-12 md:py-20" id="ai-audit">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaBrain className="w-4 h-4" />
                <span>Interactive Assessment</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                AI Interface Readiness Audit
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Is your product's UX ready for AI features? Take this 2-minute assessment to find out—before investing in development.
              </p>
            </div>

            {/* Quiz */}
            <AIReadinessQuiz />

            {/* Social Proof */}
            <div className="mt-12 text-center animate-fade-in-up animation-delay-400">
              <p className="text-sm text-muted-foreground mb-4">
                Based on lessons learned designing AI interfaces for:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
                <span className="px-4 py-2 bg-card/50 rounded-lg text-sm">
                  Moremi AI (97% diagnostic accuracy)
                </span>
                <span className="px-4 py-2 bg-card/50 rounded-lg text-sm">
                  500+ Healthcare Facilities
                </span>
                <span className="px-4 py-2 bg-card/50 rounded-lg text-sm">
                  Featured on CNN
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card/20">
        <div className="container-responsive text-center animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Need More Than a Checklist?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            If you're building AI-powered products or complex SaaS platforms, 
            let's discuss how I can help you ship faster.
          </p>
          <a
            href="/contact#schedule"
            className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-glow font-semibold px-8 py-4 rounded-xl transition-all"
          >
            <span>Book a 15-Min Call</span>
            <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </InfiniteGridBackground>
  );
}
