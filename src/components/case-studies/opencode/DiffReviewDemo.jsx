"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DIFF = [
  { type: 'ctx', text: 'export function restoreTabs(ctx: ExtensionContext): Tab[] {' },
  { type: 'del', text: '  const saved = cachedTabs ?? [];' },
  { type: 'add', text: '  const saved = ctx.globalState.get<Tab[]>(STATE_KEY);' },
  { type: 'ctx', text: '  // Storage is the single source of truth.' },
  { type: 'del', text: '  return saved;' },
  { type: 'add', text: '  return (saved ?? []).map(deriveTabState);' },
  { type: 'ctx', text: '}' },
];

export default function DiffReviewDemo() {
  const [state, setState] = useState('pending'); // pending | applied | discarded
  const reset = () => setState('pending');

  return (
    <div className="w-full max-w-2xl mx-auto my-12 rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/40 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">stateManager.ts</span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">1 file changed</span>
      </div>

      {/* diff body */}
      <div className="font-mono text-[12.5px] leading-relaxed p-4 overflow-x-auto">
        {DIFF.map((line, i) => {
          const hidden = (state === 'applied' && line.type === 'del') || (state === 'discarded' && line.type === 'add');
          return (
            <AnimatePresence key={i} initial={false}>
              {!hidden && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`whitespace-pre px-2 rounded ${
                    line.type === 'add' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : line.type === 'del' ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'}`}>
                  <span className="select-none opacity-50 mr-2">{line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}</span>
                  {line.text}
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* controls / status */}
      <div className="px-4 py-3 border-t border-border bg-background/40">
        {state === 'pending' && (
          <div className="flex items-center gap-3">
            <button onClick={() => setState('applied')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              Accept
            </button>
            <button onClick={() => setState('discarded')}
              className="px-4 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              Discard
            </button>
            <span className="text-xs text-muted-foreground ml-auto">Review the change before it touches disk.</span>
          </div>
        )}
        {state === 'applied' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">✓ Applied via WorkspaceEdit · checkpoint saved</span>
            <button onClick={reset}
              className="ml-auto px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              ↩ Roll back
            </button>
          </motion.div>
        )}
        {state === 'discarded' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Discarded — the file was never modified.</span>
            <button onClick={reset}
              className="ml-auto px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              Reset
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
