'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaClipboardCheck, FaBrain, FaArrowRight } from 'react-icons/fa';

/**
 * FooterLeadMagnet - Persistent lead magnet section for footer
 * Displays both resources with links to dedicated pages
 */
export default function FooterLeadMagnet({ className = '' }) {
  const resources = [
    {
      id: 'design-checklist',
      icon: FaClipboardCheck,
      title: 'Design Checklist',
      description: 'Ship designs that developers love. 12 critical specs for perfect handoffs.',
      href: '/lab#design-checklist',
      cta: 'Get Free Checklist',
    },
    {
      id: 'ai-audit',
      icon: FaBrain,
      title: 'AI Readiness Audit',
      description: 'Is your UX ready for AI? Take the 2-minute assessment.',
      href: '/lab#ai-audit',
      cta: 'Start Free Audit',
    },
  ];

  return (
    <div className={`py-12 border-t border-border/30 ${className}`}>
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 text-center">
            Free Resources
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link
                  key={resource.id}
                  href={resource.href}
                  className="group card-base p-4 rounded-xl hover:bg-card/50 transition-all flex items-start gap-4"
                >
                  <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {resource.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      {resource.cta}
                      <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
