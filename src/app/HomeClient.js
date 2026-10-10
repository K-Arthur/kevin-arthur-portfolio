'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useMounted } from '@/lib/use-mounted';
import { FaArrowRight, FaDownload, FaGithub } from 'react-icons/fa';
import MagneticButton from '@/components/MagneticButton';
import Footer from '@/components/Footer';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { personalInfo } from '@/data/portfolio-data';

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

const SELECTED_WORK_IDS = [
  'moremi-ai-multimodal-medical-platform',
  'opencode-harness',
];

const HOW_I_WORK = [
  {
    href: '/case-studies/varve',
    kicker: 'Varve',
    title: 'Tokens that ship',
    body: 'DTCG tokens become CSS and React components. The inspector and the canvas share one source of truth — the design system is the product surface, not a handoff artifact.',
    link: 'Read the Varve case study',
  },
  {
    href: '/case-studies/moremi-ai-multimodal-medical-platform',
    kicker: 'Moremi AI',
    title: 'Clinical IA, not model IA',
    body: 'I restructured the product around patients → diagnose → review → report. Uncertainty is a first-class UI state, with a human override on every recommendation.',
    link: 'Read the Moremi case study',
  },
  {
    href: '/case-studies/opencode-harness',
    kicker: 'OpenCode Harness',
    title: 'The UI is the contract',
    body: 'Stale UI is a product failure. Active re-derivation rebuilds the interface from live state on every change, and a test wall turns a dead wire into a red build.',
    link: 'Read the OpenCode case study',
  },
];

export default function HomeClient({ posts }) {
  const isClient = useMounted();
  const [shouldLoadScene, setShouldLoadScene] = useState(false);
  const [shouldLoadShader, setShouldLoadShader] = useState(false);
  const ctaSectionRef = useRef(null);

  useEffect(() => {
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

  const featuredPost = posts?.find(p => p.id === 'varve');
  const selectedPosts = SELECTED_WORK_IDS
    .map((id) => posts?.find((post) => post.id === id))
    .filter(Boolean);

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
          <div className="space-y-8 animate-hero-fade">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-muted-enhanced max-w-3xl mx-auto leading-relaxed px-2">
              Design Engineer · Product Designer · Frontend (React, TypeScript, Next.js) · Vancouver, open to remote roles in Canada
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
              I design product interfaces and <span className="gradient-text-brand">ship them in code.</span>
            </h1>

            <div className="space-y-6 animate-hero-fade" style={{ animationDelay: '0.1s' }}>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light">
                I take complex products from research and Figma to production React and TypeScript. I&apos;m the founder and designer-engineer of Varve, a free, local-first design suite now in public beta (v0.5.0) on Linux, macOS and Windows. Before that I owned product design for clinical-AI tools at minoHealth AI Labs.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 w-full sm:w-auto animate-hero-fade flex-wrap" style={{ animationDelay: '0.2s' }}>
            <MagneticButton
              href="/case-studies/varve"
              strength={0.3}
              className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <span>See the Varve case study</span>
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              strength={0.25}
              className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download resume</span>
            </MagneticButton>
            <MagneticButton
              href="https://github.com/K-Arthur"
              target="_blank"
              rel="noopener noreferrer"
              strength={0.2}
              className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>GitHub</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Featured: Varve only */}
      {featuredPost && (
        <section className="relative z-20 -mt-8 sm:-mt-12 mb-8 md:mb-12 w-full px-4 md:px-8 max-w-7xl mx-auto" aria-labelledby="featured-heading">
          <div className="flex justify-center mb-8 md:mb-12 animate-fade-in-up animation-delay-500">
            <h2 id="featured-heading" className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm">
              Featured case study
            </h2>
          </div>
          <FeaturedProjects posts={[featuredPost]} titleAs="h3" priorityFirst />
        </section>
      )}

      {/* Selected work: Moremi + OpenCode. Tembea has no public material in this repo. */}
      {selectedPosts.length > 0 && (
        <section className="py-16 md:py-24 relative z-10 w-full" aria-labelledby="selected-work-heading">
          <div className="container-responsive">
            <div className="mb-12 md:mb-16 animate-fade-in-up text-center lg:text-left">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">Selected work</p>
              <h2 id="selected-work-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Two more pieces <span className="gradient-text-brand">worth reading</span>
              </h2>
              <p className="text-base md:text-lg text-muted-enhanced max-w-xl leading-relaxed">
                Clinical-AI product design at minoHealth, then a VS Code client where stale UI is treated as a product failure.
              </p>
            </div>

            <FeaturedProjects posts={selectedPosts} titleAs="h3" />

            <p className="mt-12 md:mt-16 text-center">
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors min-h-[44px]"
              >
                All case studies
                <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* Design-to-code / how I work — skills via evidence, not a logo cloud */}
      <section className="py-16 md:py-24 border-t border-border/30 relative z-10 w-full" aria-labelledby="how-i-work-heading">
        <div className="container-responsive">
          <div className="mb-10 md:mb-14 text-center lg:text-left max-w-3xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">How I work</p>
            <h2 id="how-i-work-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Design to code, <span className="gradient-text-brand">with evidence</span>
            </h2>
            <p className="text-base md:text-lg text-muted-enhanced leading-relaxed">
              Skills shown through shipped work — tokens, clinical IA, and deterministic UI state. Not a tool logo cloud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
            {HOW_I_WORK.map((item) => (
              <article
                key={item.href}
                className="h-full min-h-0 p-6 md:p-8 bg-card/40 border border-border rounded-2xl backdrop-blur-sm flex flex-col"
              >
                <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">{item.kicker}</p>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{item.body}</p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 mt-5 min-h-[44px] py-2 text-primary font-semibold text-sm hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md transition-colors"
                >
                  {item.link}
                  <FaArrowRight className="w-3.5 h-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brief about teaser — full bio lives on /about */}
      <section className="py-16 md:py-24 border-t border-border/30 relative z-10 w-full" aria-labelledby="about-teaser-heading">
        <div className="container-responsive">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">About</p>
            <h2 id="about-teaser-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Design engineer in Vancouver
            </h2>
            <p className="text-base md:text-lg text-muted-enhanced leading-relaxed mb-4">
              {personalInfo.summary}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              MSc Applied Computer Science at Fairleigh Dickinson University Vancouver, expected Dec 2026. BSc Computer Science, KNUST.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors min-h-[44px]"
            >
              More about me
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact + Footer */}
      <section ref={ctaSectionRef} className="relative overflow-hidden" aria-labelledby="cta-heading">
        {isClient && shouldLoadShader && (
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-10 light:opacity-5 pointer-events-none">
            <ShaderAnimation />
          </div>
        )}

        <div className="py-20 md:py-32">
          <div className="container-responsive text-center relative z-10 animate-fade-in-up">
            <h2
              id="cta-heading"
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              Open to design engineer and <span className="text-primary">frontend roles</span>
            </h2>
            <p className="text-lg text-muted-enhanced max-w-3xl mx-auto mb-10">
              Remote in Canada, or Vancouver. If you&apos;re hiring a designer who ships in React and TypeScript, get in touch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 flex-wrap w-full sm:w-auto">
              <MagneticButton
                href="/contact"
                strength={0.3}
                className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
              >
                <span>Get in touch</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                href={`mailto:${personalInfo.email}`}
                strength={0.2}
                className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
              >
                <span>Email</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>
        </div>

        <Footer transparent />
      </section>
    </div>
  );
}
