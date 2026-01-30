"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaperToggle() {
    const [isPaperMode, setPaperMode] = useState(false);

    return (
        <div className="my-12 w-full max-w-3xl mx-auto border border-border/50 rounded-xl overflow-hidden shadow-xl transition-all duration-500 bg-background">
            <div className="bg-secondary/30 backdrop-blur-sm p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">Reading Experience Simulator</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium transition-colors ${!isPaperMode ? 'text-primary' : 'text-muted-foreground'}`}>Digital</span>
                    <button
                        onClick={() => setPaperMode(!isPaperMode)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPaperMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        aria-label="Toggle paper mode"
                    >
                        <span className={`${isPaperMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
                    </button>
                    <span className={`text-xs font-medium transition-colors ${isPaperMode ? 'text-primary' : 'text-muted-foreground'}`}>Print/Paper</span>
                </div>
            </div>

            <div className="relative overflow-hidden">
                {/* Background transition layer */}
                <div
                    className={`absolute inset-0 transition-colors duration-700 ease-in-out ${isPaperMode ? 'bg-[#FAF5EA]' : 'bg-background'}`}
                />

                {/* Grain Noise Overlay */}
                <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isPaperMode ? 'opacity-10' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        mixBlendMode: 'multiply'
                    }}
                />

                {/* Content */}
                <div className={`relative z-10 p-8 md:p-12 transition-all duration-700`}>
                    <div className="max-w-xl mx-auto space-y-6">
                        <motion.h4
                            layout
                            className={`text-2xl md:text-3xl font-bold leading-tight ${isPaperMode ? 'font-serif tracking-tight text-slate-950' : 'font-sans tracking-tight text-foreground'}`}
                        >
                            Redefining Research Communication
                        </motion.h4>

                        <motion.div layout className={`space-y-4 text-base md:text-lg leading-relaxed ${isPaperMode ? 'font-serif text-slate-900' : 'font-sans text-foreground'}`}>
                            <p>
                                Scientific discovery moves faster than the publication cycle. We needed a platform that honored the rigor of academic research while embracing the immediacy of the digital age.
                            </p>
                            <p>
                                By reducing visual noise and prioritizing typography, we created an environment where complex ideas can be absorbed without distraction.
                            </p>
                        </motion.div>

                        {isPaperMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-3 py-1 border border-[#C2185B] text-[#C2185B] text-xs font-bold uppercase tracking-wider mt-4"
                            >
                                Research Highlight
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
