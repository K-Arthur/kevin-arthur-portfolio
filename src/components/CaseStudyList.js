'use client';

import Link from 'next/link';
import { CloudinaryImage } from './OptimizedImage';
import dynamic from 'next/dynamic';
import { CursorTrigger } from '@/components/CursorProvider';
import { FaArrowRight, FaRocket, FaFlask } from '@/lib/icons';

// Lazy load CometCard - requires JS for mouse-tracking 3D tilt, loads after LCP
const CometCard = dynamic(
  () => import('@/components/ui/comet-card').then(mod => mod.CometCard),
  { ssr: false }
);

const CaseStudyList = ({ posts }) => {
  return (
    <div className="space-y-8 md:space-y-12">
      {posts.map(({ id, title, summary, role, duration, industry, status, results, heroImage }, index) => {
        const isConcept = status === 'concept';
        const primaryMetric = results?.[0];
        const secondaryMetrics = results?.slice(1, 3);
        
        return (
          <div
            key={id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CometCard rotateDepth={8} translateDepth={10}>
              <div className={`bg-card dark:bg-gradient-to-br dark:from-card/95 dark:via-card/90 dark:to-primary/5 border border-border/50 dark:border-primary/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-primary/40 shadow-lg ${isConcept ? 'opacity-90' : ''}`}>
                <CursorTrigger type="view" text="View">
                  <Link href={`/case-studies/${id}`} className="block">
                    {/* Hero Image */}
                    {heroImage && (
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <CloudinaryImage
                          src={heroImage}
                          alt={title}
                          fill
                          preset="caseStudy"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                        
                        {/* Status Badge - Responsive positioning and sizing */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100%-1.5rem)]">
                          {isConcept ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold bg-amber-500/90 text-amber-950 rounded-full backdrop-blur-sm shadow-sm">
                              <FaFlask className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden sm:inline">Concept</span>
                              <span className="sm:hidden">Concept</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold bg-emerald-500/90 text-emerald-950 rounded-full backdrop-blur-sm shadow-sm">
                              <FaRocket className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden sm:inline">Shipped</span>
                              <span className="sm:hidden">Live</span>
                            </span>
                          )}
                          {industry && (
                            <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium bg-background/90 text-foreground rounded-full backdrop-blur-sm capitalize shadow-sm truncate max-w-[120px] sm:max-w-none">
                              {industry}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Content - Responsive padding */}
                    <div className="p-4 sm:p-6 md:p-8">
                      {/* Primary Metric - Responsive sizing */}
                      {primaryMetric && (
                        <div className="mb-3 sm:mb-4">
                          <div className="inline-flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-primary">
                              {primaryMetric.value}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
                              {primaryMetric.label}
                            </span>
                          </div>
                          {primaryMetric.context && (
                            <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                              {primaryMetric.context}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Title - Responsive sizing */}
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 hover:text-primary transition-colors duration-300 leading-tight">
                        {title}
                      </h2>
                      
                      {/* Summary - Responsive line clamp */}
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                        {summary}
                      </p>
                      
                      {/* Role & Duration - Responsive layout */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        <span className="font-medium text-foreground">{role}</span>
                        {duration && (
                          <>
                            <span className="text-border hidden sm:inline">·</span>
                            <span className="w-full sm:w-auto text-muted-foreground/80">{duration}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Secondary Metrics - Responsive gap */}
                      {secondaryMetrics && secondaryMetrics.length > 0 && (
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 pt-3 sm:pt-4 border-t border-border/20 mb-3 sm:mb-4">
                          {secondaryMetrics.map((res, i) => (
                            <div key={i} className="flex flex-col">
                              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                {res.value}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {res.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* CTA - Responsive sizing */}
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm group/link">
                        <span>Explore Case Study</span>
                        <FaArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/link:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </CursorTrigger>
              </div>
            </CometCard>
          </div>
        );
      })}
    </div>
  );
};

export default CaseStudyList;
