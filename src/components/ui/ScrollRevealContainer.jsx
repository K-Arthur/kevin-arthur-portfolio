"use client";
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * ScrollRevealContainer - Wrapper for scroll-triggered reveal animations
 * 
 * Features:
 * - Multiple animation variants (fade, slide, scale)
 * - Stagger support for child elements
 * - Respects reduced motion preferences
 * - Customizable viewport margin and threshold
 */

const variants = {
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    },
    slideUp: {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    },
    slideDown: {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0 }
    },
    slideRight: {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0 }
    },
    scale: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 }
    }
};

export default function ScrollRevealContainer({
    children,
    variant = "slideUp",
    duration = 0.6,
    delay = 0,
    staggerChildren = 0,
    viewportMargin = "-100px",
    once = true,
    className = "",
    as = "div"
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        margin: viewportMargin
    });
    const shouldReduceMotion = useReducedMotion();

    const selectedVariant = variants[variant] || variants.slideUp;

    // If reduced motion, show immediately without animation
    if (shouldReduceMotion) {
        const Component = as;
        return (
            <Component ref={ref} className={className}>
                {children}
            </Component>
        );
    }

    const MotionComponent = motion[as] || motion.div;

    return (
        <MotionComponent
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: selectedVariant.hidden,
                visible: {
                    ...selectedVariant.visible,
                    transition: {
                        duration,
                        delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        staggerChildren: staggerChildren > 0 ? staggerChildren : undefined
                    }
                }
            }}
        >
            {children}
        </MotionComponent>
    );
}

/**
 * ScrollRevealItem - Child component for staggered animations
 * Use inside ScrollRevealContainer with staggerChildren > 0
 */
export function ScrollRevealItem({
    children,
    className = "",
    as = "div"
}) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        const Component = as;
        return <Component className={className}>{children}</Component>;
    }

    const MotionComponent = motion[as] || motion.div;

    return (
        <MotionComponent
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
        >
            {children}
        </MotionComponent>
    );
}
