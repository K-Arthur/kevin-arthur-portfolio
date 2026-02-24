'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  personalInfo,
  education,
  professionalExperience,
  expertiseAreas,
  designPhilosophy,
} from '@/data/portfolio-data';
import { FaBriefcase, FaGraduationCap, FaArrowRight, FaBrain, FaCalendarAlt } from 'react-icons/fa';

import { CometCard } from '@/components/ui/comet-card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import RecognitionSection from '@/components/RecognitionSection';
import dynamic from 'next/dynamic';

// Dynamically import heavy components - defer loading


// Lazy load background - non-blocking (default import avoids ChunkLoadError)
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid'),
  { ssr: false }
);

// Lazy load TextScramble - requires JS for character animation, loads after LCP
const TextScramble = dynamic(
  () => import('@/components/ui/text-scramble').then(mod => mod.TextScramble),
  { ssr: false, loading: () => <span>Product Designer</span> }
);

// Lazy load scroll animation components
const ScrollRevealContainer = dynamic(
  () => import('@/components/ui/ScrollRevealContainer').then(mod => mod.default),
  { ssr: false }
);
const ScrollRevealItem = dynamic(
  () => import('@/components/ui/ScrollRevealContainer').then(mod => mod.ScrollRevealItem),
  { ssr: false }
);

const Section = ({ children }) => (
  <section className="animate-fade-in-up" style={{ contain: 'layout' }}>
    {children}
  </section>
);

const SectionTitle = ({ icon, children }) => (
  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="min-w-0">{children}</span>
  </h2>
);

