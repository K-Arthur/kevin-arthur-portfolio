'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const MILESTONES = [
  {
    date: 'Jun 27, 2026',
    label: 'First commit',
    shortLabel: 'Start',
    color: 'bg-blue-500',
    summary: 'Project begins as "Strata" — a monorepo skeleton with CI matrix and an IR-replay rendering spike.',
    detail: 'The first day established the foundational architecture: native Rust engine rendering to a Tauri webview via scene-IR replay. ADR-0001 recorded that IR-replay was 10× faster than pixel-push (86.4 fps vs 8.5 fps at 960×600). This decision has held through every subsequent evolution of the product.',
    lesson: 'Validating the hardest technical assumption on day one prevented months of wrong-path work.',
  },
  {
    date: 'Jul 2026',
    label: 'Feature development',
    shortLabel: 'Build',
    color: 'bg-violet-500',
    summary: 'Sessions 2–15 rapidly built the core editing experience: canvas, layers, inspector, tools, export, shortcuts.',
    detail: 'The vertical slice — a working document wired into the editor shell with canvas replay, real layers, and an inspector — landed in the first week. From there, each session added a capability: keyboard navigation, the tools system, the home surface, workspace modes. The commit messages reference "Session N" as development milestones, each one a working state the application could be used from.',
    lesson: 'Getting to a usable vertical slice fast made every subsequent decision grounded in reality rather than speculation.',
  },
  {
    date: 'Aug 4, 2026',
    label: 'Renamed to Varve',
    shortLabel: 'Rename',
    color: 'bg-amber-500',
    summary: 'The project is comprehensively renamed from "Strata" to "Varve" across the entire codebase.',
    detail: 'The rename was not cosmetic. It required updating internal identifiers, environment variables, window globals, legal documents, documentation, and the marketing website. Ten files still reference "Strata" in the repository — legacy fixtures, agent configs, and trademark docs that serve as archaeological traces of the original name.',
    lesson: 'Naming a project before you understand what it is means renaming it later. The cost is real but bounded.',
  },
  {
    date: 'Aug 9, 2026',
    label: 'v0.1.0 — first release',
    shortLabel: 'Release',
    color: 'bg-red-500',
    summary: 'The first public release ships broken. The release workflow could never publish, and the application never reaches its UI.',
    detail: 'Two critical bugs: the GitHub Actions workflow referenced a non-existent `dist/aur` directory, so it could never actually publish artifacts. Separately, a static import of an `eval`-using module in the entry chunk broke the WebView entirely — the application displayed a white screen. The release was tagged, the artifacts were built, but nothing worked.',
    lesson: 'Shipping a broken first release taught me that release engineering is not a final-pass activity — it requires the same rigor as the product itself.',
  },
  {
    date: 'Aug 11, 2026',
    label: 'v0.1.1 — firefighting',
    shortLabel: 'Fix',
    color: 'bg-orange-500',
    summary: 'The second release fixes the pipeline and the white screen, but exposes a deeper platform problem.',
    detail: 'The AppImage worked on some machines but showed a white screen on modern Mesa/EGL hosts. Root cause: the bundled WebKit/GTK was compiled against Ubuntu 22.04 and was incompatible with newer graphics stacks. The fix required rebuilding the bundled browser from a compatible base. Release pipeline hardening — LFS guards, frontend build ordering, per-platform SBOMs — took almost as long as the bug fixes.',
    lesson: 'Cross-platform means "works on the platforms you actually test on," not "compiles for them."',
  },
  {
    date: 'Aug 16, 2026',
    label: 'v0.1.2 — reliability',
    shortLabel: 'Stabilize',
    color: 'bg-emerald-500',
    summary: 'A reliability pass: settings fixes, content-aware fill, browser sync, and hardened CI.',
    detail: 'This release focused on resilience rather than features. GitHub Actions got workflow validation, concurrency controls, and cache diagnostics. The website corrected its base path. The pattern emerged: each release revealed infrastructure weaknesses that the next release had to address before new features could ship safely.',
    lesson: 'Reliability work is invisible until it is absent. The absence is always noticed.',
  },
  {
    date: 'Aug 20, 2026',
    label: 'v0.2.0 — major release',
    shortLabel: 'Scale',
    color: 'bg-cyan-500',
    summary: 'Ten-plus major features land in a single release: Figma import, AI features, paint tools, motion improvements, email workspace.',
    detail: 'This release included Figma REST JSON import, on-device image enhancement (Real-ESRGAN), object selection (SAM2), depth-aware effects, natural-language asset search, a complete paint system, gradient map adjustments, Lottie export, timeline virtualization, and a browser demo. The Windows installer shrank ~75%. Eight engine crates were opened under MIT OR Apache-2.0 for ecosystem reuse.',
    lesson: 'Scope expansion after stabilization is possible — but only if the infrastructure can absorb it.',
  },
  {
    date: 'Aug 23, 2026',
    label: 'v0.2.1 prepared',
    shortLabel: 'Now',
    color: 'bg-pink-500',
    summary: 'Batch image enhancement, canonical export, variable font fixes, and the deterministic screenshot pipeline.',
    detail: 'The latest prepared release adds batch image enhancement, a canonical export resolution model, variable font axis fixes, and a verified workflow recording pipeline. Git LFS was removed after exhausting its 1.12 GB bandwidth budget — a constraint that forced rethink of asset storage strategy.',
    lesson: 'External constraints (budgets, bandwidth, platform limits) are design inputs, not just engineering annoyances.',
  },
];

export default function ProjectTimeline() {
  const [selected, setSelected] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Project evolution timeline" className="my-12">
      <h2 className="text-xl font-bold mb-6 text-foreground">Project Evolution</h2>
      
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
        
        <div className="space-y-1">
          {MILESTONES.map((milestone, i) => {
            const isActive = selected === i;
            return (
              <div key={i} className="relative">
                {/* Dot */}
                <div className="absolute left-4 md:left-6 top-3 -translate-x-1/2 z-10" aria-hidden="true">
                  <div className={`w-3 h-3 rounded-full ${milestone.color} ${isActive ? 'ring-2 ring-offset-2 ring-offset-background ring-current scale-125' : ''} transition-all`} />
                </div>
                
                {/* Content */}
                <button
                  onClick={() => setSelected(isActive ? null : i)}
                  className="w-full text-left pl-10 md:pl-14 py-3 group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                  aria-expanded={isActive}
                  aria-controls={`timeline-detail-${i}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{milestone.date}</span>
                    <span className={`font-semibold text-sm ${isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'} transition-colors`}>
                      {milestone.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{milestone.summary}</p>
                </button>
                
                {/* Detail panel */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      id={`timeline-detail-${i}`}
                      role="region"
                      aria-label={`Details for ${milestone.label}`}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-10 md:ml-14 mb-4 p-4 rounded-lg bg-secondary/50 border border-border/50">
                        <p className="text-sm text-foreground/90 leading-relaxed mb-3">{milestone.detail}</p>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold text-primary whitespace-nowrap">Lesson:</span>
                          <span className="text-foreground/80">{milestone.lesson}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
