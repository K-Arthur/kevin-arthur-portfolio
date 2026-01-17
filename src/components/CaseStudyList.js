'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CursorTrigger } from '@/components/CursorProvider';
import { CometCard } from '@/components/ui/comet-card';

const CaseStudyList = ({ posts }) => {
  return (
    <div className="space-y-8">
      {posts.map(({ id, title, summary, publishedAt }, index) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <CometCard rotateDepth={8} translateDepth={10}>
            <div className="group bg-card/80 dark:bg-gradient-to-br dark:from-card/90 dark:via-card/70 dark:to-primary/5 border border-border/50 dark:border-primary/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:border-border/80 dark:hover:from-card dark:hover:via-card/80 dark:hover:to-primary/10 dark:hover:border-primary/20 shadow-sm hover:shadow-xl dark:shadow-primary/5 dark:hover:shadow-lg dark:hover:shadow-primary/15">
              <CursorTrigger type="view" text="View">
                <Link href={`/case-studies/${id}`} className="block">
                  <h2 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
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
        </motion.div>
      ))}
    </div>
  );
};

export default CaseStudyList;