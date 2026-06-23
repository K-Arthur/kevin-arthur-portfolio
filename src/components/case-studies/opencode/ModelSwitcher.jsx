"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MODELS = [
  { provider: 'Anthropic', items: ['Claude Opus 4.8', 'Claude Sonnet 4.6', 'Claude Haiku 4.5'] },
  { provider: 'OpenAI', items: ['GPT-5.1', 'GPT-5 mini', 'o4'] },
  { provider: 'Google', items: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'] },
  { provider: 'opencode Zen', items: ['opencode/big-pickle', 'opencode/grok-code'] },
];

const INITIAL = [
  { id: 'session-1', name: 'Refactor auth', model: 'Claude Sonnet 4.6' },
  { id: 'session-2', name: 'Write tests', model: 'GPT-5 mini' },
  { id: 'session-3', name: 'Explore repo', model: 'Gemini 2.5 Flash' },
];

export default function ModelSwitcher() {
  const [tabs, setTabs] = useState(INITIAL);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [reloaded, setReloaded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.map((g) => ({
      ...g,
      items: g.items.filter((m) => !q || m.toLowerCase().includes(q) || g.provider.toLowerCase().includes(q)),
    })).filter((g) => g.items.length);
  }, [query]);

  const pick = (model) => {
    setTabs((t) => t.map((tab, i) => (i === active ? { ...tab, model } : tab)));
    setReloaded(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="mb-6">
        <h4 className="font-bold text-lg">Per-tab model selection</h4>
        <p className="text-sm text-muted-foreground">Each tab is an independent worker. Switch one tab's model — the others don't budge — then reload to see the choice persist.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab, i) => (
          <button key={tab.id} onClick={() => setActive(i)}
            className={`px-3 py-2 rounded-lg text-left border transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
              i === active ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary'}`}>
            <span className="block text-xs font-semibold">{tab.name}</span>
            <span className="block text-[11px] font-mono text-muted-foreground">{tab.model}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Model list */}
        <div className="rounded-xl border border-border bg-background p-3">
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 75+ models…"
            className="w-full mb-3 px-3 py-2 text-sm rounded-lg bg-secondary/40 border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="max-h-56 overflow-y-auto pr-1 space-y-3">
            {filtered.map((g) => (
              <div key={g.provider}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{g.provider}</div>
                <div className="space-y-1">
                  {g.items.map((m) => {
                    const selected = tabs[active].model === m;
                    return (
                      <button key={m} onClick={() => pick(m)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                          selected ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {!filtered.length && <p className="text-sm text-muted-foreground px-1">No models match “{query}”.</p>}
          </div>
        </div>

        {/* State panel */}
        <div className="rounded-xl border border-border bg-background p-4 flex flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Active sessions</div>
          <div className="space-y-2 flex-1">
            {tabs.map((tab, i) => (
              <div key={tab.id} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${i === active ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'}`}>
                <span className="font-medium">{tab.name}</span>
                <AnimatePresence mode="popLayout">
                  <motion.span key={tab.model} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="font-mono text-xs text-primary">{tab.model}</motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
          <button onClick={() => setReloaded(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold shadow hover:bg-foreground/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
            Reload window
          </button>
          {reloaded && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-2 text-[11px] text-emerald-500 font-medium">
              ✓ All three model choices restored from globalState — nothing reverted to a default.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
