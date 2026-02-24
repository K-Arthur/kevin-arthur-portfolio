import { getCaseStudyData, getAllCaseStudyIds } from '@/lib/case-studies';
import { notFound } from 'next/navigation';
import { CloudinaryImage } from '@/components/OptimizedImage';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MdxComponents';
import { FaCalendarAlt, FaUserTie, FaTools, FaChartLine, FaArrowLeft, FaRocket, FaFlask } from 'react-icons/fa';
import Link from 'next/link';
import contentStyles from './CaseStudyContent.module.css';
import { getCaseStudySchema } from '@/lib/structured-data';
import dynamic from 'next/dynamic';
import {
  DottedGlowBackgroundWrapper,
  CaseStudyLightboxWrapper,
  ReadingProgressWrapper,
} from './ClientComponentsWrapper';

// Dynamically import heavy visual components to reduce initial JS parsing
const Parallax = dynamic(() => import('@/components/Parallax'), { ssr: true });
const ContextualCTA = dynamic(() => import('@/components/ContextualCTA'), { ssr: true });

// This function gets called at build time
export async function generateStaticParams() {
  const paths = getAllCaseStudyIds();
  // Ensure paths are properly formatted for Next.js 15+
  return paths.map(path => ({
    id: path.id,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const postData = await getCaseStudyData(id);
  return {
    title: postData.title,
    description: postData.metaDescription || postData.summary,
    alternates: {
      canonical: `/case-studies/${id}`,
    },
    openGraph: {
      title: postData.title,
      description: postData.metaDescription || postData.summary,
      type: 'article',
      images: postData.heroImage ? [{ url: postData.heroImage, alt: postData.heroImageAlt || postData.title }] : [],
    },
  };
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function CaseStudyPage({ params }) {
  const { id } = await params;
  const postData = await getCaseStudyData(id);

  if (!postData) {
    notFound();
  }

  const caseStudySchema = getCaseStudySchema(postData);
  const isConcept = postData.status === 'concept';

  return (
    <>
      {/* JSON-LD Structured Data for Case Study */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      {/* Global Lightbox for clickable images */}
      <CaseStudyLightboxWrapper />
      {/* Reading Progress Indicator */}
      <ReadingProgressWrapper />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
        {/* Hero Section */}
        <header className="relative bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50 overflow-hidden pt-12 md:pt-0">
          {/* Breadcrumb Navigation */}
          <Link
            href="/case-studies"
            className="absolute top-6 left-4 md:left-8 z-30 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Case Studies</span>
          </Link>

          {/* Dotted Glow Background Effect - WCAG Compliant: Visible but subtle */}
          <DottedGlowBackgroundWrapper
            className="pointer-events-none"
            style={{
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 100%)",
            }}
            opacity={0.12}
            gap={24}
            radius={1.2}
            color="hsl(220, 15%, 55%)"
            darkColor="hsl(240, 10%, 40%)"
            glowColor="hsl(220, 70%, 75%)"
            darkGlowColor="hsl(217, 80%, 55%)"
            backgroundOpacity={0}
            speedMin={0.2}
            speedMax={0.6}
            speedScale={0.4}
          />
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-2/3 text-left">
                <Parallax offset={-20}>
                  {/* Status Badge */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-medium mb-4 animate-fade-in-down"
                    style={{ animationDelay: '0.2s' }}
                  >
                    {isConcept ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full">
                        <FaFlask className="w-3.5 h-3.5" />
                        Concept Project
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                        <FaRocket className="w-3.5 h-3.5" />
                        Shipped Product
                      </span>
                    )}
                    {postData.industry && (
                      <span className="px-3 py-1.5 bg-primary/15 text-primary font-semibold border border-primary/25 rounded-full capitalize">
                        {postData.industry}
                      </span>
                    )}
                  </div>

                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground leading-[1.2] pb-1 animate-fade-in-down"
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    {postData.title}
                  </h1>
                  <p
                    className="text-lg md:text-xl text-foreground/85 leading-relaxed mb-8 max-w-3xl mx-auto md:mx-0 animate-fade-in-down"
                    style={{ animationDelay: '0.4s' }}
                  >
                    {postData.summary}
                  </p>

                  <div
                    className="flex flex-wrap justify-start gap-x-6 gap-y-4 text-sm text-foreground/75 animate-fade-in-up"
                    style={{ animationDelay: '0.6s' }}
                  >
                    {postData.role && (
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-primary" />
                        <span className="font-medium text-foreground">{postData.role}</span>
                      </div>
                    )}
                    {postData.duration && (
                      <div className="flex items-center gap-2">
                        <FaChartLine className="text-primary" />
                        <span>{postData.duration}</span>
                      </div>
                    )}
                    {postData.tools?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FaTools className="text-primary" />
                        <span>{postData.tools.slice(0, 3).join(' • ')}{postData.tools.length > 3 && ' • ...'}</span>
                      </div>
                    )}
                  </div>
                </Parallax>
              </div>

              {postData.heroImage && (
                <div className="w-full md:w-1/3 mt-8 md:mt-0 animate-fade-in-right">
                  <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <CloudinaryImage
                      src={postData.heroImage}
                      alt={postData.heroImageAlt || `${postData.title} case study preview`}
                      width={600}
                      height={400}
                      preset="thumbnail"
                      className="w-full h-auto rounded-xl object-cover"
                      priority
                      sizes="(max-width: 767px) 100vw, 340px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <article className={contentStyles.caseStudyContent}>
            <MDXRemote
              source={postData.content}
              components={mdxComponents}
              options={{
                parseFrontmatter: true,
                // Enable JS expressions for trusted content (required for v6+)
                blockJS: false,
              }}
            />
          </article>

          {/* Contextual CTA based on case study industry */}
          <ContextualCTA
            industry={postData.industry || 'general'}
            schedulingUrl="https://calendly.com/arthurkevin27/15min"
          />

          {/* Back to Case Studies Link */}
          <div className="mt-20 pt-10 border-t border-border/50 text-center">
            <a
              href="/case-studies"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back To Case Studies
            </a>
          </div>
        </main>
      </div>
    </>
  );
}