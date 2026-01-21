'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';

/**
 * ResultsHighlight - Displays key metrics in a visually prominent grid
 * Used at the top of case studies to showcase impact and outcomes
 * 
 * @param {Object} props
 * @param {Array} props.results - Array of { value, label, context? }
 */
export default function ResultsHighlight({ results }) {
    const [isMounted, setIsMounted] = useState(false);

    // Only enable animations after mount to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!results || results.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 15,
                stiffness: 100,
            },
        },
    };

    return (
        <section
            className="my-12 py-10 px-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20"
            aria-label="Key Results"
        >
            <m.div
                className="grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-6 lg:gap-16"
                variants={containerVariants}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                viewport={{ once: true, amount: 0.3 }}
            >
                {results.map((result, index) => (
                    <m.div
                        key={index}
                        className="text-center space-y-2"
                        variants={itemVariants}
                    >
                        <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
                            {result.value}
                        </div>
                        <div className="text-base md:text-lg font-semibold text-foreground">
                            {result.label}
                        </div>
                        {result.context && (
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                {result.context}
                            </div>
                        )}
                    </m.div>
                ))}
            </m.div>
        </section>
    );
}
