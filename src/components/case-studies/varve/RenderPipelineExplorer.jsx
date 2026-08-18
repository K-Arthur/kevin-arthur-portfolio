"use client";
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STAGES = [
  {
    id: 'scene',
    title: 'Scene Graph',
    sub: '@varve/scene',
    color: 'border-emerald-500/40 bg-emerald-500/[0.06]',
    dot: 'bg-emerald-500',
    points: [
      'Immutable document model with typed nodes',
      'Vector, text, frame, group, and table nodes',
      'Shared fills, strokes, effects, and masks',
      'One graph holds all six creative disciplines',
    ],
  },
  {
    id: 'engine',
    title: 'Rust Engine',
    sub: 'varve-engine · native',
    color: 'border-amber-500/40 bg-amber-500/[0.06]',
    dot: 'bg-amber-500',
    points: [
      'Walks the scene graph and resolves layout',
      'Applies effects, blur kernels, and compositing',
      'Computes hit-testing and geometry natively',
      'Unbounded by WASM or browser constraints',
    ],
  },
  {
    id: 'ir',
    title: 'Render IR',
    sub: 'compact draw list',
    color: 'border-sky-500/40 bg-sky-500/[0.06]',
    dot: 'bg-sky-500',
    points: [
      'Flat command list measured in kilobytes',
      'Crosses Tauri IPC boundary deterministically',
      'No scene-graph access on the replay side',
      'Enables testing the renderer in isolation',
    ],
  },
  {
    id: 'canvas',
    title: 'Canvas Surface',
    sub: 'Canvas2D · WebGPU',
    color: 'border-violet-500/40 bg-violet-500/[0.06]',
    dot: 'bg-violet-500',
    points: [
      'Canvas2D: production path on all platforms',
      'WebGPU: opt-in on macOS and Windows',
      'Pluggable compositor with structural fallback',
      'Dirty-rect partial redraw for performance',
    ],
  },
];

function StageNode({ stage, active, onClick }) {
  return (
    <button
      onClick={() => onClick(stage.id)}
      aria-pressed={active}
      className={`flex-1 min-w-[120px] rounded-xl border p-3 md:p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-ring ${stage.color} ${active ? 'ring-2 ring-primary scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`h-2.5 w-2.5 rounded-full ${stage.dot}`} />
        <span className="font-semibold text-xs md:text-sm">{stage.title}</span>
      </div>
      <span className="text-[10px] md:text-[11px] font-mono text-muted-foreground">{stage.sub}</span>
    </button>
  );
}

function Arrow({ active }) {
  return (
    <div className="hidden md:flex items-center px-1" aria-hidden="true">
      <motion.div
        animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
        transition={active ? { duration: 1.5, repeat: Infinity } : {}}
        className="text-muted-foreground text-lg"
      >→</motion.div>
    </div>
  );
}

export default function RenderPipelineExplorer() {
  const [active, setActive] = useState('engine');
  const [pingActive, setPingActive] = useState(false);
  const reduce = useReducedMotion();
  const stage = STAGES.find((s) => s.id === active);

  const sendPing = () => {
    setPingActive(false);
    requestAnimationFrame(() => setPingActive(true));
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-bold text-lg">The IR-Replay Pipeline</h4>
          <p className="text-sm text-muted-foreground">Tap a stage to see what it owns. Then send a draw command across the wire.</p>
        </div>
        <button
          onClick={sendPing}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Send IR →
        </button>
      </div>

      {/* Pipeline stages */}
      <div className="relative">
        <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <StageNode stage={s} active={active === s.id} onClick={setActive} />
              {i < STAGES.length - 1 && <Arrow active={pingActive} />}
            </React.Fragment>
          ))}
        </div>

        {/* Travelling packet */}
        <div className="relative h-6 mt-2 hidden md:block" aria-hidden="true">
          <div className={`absolute top-1/2 left-0 right-0 h-px transition-colors duration-300 ${pingActive ? 'bg-sky-400' : 'bg-border'}`} />
          {pingActive && (
            <motion.div
              initial={{ left: '5%', opacity: 0 }}
              animate={{ left: ['5%', '95%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              onAnimationComplete={() => setPingActive(false)}
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_12px_3px] shadow-sky-400/50"
            />
          )}
        </div>
      </div>

      {/* IPC boundary label */}
      <div className="mt-2 rounded-lg border border-sky-500/30 bg-sky-500/[0.06] px-4 py-2 text-center text-xs font-mono text-sky-600 dark:text-sky-400">
        Tauri IPC · the boundary between native computation and browser display
      </div>

      {/* Detail panel */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 rounded-xl border border-border bg-background p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`h-2.5 w-2.5 rounded-full ${stage.dot}`} />
          <span className="font-semibold">{stage.title}</span>
          <span className="text-[11px] font-mono text-muted-foreground">· {stage.sub}</span>
        </div>
        <ul className="space-y-1.5">
          {stage.points.map((p, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span dangerouslySetInnerHTML={{ __html: p.replace(/`([^`]+)`/g, '<code class="font-mono text-primary text-[0.9em]">$1</code>') }} />
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Performance stat */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono font-bold text-primary">86.4 fps</span>
        <span>measured at 960×600 — 10× faster than pixel-push</span>
      </div>
    </div>
  );
}
