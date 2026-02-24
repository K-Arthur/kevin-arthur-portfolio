'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import MagneticButton from '@/components/MagneticButton';
import Footer from '@/components/Footer';
import { TrustStrip } from '@/components/TrustStrip';
import { FeaturedProjects } from '@/components/FeaturedProjects';

const ShaderAnimation = dynamic(() => import('@/components/ui/shader-animation').then(mod => mod.ShaderAnimation), {
  ssr: false
});

// Lazy load 3D Scene component with no SSR
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <SceneLoadingFallback />
});

// Lightweight loading fallback
function SceneLoadingFallback() {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse"
      aria-hidden="true" />
  );
}



export default function HomeClient({ posts }) {
  const [isClient, setIsClient] = useState(false);
  const [shouldLoadScene, setShouldLoadScene] = useState(false);
  const [shouldLoadShader, setShouldLoadShader] = useState(false);
  const ctaSectionRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    // Defer heavy 3D loading until browser is idle for better performance
    let loaded = false;
    const loadScene = () => {
      if (loaded) return;
      loaded = true;

      // Use requestIdleCallback for non-critical 3D content
      // Falls back to setTimeout for browsers that don't support it
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => setShouldLoadScene(true), { timeout: 5000 });
      } else {
        setShouldLoadScene(true);
      }

      window.removeEventListener('scroll', handleScroll);
    };

    // Load on first scroll (user engaged, LCP done) - increased threshold for better stability
    const handleScroll = () => {
      if (window.scrollY > 150) loadScene();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fallback: load after 8 seconds to ensure LCP is fully settled
    const timer = setTimeout(loadScene, 8000);

    // Load shader only when CTA section is near viewport (intersection observer)
    // Defer observation until after initial load and LCP settling
    let observer = null;
    const observerTimer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoadShader(true);
            observer.disconnect();
          }
        },
        { rootMargin: '100px' }  // Reduced from 200px to be more conservative
      );

      if (ctaSectionRef.current) {
        observer.observe(ctaSectionRef.current);
      }
    }, 2000); // Increased delay to 2s to clear critical LCP window

    return () => {
      clearTimeout(timer);
      clearTimeout(observerTimer);
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center flex-grow py-20 md:py-32 overflow-hidden">
        {isClient && shouldLoadScene && (
          <Suspense fallback={<SceneLoadingFallback />}>
            <Scene />
          </Suspense>
        )}

        <div className="relative z-10 container-responsive space-y-12">
          {/* Critical LCP content - uses LCP-optimized animation for fast paint */}
          <div className="space-y-8 animate-hero-fade">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              <span className="block">Product <span className="gradient-text-brand">Designer</span></span>
              <span className="block text-2xl md:text-4xl lg:text-5xl mt-4 font-bold tracking-tight text-foreground">
                <span className="block">Designing systems where complexity</span>
                <span className="text-primary block">meets clarity.</span>
              </span>
            </h1>

            <div className="space-y-6 animate-hero-fade" style={{ animationDelay: '0.1s' }}>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light">
                I design AI interfaces, enterprise tools, and scalable design systems.
                Recent work includes healthcare platforms serving 500+ facilities,
                fintech workflows, and technical products with measurable outcomes.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 w-full sm:w-auto animate-hero-fade" style={{ animationDelay: '0.2s' }}>
            <MagneticButton
              href="/case-studies"
              strength={0.3}
              className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <span>View Case Studies</span>
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href="https://calendly.com/arthurkevin27/15min"
              target="_blank"
              rel="noopener noreferrer"
              strength={0.25}
              className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Schedule a Call</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Featured Teaser */}
      {posts?.some(p => p.id === 'minohealth-radiology') && (
        <section className="relative z-20 -mt-8 sm:-mt-12 mb-16 md:mb-24 w-full px-4 md:px-8 max-w-7xl mx-auto shadow-2xl">
          <div className="flex justify-center mb-8 md:mb-12 animate-fade-in-up animation-delay-500">
            <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm">
              Featured Case Study
            </span>
          </div>
          <FeaturedProjects posts={[posts.find(p => p.id === 'minohealth-radiology')]} />
        </section>
      )}

      {/* High-Leverage Trust Section */}
      <TrustStrip className="relative z-10" />

      {/* Featured Case Studies (Bespoke Zig-Zag Layout) */}
      <section className="py-20 md:py-32 relative z-10 w-full" aria-labelledby="featured-work-heading">
        <div className="container-responsive">
          <div className="mb-16 md:mb-24 animate-fade-in-up text-center lg:text-left">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">Selected work</p>
            <h2 id="featured-work-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Products with <span className="gradient-text-brand">measurable impact</span>
            </h2>
            <p className="text-base md:text-lg text-muted-enhanced max-w-xl leading-relaxed">
              AI systems, fintech platforms, and enterprise tools—designed for scale, adopted by users, shipped to production.
            </p>
          </div>

          <FeaturedProjects posts={posts?.filter(post => post.id !== 'minohealth-radiology' && !['kamen-rider-game-hud', 'snackbox-404'].includes(post.id)).slice(0, 2) || []} />

          <div className="mt-20 md:mt-32 text-center">
            <MagneticButton
              href="/case-studies"
              strength={0.2}
              className="group inline-flex items-center justify-center gap-2 text-foreground hover:text-primary font-semibold px-8 py-4 sm:px-10 sm:py-5 text-lg rounded-xl border border-border/50 hover:border-primary/50 bg-card/50 hover:bg-card/80 transition-all shadow-sm hover:shadow-lg"
            >
              <span>Explore Case Studies</span>
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Lab Section */}
      <section className="py-16 md:py-20 border-t border-border/30 bg-muted/10 relative z-10 w-full" aria-labelledby="ux-lab-heading">
        <div className="container-responsive text-center">
          <h2 id="ux-lab-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            R&D Lab
          </h2>
          <p className="text-base text-muted-enhanced max-w-2xl mx-auto leading-relaxed mb-8">
            Experiments in interaction design, component engineering, and motion—exploring the edge of what&apos;s technically possible.
          </p>
          <MagneticButton
            href="/lab"
            strength={0.2}
            className="group inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-medium px-6 py-3 rounded-xl border border-border/50 hover:border-primary/50 transition-all"
          >
            <span>View Experiments</span>
            <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
        </div>
      </section>

      {/* Call to Action Section with Shader + Footer Wrapper */}
      <section ref={ctaSectionRef} className="relative overflow-hidden" aria-labelledby="cta-heading">
        {/* Shader animation background layer - spans CTA and Footer - only loads when section is near viewport */}
        {isClient && shouldLoadShader && (
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-10 light:opacity-5 pointer-events-none">
            <ShaderAnimation />
          </div>
        )}

        {/* CTA Content */}
        <div className="py-20 md:py-32">
          <div className="container-responsive text-center relative z-10 animate-fade-in-up">
            <h2
              id="cta-heading"
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              Let&apos;s Talk About <span className="text-primary">Your Product</span>
            </h2>
            <p className="text-lg text-muted-enhanced max-w-3xl mx-auto mb-10">
              I help teams design complex systems that users trust and adopt.
              Currently open to product design roles and select consulting engagements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 flex-wrap w-full sm:w-auto">
              <MagneticButton
                href="https://calendly.com/arthurkevin27/15min"
                target="_blank"
                rel="noopener noreferrer"
                strength={0.3}
                className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
              >
                <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Schedule a Call</span>
              </MagneticButton>
              <MagneticButton
                href="/case-studies"
                strength={0.2}
                className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
              >
                <span>View Case Studies</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Footer inside shader wrapper */}
        <Footer transparent />
      </section>
    </div>
  );
}
