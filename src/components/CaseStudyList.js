'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const CaseStudyList = ({ posts }) => {
  return (
    <div className="space-y-8">
      {posts.map(({ id, title, summary, publishedAt }, index) => (
        <motion.div
          key={id}
          className="group bg-card/80 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:border-border hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          whileHover={{ scale: 1.01 }}
        >
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
        </motion.div>
      ))}
    </div>
  );
};

export default CaseStudyList;