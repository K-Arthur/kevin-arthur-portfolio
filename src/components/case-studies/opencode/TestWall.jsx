"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const LAYERS = [
  { key: 'unit', label: 'Unit', desc: 'Pure logic: state derivation, parsers, reducers, formatters.', weight: 40 },
  { key: 'integration', label: 'Integration', desc: 'Host services talking to a real opencode server session.', weight: 18 },
  { key: 'contract', label: 'Contract', desc: 'package.json manifest ↔ implementation agree on every surface.', weight: 14 },
  { key: 'roundtrip', label: 'Round-trip', desc: 'Every postMessage shape serializes/deserializes losslessly.', weight: 10 },
  { key: 'visual', label: 'Visual', desc: '18 Playwright snapshots pin the webview in known states.', weight: 18 },
];

const SURFACES = [
  { n: 46, label: 'commands' },
  { n: 20, label: 'keybindings' },
  { n: 43, label: 'settings' },
];

function Count({ to, suffix = '', start }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduce) { setV(to); return; }
    let raf; const t0 = performance.now(); const dur = 1100;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, reduce]);
  return <>{v}{suffix}</>;
}

export default function TestWall() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState('contract');
  const reduce = useReducedMotion();
  const current = LAYERS.find((l) => l.key === active);

  return (
    <div ref={ref} className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-bold text-lg">The test wall</h4>
          <p className="text-sm text-muted-foreground">What turns a silent dead wire into a red build.</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary tabular-nums"><Count to={300} suffix="+" start={inView} /></div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">automated tests</div>
        </div>
      </div>

      {/* stacked layer bar */}
      <div className="flex h-4 w-full rounded-full overflow-hidden mb-3" role="group" aria-label="Test layers by share">
        {LAYERS.map((l, i) => (
          <motion.button key={l.key} onClick={() => setActive(l.key)}
            initial={{ width: 0 }} animate={inView ? { width: `${l.weight}%` } : {}}
            transition={reduce ? { duration: 0 } : { delay: 0.1 * i, type: 'spring', stiffness: 90, damping: 18 }}
            aria-label={l.label}
            className={`h-full border-r border-card last:border-r-0 transition-opacity ${active === l.key ? 'opacity-100' : 'opacity-50 hover:opacity-80'} ${
              ['bg-primary','bg-emerald-500','bg-amber-500','bg-sky-500','bg-violet-500'][i]}`} />
        ))}
      </div>

      {/* layer chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {LAYERS.map((l) => (
          <button key={l.key} onClick={() => setActive(l.key)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
              active === l.key ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <motion.p key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        className="text-sm text-foreground/80 min-h-[2.5rem] mb-6">
        <span className="font-semibold">{current.label}:</span> {current.desc}
      </motion.p>

      {/* contract surfaces */}
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Contract-verified surfaces</span>
          <span className="text-sm font-bold text-primary tabular-nums"><Count to={109} start={inView} /></span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SURFACES.map((s) => (
            <div key={s.label} className="rounded-lg bg-secondary/30 px-3 py-3 text-center">
              <div className="text-2xl font-bold tabular-nums"><Count to={s.n} start={inView} /></div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Every declared surface must resolve to a real handler — declared-but-unwired fails the build.</p>
      </div>
    </div>
  );
}
