'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/**
 * ScrollytellingSection - A scroll-linked narrative section component
 * 
 * Creates immersive scroll-based transitions for case study storytelling.
 * Supports blur-to-clear, fade-reveal, and opacity transitions.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.transitionType - 'blur-to-clear' | 'fade-reveal' | 'scale-up'
 * @param {string} props.backgroundColor - Optional background gradient/color
 * @param {string} props.label - Optional section label (e.g., "Problem Space")
 * @param {number} props.height - Scroll height multiplier (default 1.5 = 150vh)
 * @param {string} props.className - Additional CSS classes
 */
export function ScrollytellingSection({
    children,
    transitionType = 'fade-reveal',
    backgroundColor,
    label,
    height = 1.5,
    className = '',
}) {
    const containerRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Spring config for smooth animations
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

    // Create transform values based on scroll progress
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
        springConfig
    );

    const blur = useSpring(
        useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [20, 0, 0, 20]),
        springConfig
    );

    const scale = useSpring(
        useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]),
        springConfig
    );

    const y = useSpring(
        useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]),
        springConfig
    );

    const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);

    // Determine style based on transition type
    const getStyles = () => {
        if (prefersReducedMotion) {
            return {}; // No animations for reduced motion
        }

        switch (transitionType) {
            case 'blur-to-clear':
                return {
                    opacity,
                    filter: blurFilter,
                    scale,
                };
            case 'scale-up':
                return {
                    opacity,
                    scale,
                    y,
                };
            case 'fade-reveal':
            default:
                return {
                    opacity,
                    y,
                };
        }
    };

    return (
        <div
            ref={containerRef}
            className={`scrollytelling-section relative ${className}`}
            style={{
                minHeight: `${height * 100}vh`,
                background: backgroundColor,
            }}
        >
            {/* Sticky content container */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    className="scrollytelling-content w-full max-w-5xl mx-auto px-4 md:px-8"
                    style={getStyles()}
                >
                    {/* Optional section label */}
                    {label && (
                        <motion.div
                            className="mb-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
                                {label}
                            </span>
                        </motion.div>
                    )}
                    {children}
                </motion.div>
            </div>
        </div>
    );
}

/**
 * ScrollytellingWrapper - Container for multiple scrollytelling sections
 * 
 * Orchestrates sequential sections with optional progress indicator.
 */
export function ScrollytellingWrapper({
    children,
    showProgress = true,
    className = '',
}) {
    const containerRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div ref={containerRef} className={`scrollytelling-wrapper ${className}`}>
            {/* Progress indicator */}
            {showProgress && !prefersReducedMotion && (
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
                    style={{ scaleX }}
                />
            )}
            {children}
        </div>
    );
}

/**
 * ProblemSolutionTransition - Specialized component for problem-to-solution narrative
 * 
 * Shows a "chaotic" problem state that transforms into a clean solution.
 */
export function ProblemSolutionTransition({
    problemContent,
    solutionContent,
    problemLabel = 'The Challenge',
    solutionLabel = 'The Solution',
}) {
    const containerRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start center', 'end center'],
    });

    const springConfig = { stiffness: 100, damping: 30 };

    // Problem state transforms (visible at start, fades out)
    const problemOpacity = useSpring(
        useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0]),
        springConfig
    );
    const problemBlur = useSpring(
        useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, 20]),
        springConfig
    );
    const problemScale = useSpring(
        useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0.9]),
        springConfig
    );

    // Solution state transforms (fades in at end)
    const solutionOpacity = useSpring(
        useTransform(scrollYProgress, [0.5, 0.6, 1], [0, 1, 1]),
        springConfig
    );
    const solutionBlur = useSpring(
        useTransform(scrollYProgress, [0.5, 0.7, 1], [20, 0, 0]),
        springConfig
    );
    const solutionScale = useSpring(
        useTransform(scrollYProgress, [0.5, 0.6, 1], [1.1, 1, 1]),
        springConfig
    );

    const problemBlurFilter = useTransform(problemBlur, (v) => `blur(${v}px)`);
    const solutionBlurFilter = useTransform(solutionBlur, (v) => `blur(${v}px)`);

    if (prefersReducedMotion) {
        return (
            <div className="space-y-16 py-16">
                <div>
                    <span className="block text-sm font-semibold text-destructive mb-4">{problemLabel}</span>
                    {problemContent}
                </div>
                <div>
                    <span className="block text-sm font-semibold text-primary mb-4">{solutionLabel}</span>
                    {solutionContent}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{ minHeight: '300vh' }}
        >
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                {/* Problem State */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
                    style={{
                        opacity: problemOpacity,
                        filter: problemBlurFilter,
                        scale: problemScale,
                    }}
                >
                    <div className="max-w-4xl w-full">
                        <motion.span
                            className="inline-block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-destructive bg-destructive/10 rounded-full mb-6"
                        >
                            {problemLabel}
                        </motion.span>
                        {problemContent}
                    </div>
                </motion.div>

                {/* Solution State */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
                    style={{
                        opacity: solutionOpacity,
                        filter: solutionBlurFilter,
                        scale: solutionScale,
                    }}
                >
                    <div className="max-w-4xl w-full">
                        <motion.span
                            className="inline-block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-6"
                        >
                            {solutionLabel}
                        </motion.span>
                        {solutionContent}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/**
 * ScrollReveal - Simple scroll-triggered reveal for any content
 */
export function ScrollReveal({
    children,
    delay = 0,
    direction = 'up', // 'up' | 'down' | 'left' | 'right'
    className = ''
}) {
    const prefersReducedMotion = useReducedMotion();

    const getInitialPosition = () => {
        switch (direction) {
            case 'down': return { y: -30 };
            case 'left': return { x: 30 };
            case 'right': return { x: -30 };
            case 'up':
            default: return { y: 30 };
        }
    };

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...getInitialPosition() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            viewport={{ once: true, margin: '-100px' }}
        >
            {children}
        </motion.div>
    );
}

export default ScrollytellingSection;
