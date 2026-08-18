"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const STATS = [
  { value: 13, label: 'Rust Crates', suffix: '', desc: 'Core, engine, layout, effects, print, WASM, colour, media, and more' },
  { value: 20, label: 'TypeScript Packages', suffix: '', desc: 'Editor, scene, tokens, UI, codegen, platform, prototype, and more' },
  { value: 97, label: 'UI Components', suffix: '', desc: 'Buttons, inputs, dialogs, menus, color pickers, all with APG patterns' },
  { value: 55, label: 'Editor Tools', suffix: '', desc: 'Pen, pencil, node edit, text, warp, clone stamp, and more' },
  { value: 100, label: 'Architecture ADRs', suffix: '+', desc: 'Documented decisions for rendering, layout, tokens, history, and more' },
  { value: 755, label: 'Token Lines', suffix: '', desc: 'OKLCH colors, fluid typography, 3 themes, motion, spacing' },
];

function AnimatedNumber({ to, suffix, start }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduce) { setV(to); return; }
    let raf;
    const t0 = performance.now();
    const dur = 1200;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, reduce]);

  return <>{v.toLocaleString('en-US')}{suffix}</>;
}

export default function MonorepoStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState(null);

  return (
    <div ref={ref} className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6">
        <h4 className="font-bold text-lg">Monorepo Scale</h4>
        <p className="text-sm text-muted-foreground">33 packages across two languages, one workspace. Tap a stat to see what it covers.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {STATS.map((s, i) => (
          <motion.button
            key={s.label}
            onClick={() => setSelected(selected === i ? null : i)}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 100, damping: 15 }}
            className={`rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
              selected === i
                ? 'border-primary bg-primary/[0.06] ring-2 ring-primary'
                : 'border-border bg-background hover:border-primary/40'
            }`}
          >
            <div className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
              <AnimatedNumber to={s.value} suffix={s.suffix} start={inView} />
            </div>
            <div className="text-xs font-semibold text-foreground mt-1">{s.label}</div>
          </motion.button>
        ))}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-border bg-background p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{STATS[selected].label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {STATS[selected].value}{STATS[selected].suffix}
            </span>
          </div>
          <p className="text-sm text-foreground/80">{STATS[selected].desc}</p>
        </motion.div>
      )}
    </div>
  );
}
