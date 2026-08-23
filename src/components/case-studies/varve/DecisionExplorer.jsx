'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const DECISIONS = [
  {
    title: 'Single scene graph for six disciplines',
    constraint: 'Creative work crosses disciplines constantly, but each tool typically has its own document model, coordinate system, and undo history.',
    options: [
      'Build six separate models with import/export bridges',
      'Build one scene graph where all disciplines are node types',
      'Build a core model with discipline-specific extensions',
    ],
    choice: 'One scene graph where vector paths, text frames, layout containers, keyframes, and print pages are all node types in the same hierarchy.',
    why: 'Import bridges lose design intent. Extensions create implicit coupling. A single model means a vector illustration inside a layout frame is the same object — not a copy, not an import, not a flattened proxy.',
    tradeoff: 'The model must be broad enough to hold all six disciplines, which means every new capability touches every existing one. Adding motion keyframes required rethinking how the undo history works for the entire document.',
    lesson: 'The document model is the product opinion. If the model only understands rectangles, it cannot hold a layout. If it only understands frames, it cannot hold an illustration.',
  },
  {
    title: 'IR-replay over pixel-push',
    constraint: 'A native Rust GPU surface cannot live inside a webview DOM. The engine and the display are in different runtime contexts.',
    options: [
      'Push pixels from Rust to the webview (slow, high bandwidth)',
      'Run the entire engine in WASM inside the webview (memory-capped at 2-4 GB)',
      'Emit a compact render-command IR from Rust and replay it in the webview',
    ],
    choice: 'IR-replay: the Rust engine computes the scene and emits a flat draw list (~42 KB/frame). The webview replays it onto Canvas2D or WebGPU.',
    why: 'IR-replay is 10× faster than pixel-push (86.4 fps vs 8.5 fps at 960×600) and 55× smaller per payload. It keeps the engine unbounded by browser memory limits while giving the webview display control.',
    tradeoff: 'The renderer never touches the scene graph — it receives a flat draw list. This makes rendering deterministic and testable, but it means the webview cannot make scene-level decisions during rendering.',
    lesson: 'The boundary between native and webview is an architecture decision that determines what the product can be. Optimizing the wrong boundary wastes months.',
  },
  {
    title: 'Canvas2D as primary renderer',
    constraint: 'WebGPU is not available on WebKitGTK (Linux), and Linux is the primary development platform.',
    options: [
      'Ship only with WebGPU (blocks Linux)',
      'Ship only with Canvas2D (limits future GPU capabilities)',
      'Ship with Canvas2D as primary, WebGPU as opt-in for supported platforms',
    ],
    choice: 'Canvas2D as the production path, WebGPU as an opt-in path for macOS and Windows. The system builds a structural render plan: WebGPU runs what it can handle, Canvas2D fills the gaps.',
    why: 'Canvas2D works everywhere, including WebKitGTK on Linux. The pluggable compositor means the product ships today while GPU support grows organically.',
    tradeoff: 'Canvas2D has inherent limits for complex effects and large documents. The WebGPU path is growing but not complete. Some effects are slower than they would be on a fully GPU-accelerated pipeline.',
    lesson: 'Shipping today on all platforms with a capable renderer beats shipping eventually on some platforms with a perfect one.',
  },
  {
    title: 'Local-first persistence',
    constraint: 'Creative professionals need offline access, file ownership, and predictable performance. Cloud-dependent tools fail when the network fails.',
    options: [
      'Cloud-first with offline caching (Figma model)',
      'Local-first with optional cloud sync',
      'Local-only with export for sharing',
    ],
    choice: 'Local-first. Files are stored as `.varve` files on disk. No cloud account, no subscription, no server dependency. Collaboration is scaffolded (Yjs CRDTs) but not yet shipped.',
    why: 'Local-first means your work is available offline, your files are yours, performance is predictable (no network round-trips for every edit), and privacy is structural (no data leaves the machine unless you export it).',
    tradeoff: 'Real-time collaboration — the most common feature request — is not available yet. Local-first changes product assumptions around ownership, recovery, sync, and failure in ways that cloud-first does not.',
    lesson: 'Local-first is not merely a storage strategy. It changes product assumptions around ownership, recovery, sync, privacy, and failure.',
  },
  {
    title: 'Monorepo with workspace-based validation',
    constraint: '33 packages and crates need coordinated testing, but running the full suite on every commit is too slow for rapid iteration.',
    options: [
      'Run all tests on every commit (slow feedback)',
      'Run only tests for changed packages (misses downstream effects)',
      'Run impact-aware validation that selects tests by dependency analysis',
    ],
    choice: 'Impact-aware validation tiers (0–4) that select tests by dependency analysis, not by convention. `pnpm verify:affected` determines what needs testing based on what changed.',
    why: 'A change to `@varve/tokens` affects the UI, the editor, and the website. A change to `varve-trace` affects only the image tracing pipeline. Impact-aware validation runs the right tests at the right depth.',
    tradeoff: 'The validation tiers require maintained dependency metadata. If the dependency graph is wrong, tests are missed. Full suite requires explicit escalation with a stated reason.',
    lesson: 'Test strategy is an architecture decision. The shape of the dependency graph determines the shape of the test graph.',
  },
];

export default function DecisionExplorer() {
  const [selected, setSelected] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Key architectural decisions" className="my-12">
      <h3 className="text-xl font-bold mb-2 text-foreground">Key Decisions</h3>
      <p className="text-sm text-muted-foreground mb-6">Five decisions that shaped the product. Each one involved real tradeoffs.</p>
      
      <div className="space-y-3">
        {DECISIONS.map((decision, i) => {
          const isActive = selected === i;
          return (
            <div key={i} className="rounded-lg border border-border/50 overflow-hidden">
              <button
                onClick={() => setSelected(isActive ? null : i)}
                className="w-full text-left p-4 flex items-start gap-3 group hover:bg-secondary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
                aria-expanded={isActive}
                aria-controls={`decision-detail-${i}`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-primary'} transition-colors mt-0.5`} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'} transition-colors leading-snug`}>
                  {decision.title}
                </span>
              </button>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    id={`decision-detail-${i}`}
                    role="region"
                    aria-label={`Decision: ${decision.title}`}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-13 space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-foreground block mb-1">Constraint</span>
                        <p className="text-foreground/80 leading-relaxed">{decision.constraint}</p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-foreground block mb-1">Options Considered</span>
                        <ul className="space-y-1 mt-1">
                          {decision.options.map((opt, j) => (
                            <li key={j} className="flex items-start gap-2 text-foreground/80">
                              <span className="text-muted-foreground mt-1" aria-hidden="true">•</span>
                              <span className="leading-relaxed">{opt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-3 rounded-md bg-secondary/50 border border-border/50">
                        <span className="font-semibold text-foreground block mb-1">Choice</span>
                        <p className="text-foreground/90 leading-relaxed">{decision.choice}</p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-foreground block mb-1">Why</span>
                        <p className="text-foreground/80 leading-relaxed">{decision.why}</p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-foreground block mb-1">Tradeoff</span>
                        <p className="text-foreground/80 leading-relaxed">{decision.tradeoff}</p>
                      </div>
                      
                      <div className="p-3 rounded-md bg-primary/5 border border-primary/15">
                        <span className="font-semibold text-primary block mb-1">Lesson</span>
                        <p className="text-foreground/90 leading-relaxed">{decision.lesson}</p>
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
