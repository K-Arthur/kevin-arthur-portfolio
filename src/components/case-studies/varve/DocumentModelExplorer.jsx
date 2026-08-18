"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NODE_TYPES = [
  {
    id: 'shape',
    label: 'Shape',
    icon: '◆',
    color: 'bg-emerald-500',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/[0.06]',
    desc: 'Rect, ellipse, line, polygon, star, and Bézier paths',
    capabilities: ['Fills & gradients', 'Strokes & dash arrays', 'Corner radius', 'Boolean ops', 'Warp modifiers'],
    holds: 'Vector illustrations, icons, illustrations, custom geometry',
  },
  {
    id: 'text',
    label: 'Text',
    icon: 'T',
    color: 'bg-sky-500',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/[0.06]',
    desc: 'Rich text with OpenType features and variable font axes',
    capabilities: ['Character formatting', 'Paragraph formatting', 'Text on path', 'Adaptive contrast', 'HarfBuzz shaping'],
    holds: 'Headlines, body copy, labels, typographic specimens',
  },
  {
    id: 'frame',
    label: 'Frame',
    icon: '▢',
    color: 'bg-amber-500',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/[0.06]',
    desc: 'Layout container with CSS-native flex and grid',
    capabilities: ['Flex layout', 'Grid layout', 'Auto-sizing', 'Clip content', 'Component instances'],
    holds: 'Page layouts, posters, editorial spreads, UI screens',
  },
  {
    id: 'group',
    label: 'Group',
    icon: '◎',
    color: 'bg-violet-500',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/[0.06]',
    desc: 'Isolated container with blend modes and effects',
    capabilities: ['Blend modes', 'Layer effects', 'Isolation', 'Masking', 'Nested composition'],
    holds: 'Complex compositions, effect stacks, organized hierarchies',
  },
  {
    id: 'table',
    label: 'Table',
    icon: '⊞',
    color: 'bg-rose-500',
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/[0.06]',
    desc: 'Responsive table that reflows across breakpoints',
    capabilities: ['Column reflow', 'Responsive breakpoints', 'Cell formatting', 'Row/column spanning', 'Data binding'],
    holds: 'Data tables, schedules, comparison grids',
  },
];

const SHARED_BASE = [
  { label: 'Opacity', icon: '◐' },
  { label: 'Blend mode', icon: '◑' },
  { label: 'Rotation', icon: '↻' },
  { label: 'Fills', icon: '■' },
  { label: 'Strokes', icon: '─' },
  { label: 'Effects', icon: '✦' },
  { label: 'Masks', icon: '◆' },
  { label: 'Constraints', icon: '⬡' },
  { label: 'Warps', icon: '∿' },
];

export default function DocumentModelExplorer() {
  const [active, setActive] = useState('shape');
  const node = NODE_TYPES.find((n) => n.id === active);

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6">
        <h4 className="font-bold text-lg">One Scene Graph, Five Node Types</h4>
        <p className="text-sm text-muted-foreground">Every node shares a common base. Tap a type to see what it adds.</p>
      </div>

      {/* Node type selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {NODE_TYPES.map((n) => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
              active === n.id
                ? `border-primary bg-primary/10 text-primary`
                : 'border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${n.color}`} />
            {n.label}
          </button>
        ))}
      </div>

      {/* Shared base */}
      <div className="mb-5 rounded-xl border border-border bg-background p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
          Shared base (all node types)
        </div>
        <div className="flex flex-wrap gap-2">
          {SHARED_BASE.map((prop) => (
            <span
              key={prop.label}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs text-foreground/80"
            >
              <span className="text-primary">{prop.icon}</span>
              {prop.label}
            </span>
          ))}
        </div>
      </div>

      {/* Active node detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`rounded-xl border ${node.border} ${node.bg} p-5`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${node.color} text-white text-lg font-bold`}>
              {node.icon}
            </span>
            <div>
              <div className="font-semibold">{node.label} Node</div>
              <div className="text-xs text-muted-foreground">{node.desc}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Capabilities</div>
              <ul className="space-y-1">
                {node.capabilities.map((c, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-primary mt-0.5">▸</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">What it holds</div>
              <p className="text-sm text-foreground/80">{node.holds}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        A single document can contain any combination of these node types — vector illustrations alongside layout frames, mixed with text stories, animated on a timeline.
      </p>
    </div>
  );
}
