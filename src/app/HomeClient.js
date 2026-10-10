'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useMounted } from '@/lib/use-mounted';
import { FaArrowRight, FaDownload } from 'react-icons/fa';
import MagneticButton from '@/components/MagneticButton';
import Footer from '@/components/Footer';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { personalInfo } from '@/data/portfolio-data';

const ShaderAnimation = dynamic(() => import('@/components/ui/shader-animation').then(mod => mod.ShaderAnimation), {
  ssr: false
});

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <SceneLoadingFallback />
});

function SceneLoadingFallback() {
  return (
    <div className="absolute inset-0 z-0 hidden md:block bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse"
      aria-hidden="true" />
  );
}

const SELECTED_WORK_IDS = [
  'moremi-ai-multimodal-medical-platform',
  'opencode-harness',
];

const CARD_EXTRAS = {
  varve: {
    summary: 'I designed and engineered Varve, a free local-first design suite now in public beta (v0.5.0). React/TypeScript editor on a Rust/WASM engine. Six workspaces, no account.',
    proof: 'DTCG tokens become CSS and React — the inspector and the canvas share one source of truth.',
    extraLinks: [
      { href: 'https://github.com/K-Arthur/varve', label: 'Source' },
      { href: 'https://varve.studio/try/', label: 'Try it' },
    ],
  },
  'moremi-ai-multimodal-medical-platform': {
    summary: 'I owned product design for Moremi AI: clinical workflows, explicit uncertainty states, and a system clinicians could use on phones and desktops.',
    proof: 'Clinical IA around patients → diagnose → review → report, with uncertainty as a first-class UI state.',
  },
  'opencode-harness': {
    summary: 'A VS Code client I built for the opencode agent. Silent Staleness meant the UI trusted cached values; I rebuilt it so the interface re-derives from live state on every change.',
    proof: 'Active re-derivation plus a test wall — stale UI fails the build.',
  },
};

export default function HomeClient({ posts }) {
  const isClient = useMounted();
  const [shouldLoadScene, setShouldLoadScene] = useState(false);
  const [shouldLoadShader, setShouldLoadShader] = useState(false);
  const ctaSectionRef = useRef(null);

  useEffect(() => {
    let loaded = false;
    const loadScene = () => {
      if (loaded) return;
      loaded = true;
      if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => setShouldLoadScene(true), { timeout: 5000 });
        } else {
          setShouldLoadScene(true);
        }
      }
      window.removeEventListener('scroll', handleScroll);
    };

    const handleScroll = () => {
      if (window.scrollY > 150) loadScene();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setTimeout(loadScene, 8000);

    let observer = null;
    const observerTimer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoadShader(true);
            observer.disconnect();
          }
        },
        { rootMargin: '100px' }
      );

      if (ctaSectionRef.current) {
        observer.observe(ctaSectionRef.current);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(observerTimer);
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  const decorate = (post) => {
    if (!post) return post;
    const extra = CARD_EXTRAS[post.id] || {};
    return { ...post, ...extra };
  };

  const featuredPost = decorate(posts?.find(p => p.id === 'varve'));
  const selectedPosts = SELECTED_WORK_IDS
    .map((id) => decorate(posts?.find((post) => post.id === id)))
    .filter(Boolean);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="relative flex flex-col items-center justify-center text-center flex-grow py-20 md:py-32 overflow-hidden">
        {isClient && shouldLoadScene && (
          <div className="hidden md:block absolute inset-0 z-0">
            <Suspense fallback={<SceneLoadingFallback />}>
              <Scene />
            </Suspense>
          </div>
        )}

        <div className="relative z-10 container-responsive space-y-12">
          <div className="space-y-8 animate-hero-fade">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-muted-enhanced max-w-3xl mx-auto leading-relaxed px-2">
              Kevin Arthur · Design Engineer &amp; Product Designer · Vancouver, Canada
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
              I design product interfaces and <span className="gradient-text-brand">ship them in code.</span>
            </h1>

            <div className="space-y-6 animate-hero-fade" style={{ animationDelay: '0.1s' }}>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light">
                I founded Varve, a free, local-first design suite, and built its React/TypeScript editor — now in public beta (v0.5.0, Oct 2026). Before that I owned product design for clinical-AI tools at minoHealth AI Labs.
              </p>
              <p className="text-base md:text-lg text-muted-enhanced max-w-3xl mx-auto leading-relaxed">
                Open to remote roles.
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
            <a
              href="https://github.com/K-Arthur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] text-sm font-medium text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

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

      {selectedPosts.length > 0 && (
        <section className="py-16 md:py-24 relative z-10 w-full" aria-labelledby="selected-work-heading">
          <div className="container-responsive">
            <div className="mb-12 md:mb-16 animate-fade-in-up text-center lg:text-left">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">Selected work</p>
              <h2 id="selected-work-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                More <span className="gradient-text-brand">work</span>
              </h2>
              <p className="text-base md:text-lg text-muted-enhanced max-w-xl leading-relaxed">
                Clinical-AI product design at minoHealth, then a VS Code client where stale UI is a product failure.
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

      <section className="py-16 md:py-24 border-t border-border/30 relative z-10 w-full" aria-labelledby="about-teaser-heading">
        <div className="container-responsive">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">About</p>
            <h2 id="about-teaser-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Design engineer and product designer
            </h2>
            <p className="text-base md:text-lg text-muted-enhanced leading-relaxed mb-8">
              Kevin Arthur is a design engineer and product designer. He founded Varve, a free, local-first design suite (public beta v0.5.0, October 2026), and designed and built its React and TypeScript editor. From 2023 to 2025 he was a product designer for clinical-AI tools at minoHealth AI Labs.
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
              If you&apos;re hiring a designer who ships in React and TypeScript, get in touch.
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
