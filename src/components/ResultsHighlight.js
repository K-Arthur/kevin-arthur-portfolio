'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * AnimatedValue - Inline animated counter for result values
 */
function AnimatedValue({ value, isInView }) {
    const [displayValue, setDisplayValue] = useState(value);
    const shouldReduceMotion = useReducedMotion();
    const hasAnimated = useRef(false);

    // Parse numeric portion and suffix from value (e.g., "97%" -> 97, "%")
    const parseValue = (val) => {
        const str = String(val);
        const numMatch = str.match(/^([0-9.]+)/);
        const numericPart = numMatch ? parseFloat(numMatch[1]) : null;
        const suffix = str.replace(/^[0-9.]+/, '');
        return { numericPart, suffix };
    };

    const { numericPart, suffix } = parseValue(value);
    const isAnimatable = numericPart !== null && !isNaN(numericPart);

    useEffect(() => {
        if (!isInView || hasAnimated.current || !isAnimatable || shouldReduceMotion) {
            if (shouldReduceMotion || !isAnimatable) {
                setDisplayValue(value);
            }
            return;
        }

        hasAnimated.current = true;
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numericPart * eased;

            if (Number.isInteger(numericPart)) {
                setDisplayValue(`${Math.round(current)}${suffix}`);
            } else {
                setDisplayValue(`${current.toFixed(1)}${suffix}`);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value, numericPart, suffix, isAnimatable, shouldReduceMotion]);

    return <>{displayValue}</>;
}

/**
 * ResultsHighlight - Displays key metrics in a visually prominent grid
 * Used at the top of case studies to showcase impact and outcomes
 * 
 * @param {Object} props
 * @param {Array} props.results - Array of { value, label, context? }
 */
export default function ResultsHighlight({ results }) {
    const [isMounted, setIsMounted] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

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
            ref={ref}
            className="my-12 py-10 px-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20"
            aria-label="Key Results"
        >
            <motion.div
                className="grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-6 lg:gap-16"
                variants={containerVariants}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                viewport={{ once: true, amount: 0.3 }}
            >
                {results.map((result, index) => (
                    <motion.div
                        key={index}
                        className="text-center space-y-2"
                        variants={itemVariants}
                    >
                        <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
                            <AnimatedValue value={result.value} isInView={isInView} />
                        </div>
                        <div className="text-base md:text-lg font-semibold text-foreground">
                            {result.label}
                        </div>
                        {result.context && (
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                {result.context}
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

