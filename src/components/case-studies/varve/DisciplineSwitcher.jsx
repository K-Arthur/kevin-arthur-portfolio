"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DISCIPLINES = [
  {
    id: 'vector',
    label: 'Vector',
    icon: '◆',
    color: 'bg-emerald-500',
    scene: 'Pen tool, node editing, boolean ops',
    model: 'Shape nodes with Bézier paths',
    export: 'SVG, React, Flutter, SwiftUI',
    detail: 'The pen tool creates Bézier paths with anchor points and control handles. Boolean operations (union, subtract, intersect, exclude) combine shapes. The warp system applies geometry modifiers non-destructively.',
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: '▢',
    color: 'bg-amber-500',
    scene: 'Multi-page spreads with CSS flex/grid',
    model: 'Frame nodes with layout styles',
    export: 'SVG, React, HTML, Email',
    detail: 'Frames use CSS-native flex and grid layout — the same box model developers already know. Pages are frames at document scale. Auto-layout suggestions are computed by the Rust layout engine via Taffy.',
  },
  {
    id: 'typography',
    label: 'Type',
    icon: 'T',
    color: 'bg-sky-500',
    scene: 'Variable fonts, OpenType, text-on-path',
    model: 'Text nodes with rich formatting',
    export: 'React, SVG, Flutter, SwiftUI',
    detail: 'HarfBuzz shapes text natively. 80+ OpenType feature tags are supported. Variable font axes (weight, width, slant, optical size) are editable on-canvas. Adaptive contrast ensures WCAG AA/AAA compliance.',
  },
  {
    id: 'motion',
    label: 'Motion',
    icon: '▶',
    color: 'bg-violet-500',
    scene: 'Timeline with keyframes and graph editor',
    model: 'Keyframes on any node property',
    export: 'CSS, Lottie, SVG SMIL, React',
    detail: 'The timeline panel provides keyframe animation with Oklab color interpolation, path morphing, and smart animate. The graph editor exposes Bézier curves for easing control. Auto-keyframe assist reduces manual work.',
  },
  {
    id: 'prototype',
    label: 'Prototype',
    icon: '⬡',
    color: 'bg-rose-500',
    scene: 'Interactive triggers and transitions',
    model: 'Interactions attached to nodes',
    export: 'Interactive HTML, React',
    detail: 'Click, hover, drag, scroll, and key-press triggers. Navigate, overlay, set-variable, and animate actions. Variable-based conditional logic enables branching flows. Smart Animate matches nodes across screens.',
  },
  {
    id: 'print',
    label: 'Print',
    icon: '◼',
    color: 'bg-orange-500',
    scene: 'PDF/X export with CMYK and ICC',
    model: 'Page nodes with print geometry',
    export: 'PDF/X-1a, PDF/X-4',
    detail: 'Font outlining via ab_glyph. CMYK conversion through ICC profiles. Crop and registration marks. Preflight checks validate color space, bleed, and resolution before export. No `window.print()` — production PDF generation.',
  },
];

export default function DisciplineSwitcher() {
  const [active, setActive] = useState('vector');
  const d = DISCIPLINES.find((x) => x.id === active);

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6">
        <h4 className="font-bold text-lg">Six Disciplines, One Document</h4>
        <p className="text-sm text-muted-foreground">Switch between modes to see how the same scene graph serves each workflow.</p>
      </div>

      {/* Discipline tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5 p-1 bg-secondary/30 rounded-xl">
        {DISCIPLINES.map((disc) => (
          <button
            key={disc.id}
            onClick={() => setActive(disc.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring flex-1 justify-center min-w-[80px] ${
              active === disc.id
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${disc.color} shrink-0`} />
            <span className="hidden sm:inline">{disc.label}</span>
            <span className="sm:hidden">{disc.icon}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-border bg-background p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${d.color} text-white text-lg font-bold`}>
              {d.icon}
            </span>
            <div>
              <div className="font-semibold text-base">{d.label}</div>
              <div className="text-xs text-muted-foreground">{d.scene}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-secondary/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Scene model</div>
              <p className="text-xs text-foreground/80">{d.model}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Exports to</div>
              <p className="text-xs text-foreground/80">{d.export}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3 md:col-span-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">How it works</div>
              <p className="text-xs text-foreground/80 leading-relaxed">{d.detail}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        No format conversion required — the same node stays live across all modes.
      </p>
    </div>
  );
}
