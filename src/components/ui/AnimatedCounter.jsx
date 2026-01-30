"use client";
import { useRef, useState, useEffect } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * AnimatedCounter - Animates a number from 0 to target value on scroll-in
 * 
 * Features:
 * - Triggers on first scroll into view
 * - Handles various number formats (97%, 500+, 15x, etc.)
 * - Respects reduced motion preferences
 * - Customizable duration and easing
 */
export default function AnimatedCounter({
    value,
    duration = 2000,
    delay = 0,
    className = "",
    formatFunc = null
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const shouldReduceMotion = useReducedMotion();
    const [displayValue, setDisplayValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Parse the numeric portion and suffix from the value
    const parseValue = (val) => {
        const str = String(val);
        const numMatch = str.match(/^([0-9.]+)/);
        const numericPart = numMatch ? parseFloat(numMatch[1]) : 0;
        const suffix = str.replace(/^[0-9.]+/, '');
        return { numericPart, suffix };
    };

    const { numericPart: targetValue, suffix } = parseValue(value);

    useEffect(() => {
        if (!isInView || hasAnimated) return;

        // If reduced motion, show final value immediately
        if (shouldReduceMotion) {
            setDisplayValue(targetValue);
            setHasAnimated(true);
            return;
        }

        // Animate the counter
        const startTime = Date.now() + delay;
        let animationFrame;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;

            if (elapsed < 0) {
                // Still in delay period
                animationFrame = requestAnimationFrame(animate);
                return;
            }

            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = targetValue * eased;

            // Format based on whether target is integer or decimal
            if (Number.isInteger(targetValue)) {
                setDisplayValue(Math.round(current));
            } else {
                setDisplayValue(parseFloat(current.toFixed(1)));
            }

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplayValue(targetValue);
                setHasAnimated(true);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, targetValue, duration, delay, hasAnimated, shouldReduceMotion]);

    const formattedValue = formatFunc
        ? formatFunc(displayValue)
        : displayValue;

    return (
        <span ref={ref} className={className}>
            {formattedValue}{suffix}
        </span>
    );
}
