'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CursorTrigger } from '@/components/CursorProvider';

// Lazy load CometCard - requires JS for mouse-tracking 3D tilt, loads after LCP
const CometCard = dynamic(
  () => import('@/components/ui/comet-card').then(mod => mod.CometCard),
  { ssr: false }
);

const CaseStudyList = ({ posts }) => {
  return (
    <div className="space-y-8">
      {posts.map(({ id, title, summary, publishedAt }, index) => (
        <div
          key={id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CometCard rotateDepth={8} translateDepth={10}>
            <div className="bg-card dark:bg-gradient-to-br dark:from-card/95 dark:via-card/90 dark:to-primary/5 border border-border/50 dark:border-primary/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 shadow-lg">
              <CursorTrigger type="view" text="View">
                <Link href={`/case-studies/${id}`} className="block">
                  <h2 className="font-bold text-foreground mb-3 hover:text-primary transition-colors duration-300">
                    {title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4 line-clamp-3">
                    {summary}
                  </p>
                  <time dateTime={publishedAt} className="text-sm text-muted-foreground/80 font-medium">
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </CursorTrigger>
            </div>
          </CometCard>
        </div>
      ))}
    </div>
  );
};

export default CaseStudyList;