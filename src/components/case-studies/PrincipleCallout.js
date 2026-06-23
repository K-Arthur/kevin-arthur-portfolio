import React from 'react';
import { FaBolt } from '@/lib/icons';

/**
 * PrincipleCallout - A pull-quote style callout for architectural principles,
 * design tenets, or key engineering insights inside a case study.
 *
 * Mirrors the visual language of CaseStudySummary / ResultsHighlight
 * (primary-token gradient, rounded card, accent icon) so callouts feel native
 * to the case-study layout while standing out from body copy and ordinary
 * Markdown blockquotes.
 *
 * @param {Object} props
 * @param {string} [props.title="Architectural Principle"] - Eyebrow label above the statement.
 * @param {React.ReactNode} props.children - The principle statement (Markdown is supported).
 */
const PrincipleCallout = ({ title = 'Architectural Principle', children }) => {
  return (
    <aside
      className="my-8 relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-7 shadow-sm"
      aria-label={title}
    >
      {/* Decorative oversized quote glyph */}
      <span
        className="pointer-events-none select-none absolute -top-8 -right-3 text-[7rem] leading-none font-serif text-primary/10"
        aria-hidden="true"
      >
        &rdquo;
      </span>

      <div className="relative flex items-start gap-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FaBolt className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
            {title}
          </div>
          <div className="text-base md:text-lg font-medium leading-relaxed text-foreground/90 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-primary">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PrincipleCallout;
