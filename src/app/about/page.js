'use client';

import { personalInfo, skills, education, professionalExperience } from '@/data/portfolio-data';
import { FaBriefcase, FaGraduationCap, FaTools, FaUsers, FaVial, FaBrain, FaSyncAlt, FaBullhorn, FaPaintBrush, FaFigma, FaCode, FaVideo, FaDatabase } from 'react-icons/fa';

import { SiAdobecreativecloud, SiPhp } from 'react-icons/si';
import { BsDiagram3, BsWindow, BsGit } from 'react-icons/bs';

import { CometCard } from '@/components/ui/comet-card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import dynamic from 'next/dynamic';

// Dynamically import heavy components - defer loading


// Lazy load background - non-blocking
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then(mod => ({ default: mod.InfiniteGridBackground })),
  { ssr: false }
);

// Lazy load TextScramble - requires JS for character animation, loads after LCP
const TextScramble = dynamic(
  () => import('@/components/ui/text-scramble').then(mod => mod.TextScramble),
  { ssr: false, loading: () => <span>Design Engineer</span> }
);

const Section = ({ children }) => (
  <section className="animate-fade-in-up">
    {children}
  </section>
);

const SectionTitle = ({ icon, children }) => (
  <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
    <span className="text-primary">{icon}</span>
    {children}
  </h2>
);

import Image from 'next/image';

// Icon mapping for timeline data
// Simple icon mapping for display
const getSkillIcon = (skillName) => {
  const map = {
    'User-centered Design': FaUsers,
    'Wireframing & Prototyping': BsDiagram3,
    'User Research': FaUsers,
    'Usability Testing': FaVial,
    'Heuristic Evaluation': FaBrain,
    'Agile Methodology': FaSyncAlt,
    'Marketing & Branding': FaBullhorn,
    'Visual Design': FaPaintBrush,
    'Figma': FaFigma,
    'Adobe Suite': SiAdobecreativecloud,
    'HTML/CSS/JS': FaCode,
    'PHP': SiPhp,
    'Database Management': FaDatabase,
    'Version Control': BsGit,
    'Video Editing': FaVideo,
    'Cross-platform OS': BsWindow,
  };
  return map[skillName] || FaCode;
};

const SkillsSection = () => {
  return (
    <Section delay={0.2}>
      <SectionTitle icon={<FaTools />}>Skills & Tools</SectionTitle>

      <p className="text-muted-foreground mb-10 max-w-2xl leading-relaxed">
        A curated stack of technologies and methodologies I use to bring ideas to life.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Competencies */}
        <div className="card-enhanced p-8 bg-card/30 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <FaBrain className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Core Competencies</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills['Core Competencies'].map((skill, idx) => {
              const Icon = getSkillIcon(skill.name);
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-white/5 transition-all duration-300 hover:bg-background/60 hover:border-primary/20 hover:scale-[1.02] group">
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    <Icon />
                  </span>
                  <span className="text-sm font-medium text-foreground/90">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="card-enhanced p-8 bg-card/30 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-secondary/20 text-foreground">
              <FaCode className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Technical Skills</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills['Technical Skills'].map((skill, idx) => {
              const Icon = getSkillIcon(skill.name);
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-white/5 transition-all duration-300 hover:bg-background/60 hover:border-primary/20 hover:scale-[1.02] group">
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    <Icon />
                  </span>
                  <span className="text-sm font-medium text-foreground/90">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};

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
      <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-2 space-y-8">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                  <TextScramble
                    as="span"
                    className="text-foreground"
                    duration={1.0}
                    speed={0.035}
                    characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                  >
                    Design Engineer &
                  </TextScramble>
                  <TextScramble
                    as="span"
                    className="block text-primary mt-2"
                    duration={1.2}
                    speed={0.035}
                    characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                  >
                    Creative Technologist
                  </TextScramble>
                </h1>
                <div className="space-y-6 text-lg leading-relaxed text-muted-enhanced">
                  <p className="text-xl leading-relaxed">
                    {personalInfo.summary}
                  </p>
                  <p className="text-lg leading-relaxed border-l-4 border-primary/30 pl-6 bg-card/20 py-4 rounded-r-xl">
                    I believe great design happens when strategy meets creativity. Every project I take on
                    is an opportunity to solve real problems and create meaningful impact through thoughtful,
                    user-centered design.
                  </p>
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

        {/* What Sets Me Apart Section */}
        <Section delay={0.1}>
          <div className="rounded-2xl border border-border/20 bg-card/20 p-8 backdrop-blur-sm transition-colors duration-300">
            <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
              How I Approach My Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🎯', title: 'Strategic Thinking', text: "I don't just design pixels. I align every decision with user needs and business goals to create solutions that deliver real, measurable impact." },
                { icon: '⚡', title: 'Speed & Efficiency', text: 'Leveraging lean design principles and rapid prototyping, I accelerate the journey from concept to launch without compromising quality.' },
                { icon: '🔄', title: 'Continuous Learning', text: "The digital landscape is always evolving, and so am I. I'm committed to mastering new tools and technologies to keep your product ahead of the curve." },
                { icon: '🤝', title: 'Radical Collaboration', text: "The best ideas emerge when we work together. I foster a collaborative environment where every voice is heard to build solutions that truly resonate." },
              ].map((item, index) => (
                <CometCard key={index} className="w-full h-full">
                  <div className="h-full flex flex-col items-center text-center p-6 bg-card/40 border border-white/5 rounded-2xl backdrop-blur-sm">
                    <div className="mb-4 text-4xl">{item.icon}</div>
                    <p className="text-lg font-bold text-foreground mb-3">{item.title}</p>
                    <p className="text-muted-enhanced text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </CometCard>
              ))}
            </div>
          </div>
        </Section>

        <SkillsSection />

        <Section delay={0.4}>
          <SectionTitle icon={<FaBriefcase />}>My Journey So Far</SectionTitle>
          <div className="relative pl-8 md:pl-0">
            {/* Timeline Line - Refined positioning */}
            <div className="absolute left-[3px] md:left-1/2 top-4 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:-translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-16 relative">
              {professionalExperience.map((job, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                  {/* Timeline Dot */}
                  <div className="absolute left-[-29px] md:left-1/2 top-0 w-16 h-16 flex items-center justify-center md:-translate-x-1/2 z-10 pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] z-20 relative"></div>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                  </div>

                  {/* Date/Label Side */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} pl-6 md:pl-0 pt-1`}>
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold tracking-wider mb-2">
                      {job.period}
                    </span>
                  </div>

                  {/* Content Card Side */}
                  <div className="w-full md:w-1/2 relative group">
                    <div className="relative h-full rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 p-1 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={1}
                      />
                      <div className="relative z-10 p-6 md:p-8 rounded-xl bg-background/40 h-full">
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{job.role}</h3>
                        <p className="text-primary font-medium text-lg mb-4 flex items-center gap-2">
                          {job.company}
                          <span className="text-muted-foreground/40 text-sm">•</span>
                          <span className="text-muted-foreground text-sm font-normal">{job.location}</span>
                        </p>
                        <p className="text-muted-enhanced leading-relaxed text-pretty">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>


        <Section delay={0.6}>
          <SectionTitle icon={<FaGraduationCap />}>Education</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {education.map((edu, index) => (
              <CometCard key={index} className="w-full h-full">
                <div className="relative h-full w-full p-6 md:p-8 bg-card/40 border border-white/5 rounded-2xl backdrop-blur-md flex flex-col shadow-sm">

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

      </div>
    </InfiniteGridBackground>
  );
};

export default AboutPage;