"use client";
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { isIOS, isMobile } from '@/lib/ios-utils';

/**
 * ReadingProgress - A sleek progress indicator for long-form content
 * 
 * Features:
 * - Fixed position at top of viewport
 * - Respects reduced motion preferences
 * - Theme-aware (uses CSS variables)
 * - Performance optimized with requestAnimationFrame
 * - Disabled animation on mobile/iOS to prevent scroll blur
 */
export default function ReadingProgress({
    color = "var(--primary)",
    height = 3,
    showPercentage = false,
    className = ""
}) {
    const [progress, setProgress] = useState(0);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    
    useEffect(() => {
        setIsMobileDevice(isMobile() || isIOS());
    }, []);

    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                const currentProgress = (window.scrollY / scrollHeight) * 100;
                setProgress(Math.min(100, Math.max(0, currentProgress)));
            }
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Progress bar */}
            <motion.div
                className={`fixed top-0 left-0 z-50 ${className}`}
                style={{
                    height: `${height}px`,
                    background: `hsl(${color})`,
                    width: shouldReduceMotion ? `${progress}%` : undefined,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={shouldReduceMotion || isMobileDevice ? { duration: 0 } : {
                    duration: 0.1,
                    ease: "linear"
                }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Reading progress"
            />

            {/* Optional percentage display */}
            {showPercentage && progress > 5 && (
                <motion.div
                    className="fixed top-2 right-4 z-50 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-muted-foreground border border-border/50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {Math.round(progress)}%
                </motion.div>
            )}
        </>
    );
}
