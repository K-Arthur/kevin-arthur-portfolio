"use client";
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const LIMIT = 200000;       // context-window tokens
const PER_TURN = 17000;     // tokens added per turn
const START = 34000;        // 2 turns in

function fillColor(pct) {
  if (pct >= 80) return 'bg-red-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function Bar({ title, pct, tokens, tone, note }) {
  const reduce = useReducedMotion();
  return (
    <div className={`flex-1 rounded-xl border p-4 ${tone === 'bad' ? 'border-red-500/30 bg-red-500/[0.04]' : 'border-emerald-500/30 bg-emerald-500/[0.04]'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs font-mono tabular-nums text-muted-foreground">{tokens.toLocaleString()} tok</span>
      </div>
      <div className="h-3 w-full rounded-full bg-secondary/60 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${fillColor(pct)}`}
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-bold tabular-nums">{pct}%</span>
        <span className={`text-[11px] font-medium ${tone === 'bad' ? 'text-red-500' : 'text-emerald-500'}`}>{note}</span>
      </div>
    </div>
  );
}

export default function StalenessSimulator() {
  const [real, setReal] = useState(START);     // live, re-derived truth
  const [cached, setCached] = useState(START);  // captured at init, write path dead
  const [turns, setTurns] = useState(2);
  const [log, setLog] = useState('Session opened — both readouts agree. Now send a few turns.');

  const realPct = Math.min(100, Math.round((real / LIMIT) * 100));
  const cachedPct = Math.min(100, Math.round((cached / LIMIT) * 100));
  const drift = realPct - cachedPct;

  const send = () => {
    const next = Math.min(LIMIT, real + PER_TURN);
    setReal(next);
    setTurns((t) => t + 1);
    // The cached local never fires its write path — that's the bug.
    const d = Math.min(100, Math.round((next / LIMIT) * 100)) - cachedPct;
    setLog(`Turn ${turns + 1} sent. The re-derived bar recomputed from live tokens; the cached bar never fired its write path — it's now lying by ${d}%.`);
  };

  const reload = () => {
    // Cached local is lost on reload; re-derived restores from globalState.
    setCached(0);
    setLog('Window reloaded. The cached value was never persisted, so it reset to a hopeful default. The re-derived bar restored the exact fill from globalState.');
  };

  const reset = () => {
    setReal(START); setCached(START); setTurns(2);
    setLog('Reset. Both readouts agree again.');
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6">
        <h4 className="font-bold text-lg">Silent Staleness, live</h4>
        <p className="text-sm text-muted-foreground">Send turns and reload the window. Watch the cached readout drift from the truth — without ever throwing an error.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Bar title="❌ Cached local" pct={cachedPct} tokens={cached} tone="bad"
          note={drift > 0 ? `off by ${drift}%` : 'looks fine…'} />
        <Bar title="✅ Active re-derivation" pct={realPct} tokens={real} tone="good" note="live truth" />
      </div>

      {drift > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 font-medium"
        >
          The cached context bar is telling the user {cachedPct}% when the real fill is {realPct}%. No stack trace. Just a quiet lie.
        </motion.div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={send}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          Send a message
        </button>
        <button onClick={reload}
          className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold shadow hover:bg-foreground/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          Reload window
        </button>
        <button onClick={reset}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          Reset
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground leading-relaxed min-h-[2.5rem]" role="status" aria-live="polite">
        {log}
      </p>
    </div>
  );
}
