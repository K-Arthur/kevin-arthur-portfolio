"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfidenceSimulator() {
    const [confidence, setConfidence] = useState(92);

    const getStatus = (score) => {
        if (score < 80) return {
            label: "Low Confidence",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500",
            border: "border-amber-500",
            alert: "Human review required. Model uncertainty high.",
            icon: "⚠️"
        };
        if (score < 90) return {
            label: "Moderate",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500",
            border: "border-blue-500",
            alert: "Verify findings with clinical correlation.",
            icon: "ℹ️"
        };
        return {
            label: "High Confidence",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500",
            border: "border-emerald-500",
            alert: "Analysis complete. High reliability.",
            icon: "✅"
        };
    };

    const status = getStatus(confidence);

    return (
        <div className="w-full max-w-xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-2xl">
            <div className="text-center mb-8">
                <h4 className="font-bold text-lg">Designing for Trust</h4>
                <p className="text-sm text-muted-foreground">Use the slider to see how the UI communicates uncertainty.</p>
            </div>

            {/* Card Preview */}
            <div className={`relative overflow-hidden rounded-xl border-l-4 bg-background shadow-sm transition-all duration-300 ${status.border}`}>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h5 className="font-bold text-lg">Chest X-Ray Analysis</h5>
                            <p className="text-xs font-mono text-muted-foreground">SCAN-ID: 8492-MA-2024</p>
                        </div>
                        <motion.div
                            key={status.label}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 ${status.bg}`}
                        >
                            <span>{status.icon}</span>
                            {status.label}
                        </motion.div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/20 border border-border/50">
                            <span className="font-medium">Pleural Effusion</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Prob.</span>
                                <span className={`font-mono font-bold text-lg ${status.color}`}>
                                    {confidence}%
                                </span>
                            </div>
                        </div>

                        {/* Dynamic Alert Message */}
                        <div className={`text-sm p-3 rounded bg-secondary/10 border border-border/10 flex items-start gap-3 transition-colors duration-300 ${status.color}`}>
                            <span className="text-lg mt-0.5">{status.icon}</span>
                            <p className="leading-tight font-medium opacity-90">{status.alert}</p>
                        </div>
                    </div>

                    {/* Simulated Action Button */}
                    <div className="mt-5 pt-4 border-t border-border/50 flex gap-3">
                        {confidence < 80 ? (
                            <button className="flex-1 bg-foreground text-background py-2 rounded-lg text-sm font-bold shadow hover:bg-foreground/90 transition-colors">
                                Request Specialist Review
                            </button>
                        ) : (
                            <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-bold shadow hover:bg-primary/90 transition-colors">
                                Add to Report
                            </button>
                        )}
                        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                            Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Slider Control */}
            <div className="mt-10 px-2">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium">Simulate AI Confidence Level</label>
                    <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">{confidence}%</span>
                </div>

                <input
                    type="range"
                    min="50"
                    max="99"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />

                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase tracking-wide font-medium">
                    <span>Threshold</span>
                    <span>80% (Review)</span>
                    <span>90% (Safe)</span>
                </div>
            </div>
        </div>
    );
}
