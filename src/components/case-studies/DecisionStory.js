'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export default function DecisionStory({
  title,
  constraint,
  options = [],
  choice,
  why,
  tradeoff,
  lesson,
}) {
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="my-8 rounded-xl border border-border/50 overflow-hidden bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-3 group hover:bg-secondary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        aria-expanded={expanded}
      >
        <span className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold transition-colors mt-0.5 ${expanded ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-primary'}`} aria-hidden="true">
          {expanded ? '−' : '+'}
        </span>
        <span className={`font-semibold text-base transition-colors ${expanded ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
          {title}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-15 space-y-4 text-sm">
              <div>
                <span className="font-semibold text-foreground block mb-1">Constraint</span>
                <p className="text-foreground/80 leading-relaxed">{constraint}</p>
              </div>

              {options.length > 0 && (
                <div>
                  <span className="font-semibold text-foreground block mb-1">Options Considered</span>
                  <ul className="space-y-1 mt-1">
                    {options.map((opt, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground/80">
                        <span className="text-muted-foreground mt-0.5" aria-hidden="true">•</span>
                        <span className="leading-relaxed">{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 rounded-md bg-secondary/50 border border-border/50">
                <span className="font-semibold text-foreground block mb-1">Choice</span>
                <p className="text-foreground/90 leading-relaxed">{choice}</p>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Why</span>
                <p className="text-foreground/80 leading-relaxed">{why}</p>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Tradeoff</span>
                <p className="text-foreground/80 leading-relaxed">{tradeoff}</p>
              </div>

              <div className="p-3 rounded-md bg-primary/5 border border-primary/15">
                <span className="font-semibold text-primary block mb-1">Lesson</span>
                <p className="text-foreground/90 leading-relaxed">{lesson}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
