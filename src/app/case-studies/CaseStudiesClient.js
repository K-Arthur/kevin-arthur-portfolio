'use client';

import { FaRocket } from '@/lib/icons';
import CaseStudyList from '@/components/CaseStudyList';

export default function CaseStudiesClient({ posts }) {
  const shippedPosts = posts.filter(post => post.status === 'shipped' || !post.status);
  const conceptPosts = posts.filter(post => post.status === 'concept');

  return (
    <>
      <div className="mb-12 md:mb-16">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <FaRocket className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground uppercase tracking-wider">
            Shipped Products
          </h2>
          <div className="flex-1 h-px bg-border/50" />
        </div>
        <CaseStudyList posts={shippedPosts} />
      </div>

      {conceptPosts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="text-amber-500 text-base sm:text-lg">⚗️</span>
            <h2 className="text-base sm:text-lg font-semibold text-foreground uppercase tracking-wider">
              Experiments & Concepts
            </h2>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <CaseStudyList posts={conceptPosts} />
        </div>
      )}
    </>
  );
}
