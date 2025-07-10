import { getCaseStudyData, getAllCaseStudyIds } from '@/lib/case-studies';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MdxComponents';
import { FaCalendarAlt, FaUserTie, FaTools, FaChartLine } from 'react-icons/fa';
import contentStyles from './CaseStudyContent.module.css';

// This function gets called at build time
export async function generateStaticParams() {
  const paths = getAllCaseStudyIds();
  return paths;
}

export async function generateMetadata({ params }) {
  const postData = await getCaseStudyData(params.id);
  return {
    title: `${postData.title} - Kevin Arthur`,
    description: postData.summary,
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
  const postData = await getCaseStudyData(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-2/3 text-center md:text-left">
              <div 
                className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 animate-fade-in-down"
                style={{ animationDelay: '0.2s' }}
              >
                <span>Case Study</span>
              </div>
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 leading-tight animate-fade-in-down"
              >
                {postData.title}
              </h1>
              <p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto md:mx-0 animate-fade-in-down"
                style={{ animationDelay: '0.4s' }}
              >
                {postData.summary}
              </p>
              
              <div 
                className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-4 text-sm text-muted-foreground animate-fade-in-up"
                style={{ animationDelay: '0.6s' }}
              >
                {postData.publishedAt && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    <span>Published {formatDate(postData.publishedAt)}</span>
                  </div>
                )}
                {postData.role && (
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-primary" />
                    <span>{postData.role}</span>
                  </div>
                )}
                {postData.tools?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FaTools className="text-primary" />
                    <span>{postData.tools.join(' • ')}</span>
                  </div>
                )}
                {postData.duration && (
                  <div className="flex items-center gap-2">
                    <FaChartLine className="text-primary" />
                    <span>{postData.duration}</span>
                  </div>
                )}
              </div>
            </div>
            
            {postData.heroImage && (
              <div className="w-full md:w-1/3 mt-8 md:mt-0 animate-fade-in-right">
                <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src={postData.heroImage} 
                    alt={`${postData.title} Preview`} 
                    className="w-full h-auto rounded-xl"
                    loading="lazy"
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
          <MDXRemote source={postData.content} components={mdxComponents} />
        </article>

        {/* Back to Case Studies Link */}
        <div className="mt-20 pt-10 border-t border-border/50 text-center">
          <a 
            href="/case-studies"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
  );
}