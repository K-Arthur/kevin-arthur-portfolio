import Link from 'next/link';
import Image from 'next/image';
import {
  personalInfo,
  education,
  professionalExperience,
  expertiseAreas,
  designPhilosophy,
} from '@/data/portfolio-data';
import { FaBriefcase, FaGraduationCap, FaArrowRight, FaBrain, FaEnvelope } from 'react-icons/fa';
import RecognitionSection from '@/components/RecognitionSection';
import PageBackdrop from '@/components/PageBackdrop';

export const dynamic = 'force-static';

function Section({ children, reveal = true }) {
  return (
    <section className={reveal ? 'animate-fade-in-up' : undefined} style={{ contain: 'layout' }}>
      {children}
    </section>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
      <span className="text-primary shrink-0">{icon}</span>
      <span className="min-w-0">{children}</span>
    </h2>
  );
}

export default function AboutPage() {
  const featuredJobs = professionalExperience.filter((job) => !job.compact);
  const internship = professionalExperience.find((job) => job.compact);

  return (
    <div className="relative min-h-screen">
      <PageBackdrop />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        <Section reveal={false}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16 items-center">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div>
                <p className="text-xs sm:text-sm font-medium tracking-wide text-muted-enhanced mb-4">
                  Design Engineer · Product Designer · Frontend (React, TypeScript, Next.js)
                </p>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                  {personalInfo.heroTitle1}
                  <span className="block text-primary mt-2">{personalInfo.heroTitle2}</span>
                </h1>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed text-muted-enhanced">
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
            <div className="w-full">
              <div className="relative w-full h-96 md:h-[30rem] lg:h-96 md:max-w-sm lg:max-w-none md:mx-auto lg:mx-0">
                <div className="relative card-enhanced h-full w-full bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 p-2 shadow-xl rounded-3xl">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src="/images/profile-image.jpg"
                      alt="Kevin Arthur, Design Engineer and Product Designer based in Vancouver, Canada"
                      fill
                      className="object-cover object-top lg:object-center"
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

        <RecognitionSection />

        <Section>
          <SectionTitle icon={<FaBrain />}>Expertise Areas</SectionTitle>
          <p className="text-muted-foreground mb-6 sm:mb-10 max-w-2xl leading-relaxed text-sm sm:text-base">
            Design engineering first, then the product-design work that feeds it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="h-full min-h-0 p-6 md:p-8 bg-card/40 border border-border rounded-2xl backdrop-blur-sm flex flex-col">
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
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle icon={<FaBriefcase />}>Career Highlights</SectionTitle>
          <div className="space-y-6">
            {featuredJobs.map((job, index) => (
              <article
                key={`${job.company}-${job.role}-${index}`}
                className="rounded-2xl bg-card/60 backdrop-blur-xl border border-border p-5 sm:p-6 md:p-8"
              >
                <p className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold tracking-wider mb-3">
                  {job.period}
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">{job.role}</h3>
                <p className="text-primary font-medium text-base sm:text-lg mb-3 sm:mb-4">
                  {job.company}
                  <span className="text-muted-foreground/40 text-sm"> · </span>
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
              </article>
            ))}
            {internship && (
              <p className="text-sm text-muted-foreground px-1">
                {internship.role}, {internship.company} ({internship.period})
              </p>
            )}
          </div>
        </Section>

        <Section>
          <div className="rounded-2xl border border-border bg-card/30 p-6 sm:p-8 md:p-10 backdrop-blur-sm border-l-4 border-l-primary/40">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">How I work</h2>
            <p className="text-foreground leading-relaxed text-lg max-w-3xl">
              {designPhilosophy}
            </p>
          </div>
        </Section>

        <Section>
          <SectionTitle icon={<FaGraduationCap />}>Education</SectionTitle>
          <p className="text-base sm:text-lg text-foreground leading-relaxed">
            {education[0]?.degree}. {education[1]?.degree}, {education[1]?.institution} ({education[1]?.period}).
          </p>
        </Section>

        <Section>
          <div className="text-center py-10 sm:py-16 card-enhanced rounded-2xl bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Get in touch</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
              Open to design engineer and frontend roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[44px] px-6 sm:px-8 py-3.5 sm:py-4 btn-primary-enhanced btn-glow font-semibold rounded-xl text-base sm:text-lg transition-all shadow-xl hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>Get in touch</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[44px] px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-xl text-base sm:text-lg transition-all border-2 border-primary/20 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Send an email</span>
                <FaEnvelope className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
