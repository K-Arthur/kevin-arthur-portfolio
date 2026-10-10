"use client";
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * CSS scroll-reveal — no framer-motion on the homepage card path.
 * Respects prefers-reduced-motion.
 */
export default function ScrollRevealContainer({
    children,
    variant = "slideUp",
    duration = 0.6,
    delay = 0,
    staggerChildren = 0,
    viewportMargin = "-100px",
    once = true,
    className = "",
    as: Tag = "div",
    immediate = false,
}) {
    const ref = useRef(null);
    const [shown, setShown] = useState(immediate);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    if (once) io.disconnect();
                } else if (!once) {
                    setShown(false);
                }
            },
            { rootMargin: viewportMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [once, viewportMargin]);

    return (
        <Tag
            ref={ref}
            className={cn('scroll-reveal', shown && 'scroll-reveal-in', className)}
            style={{
                '--scroll-reveal-duration': `${duration}s`,
                '--scroll-reveal-delay': `${delay}s`,
            }}
            data-variant={variant}
            data-stagger={staggerChildren || undefined}
        >
            {children}
        </Tag>
    );
}

export function ScrollRevealItem({
    children,
    className = "",
    as: Tag = "div"
}) {
    return <Tag className={className}>{children}</Tag>;
}
