"use client";
import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function EfficiencyCalculator() {
    const [casesPerWeek, setCasesPerWeek] = useState(25);
    // Calculation: Average case review takes 20 mins. 40% reduction = 8 mins saved per case.
    const hoursSaved = (casesPerWeek * 8) / 60;

    const count = useSpring(0, { stiffness: 40, damping: 15 });

    useEffect(() => {
        count.set(hoursSaved);
    }, [hoursSaved, count]);

    // Transform to display 1 decimal place
    const displayValue = useTransform(count, (latest) => latest.toFixed(1));

    return (
        <div className="w-full max-w-md mx-auto my-12 p-6 md:p-8 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="text-center mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    ROI Estimator
                </span>
                <h3 className="text-xl font-bold text-foreground">Time Reclaimed Per Week</h3>
            </div>

            <div className="flex flex-col items-center justify-center mb-10">
                <div className="relative">
                    <div className="text-7xl md:text-8xl font-black text-foreground tracking-tighter tabular-nums leading-none">
                        <motion.span>{displayValue}</motion.span>
                    </div>
                    <span className="absolute -right-12 top-2 text-xl font-bold text-muted-foreground rotate-[-10deg]">hrs</span>
                </div>
                <p className="mt-4 text-sm text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full">
                    ✨ Equivalent to {(hoursSaved / 8).toFixed(1)} full work days/month
                </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex justify-between items-end">
                    <label htmlFor="cases-per-week" className="text-sm font-medium text-muted-foreground">Weekly Cases Reviewed</label>
                    <span className="text-lg font-bold text-foreground">{casesPerWeek}</span>
                </div>
                <input
                    id="cases-per-week"
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={casesPerWeek}
                    onChange={(e) => setCasesPerWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Volume</span>
                    <span>High Volume</span>
                </div>
            </div>
        </div>
    );
}
