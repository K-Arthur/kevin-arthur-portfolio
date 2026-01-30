"use client";
import React from 'react';
import { motion } from 'framer-motion';

const principles = [
    {
        title: "Minimize Cognitive Load",
        icon: "🧠",
        front: "Players must process combat decisions in <100ms. Every UI element competes for attention.",
        back: "Solution: Use progressive disclosure. Show only critical info (health, energy) persistently. Surface secondary data (combo meter, item wheel) only when contextually relevant."
    },
    {
        title: "Maximize Contrast, Always",
        icon: "👁️",
        front: "Game environments are chaotic. Explosions, effects, and enemies create visual noise.",
        back: "Solution: All HUD elements use a minimum 4.5:1 contrast ratio against a semi-transparent dark backing. Text is always white or neon-bright on a guaranteed dark surface."
    },
    {
        title: "Respect 'Reduce Motion'",
        icon: "♿",
        front: "Flashy animations are cool, but can trigger discomfort or seizures for some players.",
        back: "Solution: All non-essential animations (glitch effects, pulsing glows) check the player's accessibility settings and gracefully degrade to static states if 'reduce motion' is enabled."
    },
    {
        title: "Fitts's Law for Menus",
        icon: "🎯",
        front: "Menu navigation with a controller is different from mouse. Edge-detection matters less.",
        back: "Solution: Design large, clearly separated touch/click targets. Menu items have generous padding (min 48px height). Focus states are visually obvious (neon glow + scale)."
    },
];

const CardFlip = ({ principle }) => {
    return (
        <motion.div
            className="group perspective-1000 h-64 cursor-pointer"
            whileHover="hover"
        >
            <motion.div
                className="relative w-full h-full transition-transform duration-500 preserve-3d"
                variants={{
                    hover: { rotateY: 180 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front - Theme aware */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl border-2 border-border bg-background p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow dark:bg-gradient-to-br dark:from-[#0D0D0D] dark:to-[#1A1A2E] dark:border-[#FF4081]/30"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div>
                        <span className="text-3xl">{principle.icon}</span>
                        <h4 className="text-lg font-bold text-foreground mt-3">{principle.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{principle.front}</p>
                    <span className="text-[10px] text-primary font-mono uppercase tracking-widest self-end dark:text-[#00E5FF]">Hover to flip →</span>
                </div>

                {/* Back - Theme aware */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl border-2 border-primary/50 bg-primary/5 p-6 flex flex-col justify-center shadow-xl dark:bg-gradient-to-br dark:from-[#00E5FF]/10 dark:to-[#0D0D0D] dark:border-[#00E5FF]/50"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 dark:text-[#00E5FF]">The Solution</span>
                    <p className="text-sm text-foreground/90 leading-relaxed">{principle.back}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function DesignPrincipleCards() {
    return (
        // Theme-aware container - uses semantic colors in light mode, preserves HUD aesthetic in dark mode
        <div className="w-full bg-secondary/50 dark:bg-[#050505] -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-16 my-12 relative overflow-hidden border-y border-border/50">

            {/* Background Grid Pattern - visible in both modes */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="w-full max-w-4xl mx-auto relative z-10">
                <div className="mb-8 text-center">
                    <span className="text-xs font-mono text-primary tracking-widest uppercase dark:text-[#FF4081]">// UX Framework</span>
                    <h3 className="text-xl font-bold text-foreground mt-1">Player-First Design Principles</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                        The guiding rules that kept this UI legible at 0ms reaction time. Hover each card to see the solution.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {principles.map((p, i) => (
                        <CardFlip key={i} principle={p} />
                    ))}
                </div>
            </div>
        </div>
    );
}

