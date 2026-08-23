'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const FAILURES = [
  {
    symptom: 'v0.1.0 release workflow could never publish artifacts',
    rootCause: 'GitHub Actions workflow referenced a non-existent `dist/aur` directory path.',
    assumption: 'Release infrastructure would work if the build worked.',
    fix: 'Fixed the workflow path, added preflight validation that checks directory existence before build steps.',
    lesson: 'Release engineering needs its own test suite. A build that succeeds locally can fail silently in CI.',
  },
  {
    symptom: 'Application showed a white screen on every platform',
    rootCause: 'A static import of a module using `eval()` was included in the entry chunk, breaking the WebView entirely.',
    assumption: 'Module bundling would isolate eval-using code from the WebView entry point.',
    fix: 'Moved the eval-dependent module to a dynamic import, added a CI guard against eval in entry chunks.',
    lesson: 'Bundling assumptions are platform assumptions. What works in a browser may break in a WebView with different security policies.',
  },
  {
    symptom: 'AppImage white screen on modern Linux hosts',
    rootCause: 'Bundled WebKit/GTK was compiled against Ubuntu 22.04 and incompatible with newer Mesa/EGL graphics stacks.',
    assumption: 'Bundling a WebKit would provide consistent rendering across Linux distributions.',
    fix: 'Rebuilt the bundled browser from a compatible base, added container-based smoke tests for AppImage on multiple distros.',
    lesson: 'Cross-platform support is not achieved when something compiles — it is achieved when important workflows behave consistently under different system constraints.',
  },
  {
    symptom: 'Git history rewrite dropped active work',
    rootCause: 'A history rewrite (likely a rebase or squash) silently dropped commits containing capture pipeline and typography fixes.',
    assumption: 'History rewrites on a solo project were low-risk.',
    fix: 'Restored the dropped commits explicitly, added a commit restoring the lost work with a message documenting the corruption.',
    lesson: 'History rewrites have a blast radius even in solo projects. Active worktrees and uncommitted changes are especially vulnerable.',
  },
  {
    symptom: 'Git LFS bandwidth exhausted at 1.12 GB',
    rootCause: 'Large binary assets (screenshots,模型, build artifacts) consumed the LFS bandwidth budget faster than anticipated.',
    assumption: 'Git LFS would handle binary assets within the free-tier budget.',
    fix: 'Removed Git LFS entirely, moved large assets to alternative storage, documented the constraint for future reference.',
    lesson: 'External budgets (bandwidth, storage, API limits) are design constraints. Plan for them before they force a mid-project architectural change.',
  },
  {
    symptom: 'Feature breadth created UX inconsistency across disciplines',
    rootCause: 'Each discipline (vector, layout, typography, motion, print) was built in sequence, and earlier disciplines received less refinement as new ones were added.',
    assumption: 'A unified document model would naturally produce a unified user experience.',
    fix: 'Ongoing — the workspace mode system helps, but depth-versus-breadth remains the central product tension.',
    lesson: 'Feature breadth compounds state complexity faster than it compounds visible functionality. Every new discipline touches every existing one.',
  },
];

export default function FailureExplorer() {
  const [selected, setSelected] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Things that did not work" className="my-12">
      <h3 className="text-xl font-bold mb-2 text-foreground">Things That Did Not Work</h3>
      <p className="text-sm text-muted-foreground mb-6">Each failure changed a product or engineering assumption. Click to explore.</p>
      
      <div className="space-y-3">
        {FAILURES.map((failure, i) => {
          const isActive = selected === i;
          return (
            <div key={i} className="rounded-lg border border-border/50 overflow-hidden">
              <button
                onClick={() => setSelected(isActive ? null : i)}
                className="w-full text-left p-4 flex items-start gap-3 group hover:bg-secondary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
                aria-expanded={isActive}
                aria-controls={`failure-detail-${i}`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-destructive text-destructive-foreground' : 'bg-destructive/15 text-destructive'} transition-colors mt-0.5`} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'} transition-colors leading-snug`}>
                  {failure.symptom}
                </span>
              </button>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    id={`failure-detail-${i}`}
                    role="region"
                    aria-label={`Failure analysis: ${failure.symptom}`}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-13 space-y-3">
                      <div className="grid gap-3 text-sm">
                        <div>
                          <span className="font-semibold text-foreground block mb-1">Root Cause</span>
                          <p className="text-foreground/80 leading-relaxed">{failure.rootCause}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block mb-1">Incorrect Assumption</span>
                          <p className="text-foreground/80 leading-relaxed italic">&ldquo;{failure.assumption}&rdquo;</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block mb-1">What Changed</span>
                          <p className="text-foreground/80 leading-relaxed">{failure.fix}</p>
                        </div>
                        <div className="p-3 rounded-md bg-primary/5 border border-primary/15">
                          <span className="font-semibold text-primary block mb-1">Lesson</span>
                          <p className="text-foreground/90 leading-relaxed">{failure.lesson}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