const AboutPage = () => {
  // About page with infinite grid background
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16 items-center">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                  <TextScramble
                    as="span"
                    className="text-foreground"
                    duration={1.0}
                    speed={0.035}
                    characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                  >
                    {personalInfo.heroTitle1 ?? 'Product Designer'}
                  </TextScramble>
                  <TextScramble
                    as="span"
                    className="block text-primary mt-2"
                    duration={1.2}
                    speed={0.035}
                    characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                  >
                    {personalInfo.heroTitle2 ?? 'Design Engineer'}
                  </TextScramble>
                </h1>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed text-muted-enhanced" style={{ contain: 'layout' }}>
                  <p className="text-lg sm:text-xl leading-relaxed">
                    {personalInfo.summary}
                  </p>
                  {personalInfo.differentiationStatement && (
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed border-l-4 border-primary/30 pl-4 sm:pl-6 bg-card/20 py-3 sm:py-4 rounded-r-xl">
                      {personalInfo.differentiationStatement}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full animate-fade-in-right animation-delay-200">
              <div className="relative w-full h-96 md:h-[30rem] lg:h-96 md:max-w-sm lg:max-w-none md:mx-auto lg:mx-0 group">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-8 -left-8 w-28 h-28 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative card-enhanced h-full w-full bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 p-2 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10 rounded-3xl">
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src="/images/profile-image.jpg"
                      alt="Kevin Arthur, Design Engineer and AI Interface Design Expert based in Vancouver, Canada"
                      fill
                      className="object-cover object-top lg:object-center transition-transform duration-500 group-hover:scale-105"
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Recognition & Impact */}
        <RecognitionSection />

        {/* What Sets Me Apart Section */}
        <Section delay={0.1}>
          <div className="rounded-2xl border border-border/20 bg-card/20 p-6 sm:p-8 backdrop-blur-sm transition-colors duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-10 text-center">
              How I Approach My Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: '🎯', title: 'Strategic Thinking', text: "I don't just design pixels. I align every decision with user needs and business goals to create solutions that deliver real, measurable impact." },
                { icon: '⚡', title: 'Speed & Efficiency', text: 'Leveraging lean design principles and rapid prototyping, I accelerate the journey from concept to launch without compromising quality.' },
                { icon: '🔄', title: 'Continuous Learning', text: "The digital landscape is always evolving, and so am I. I'm committed to mastering new tools and technologies to keep your product ahead of the curve." },
                { icon: '🤝', title: 'Radical Collaboration', text: "The best ideas emerge when we work together. I foster a collaborative environment where every voice is heard to build solutions that truly resonate." },
              ].map((item, index) => (
                <CometCard key={index} className="w-full h-full">
                  <div className="h-full flex flex-col items-center text-center p-5 sm:p-6 bg-card/40 border border-border rounded-2xl backdrop-blur-sm">
                    <div className="mb-3 sm:mb-4 text-3xl sm:text-4xl">{item.icon}</div>
                    <p className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">{item.title}</p>
                    <p className="text-muted-enhanced text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </CometCard>
              ))}
            </div>
          </div>
        </Section>

        {/* Expertise Areas */}
        <Section>
          <SectionTitle icon={<FaBrain />}>Expertise Areas</SectionTitle>
          <p className="text-muted-foreground mb-6 sm:mb-10 max-w-2xl leading-relaxed text-sm sm:text-base">
            Senior-level specializations that differentiate my work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {expertiseAreas.map((area, index) => (
              <CometCard key={index} className="w-full h-full">
                <div className="h-full min-h-0 p-6 md:p-8 bg-card/40 border border-border rounded-2xl backdrop-blur-sm flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3">{area.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {area.description}
                  </p>
                  {area.caseStudyId && (
                    <Link
                      href={`/case-studies/${area.caseStudyId}`}
                      className="inline-flex items-center gap-2 mt-4 min-h-[44px] py-2 text-primary font-semibold text-sm hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md transition-colors"
                    >
                      View case study
                      <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </CometCard>
            ))}
          </div>
        </Section>

        <Section delay={0.4}>
          <SectionTitle icon={<FaBriefcase />}>Career Highlights</SectionTitle>
          <div className="relative md:pl-0">
            {/* Timeline Line */}
            <div className="absolute left-5 md:left-1/2 top-4 bottom-0 w-px bg-border -translate-x-1/2" aria-hidden></div>

            <div className="space-y-10 sm:space-y-12 md:space-y-16 relative">
              {professionalExperience.map((job, index) => (
                <ScrollRevealContainer
                  key={index}
                  variant={index % 2 === 0 ? "slideLeft" : "slideRight"}
                  delay={index * 0.1}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start pl-10 md:pl-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >

                  {/* Timeline Dot */}
                  <div className="absolute left-5 md:left-1/2 top-0 w-4 h-4 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-card border-2 border-primary shadow-[0_0_10px_rgba(var(--primary),0.4)] z-20 relative"></div>
                    <div className="absolute w-16 h-16 -left-6 -top-6 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                  </div>

                  {/* Date/Label Side */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} pl-6 md:pl-0 pt-1 min-h-[2.5rem] flex items-center`}>
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold tracking-wider mb-2">
                      {job.period}
                    </span>
                  </div>

                  {/* Content Card Side */}
                  <div className="w-full md:w-1/2 relative group">
                    <div className="relative h-full rounded-2xl bg-card/60 backdrop-blur-xl border border-border p-1 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-background">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={1}
                      />
                      <div className="relative z-10 p-5 sm:p-6 md:p-8 rounded-xl bg-card/50 dark:bg-card/40 border border-border/50 h-full">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">{job.role}</h3>
                        <p className="text-primary font-medium text-base sm:text-lg mb-3 sm:mb-4 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          {job.company}
                          <span className="text-muted-foreground/40 text-sm">•</span>
                          <span className="text-muted-foreground text-sm font-normal">{job.location}</span>
                        </p>
                        <p className="text-muted-enhanced leading-relaxed text-pretty mb-4">
                          {job.description}
                        </p>
                        {job.highlights && job.highlights.length > 0 && (
                          <ul className="space-y-2">
                            {job.highlights.map((h, i) => (
                              <li key={i} className="text-sm text-muted-foreground/90 flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollRevealContainer>
              ))}
            </div>
          </div>
        </Section>


        <Section delay={0.6}>
          <SectionTitle icon={<FaGraduationCap />}>Education</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {education.map((edu, index) => (
              <CometCard key={index} className="w-full h-full">
                <div className="relative h-full w-full p-5 sm:p-6 md:p-8 bg-card/40 border border-border rounded-2xl backdrop-blur-md flex flex-col shadow-sm">

                  {/* Decoration Gradient */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[4rem] rounded-tr-2xl pointer-events-none" />

                  <div className="relative z-10 flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2 leading-tight text-balance">
                      {edu.degree}
                    </h3>
                    {edu.specialization && (
                      <p className="text-sm font-semibold text-primary/90 mb-4 uppercase tracking-wide">
                        {edu.specialization}
                      </p>
                    )}

                    <div className="space-y-1 mb-6">
                      <p className="text-md font-medium text-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.period}</p>
                    </div>

                    {edu.details && (
                      <div className="pt-4 border-t border-border/20">
                        <ul className="space-y-2">
                          {edu.details.map((detail, i) => (
                            <li key={i} className="text-sm text-muted-foreground/90 flex items-start gap-2 leading-relaxed">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CometCard>
            ))}
          </div>
        </Section>

        {/* Design Philosophy */}
        <Section>
          <div className="rounded-2xl border border-border bg-card/30 p-6 sm:p-8 md:p-10 backdrop-blur-sm border-l-4 border-l-primary/40">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">My Design Philosophy</h2>
            <p className="text-muted-foreground text-base mb-6 max-w-3xl leading-relaxed">
              Strategy and creativity together is what solves real problems and creates real impact.
            </p>
            <p className="text-foreground leading-relaxed text-lg max-w-3xl">
              {designPhilosophy}
            </p>
          </div>
        </Section>

        {/* CTA Section */}
        <Section>
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
              <FaCalendarAlt className="w-4 h-4" />
            </a>
          </div>
        </Section>

      </div>
    </InfiniteGridBackground>
  );
};

export default AboutPage;