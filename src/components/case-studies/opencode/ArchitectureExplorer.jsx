"use client";
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const NODES = {
  host: {
    title: 'Extension Host',
    sub: 'Node.js process',
    color: 'border-sky-500/40 bg-sky-500/[0.06]',
    dot: 'bg-sky-500',
    points: [
      'Owns the file system and spawns `opencode serve`',
      'Holds the SDK client and streams responses',
      'The only side that can touch globalState',
    ],
  },
  ipc: {
    title: 'postMessage IPC',
    sub: 'async · serialized',
    color: 'border-cyan-500/40 bg-cyan-500/[0.06]',
    dot: 'bg-cyan-400',
    points: [
      'The only channel between the two processes',
      'Every state change crosses as a serialized message',
      'A truth boundary — anything cached past it can go stale',
    ],
  },
  webview: {
    title: 'Webview Panel',
    sub: 'isolated DOM',
    color: 'border-violet-500/40 bg-violet-500/[0.06]',
    dot: 'bg-violet-500',
    points: [
      'Renders chat, tools, and diffs in a sandboxed iframe',
      'No direct access to Node, files, or storage',
      're-derives its UI from the live state it receives',
    ],
  },
};

function Node({ id, node, active, onClick }) {
  return (
    <button onClick={() => onClick(id)}
      aria-pressed={active}
      className={`flex-1 min-w-[150px] rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-ring ${node.color} ${active ? 'ring-2 ring-primary scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`h-2.5 w-2.5 rounded-full ${node.dot}`} />
        <span className="font-semibold text-sm">{node.title}</span>
      </div>
      <span className="text-[11px] font-mono text-muted-foreground">{node.sub}</span>
    </button>
  );
}

export default function ArchitectureExplorer() {
  const [active, setActive] = useState('ipc');
  const [pinging, setPinging] = useState(false);
  const reduce = useReducedMotion();
  const node = NODES[active];

  const ping = () => {
    if (reduce) return;
    setPinging(false);
    requestAnimationFrame(() => setPinging(true));
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-bold text-lg">Two processes, one wire</h4>
          <p className="text-sm text-muted-foreground">Tap a piece to see what it owns. Then send a state update across the bridge.</p>
        </div>
        <button onClick={ping}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
          Send state update →
        </button>
      </div>

      {/* node row with animated wire */}
      <div className="relative">
        <div className="flex items-stretch gap-3">
          <Node id="host" node={NODES.host} active={active === 'host'} onClick={setActive} />
          <Node id="ipc" node={NODES.ipc} active={active === 'ipc'} onClick={setActive} />
          <Node id="webview" node={NODES.webview} active={active === 'webview'} onClick={setActive} />
        </div>

        {/* travelling packet */}
        <div className="relative h-6 mt-2" aria-hidden="true">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          {pinging && (
            <motion.div
              initial={{ left: '4%', opacity: 0 }}
              animate={{ left: ['4%', '96%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              onAnimationComplete={() => setPinging(false)}
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_2px] shadow-cyan-400/50"
            />
          )}
        </div>
      </div>

      {/* globalState strip */}
      <div className="mt-2 rounded-lg border border-primary/30 bg-primary/[0.06] px-4 py-2 text-center text-xs font-mono text-primary">
        ExtensionContext.globalState · the durable source of truth
      </div>

      {/* detail panel */}
      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="mt-5 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`h-2.5 w-2.5 rounded-full ${node.dot}`} />
          <span className="font-semibold">{node.title}</span>
          <span className="text-[11px] font-mono text-muted-foreground">· {node.sub}</span>
        </div>
        <ul className="space-y-1.5">
          {node.points.map((p, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span dangerouslySetInnerHTML={{ __html: p.replace(/`([^`]+)`/g, '<code class="font-mono text-primary text-[0.9em]">$1</code>') }} />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
