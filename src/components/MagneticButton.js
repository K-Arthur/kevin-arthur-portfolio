'use client';

import { useRef, useState, useCallback } from 'react';
import { m, useSpring, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

/**
 * MagneticButton - A button component with magnetic hover behavior
 * 
 * The button subtly follows the cursor when hovered, creating a magnetic
 * attraction effect that signals interactivity and front-end craftsmanship.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.href - Optional link destination (renders as Link if provided)
 * @param {number} props.strength - Magnetic pull intensity (0-1), default 0.3
 * @param {number} props.radius - Activation radius in pixels, default 150
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Disabled state
 */
export default function MagneticButton({
    children,
    href,
    strength = 0.3,
    radius = 150,
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) {
    const buttonRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Spring configuration for smooth, physics-based animation
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };

    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);
    const scale = useSpring(1, springConfig);

    const handleMouseMove = useCallback((e) => {
        if (prefersReducedMotion || !buttonRef.current || disabled) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from cursor to button center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Only apply magnetic effect within radius
        if (distance < radius) {
            // Magnetic pull increases as cursor gets closer to center
            const pullStrength = (1 - distance / radius) * strength;
            x.set(distanceX * pullStrength);
            y.set(distanceY * pullStrength);
        }
    }, [prefersReducedMotion, strength, radius, x, y, disabled]);

    const handleMouseEnter = useCallback(() => {
        if (!disabled) {
            setIsHovered(true);
            scale.set(1.05);
        }
    }, [scale, disabled]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        // Smoothly return to original position
        x.set(0);
        y.set(0);
        scale.set(1);
    }, [x, y, scale]);

    const handleMouseDown = useCallback(() => {
        if (!disabled) {
            scale.set(0.95);
        }
    }, [scale, disabled]);

    const handleMouseUp = useCallback(() => {
        if (!disabled && isHovered) {
            scale.set(1.05);
        }
    }, [scale, disabled, isHovered]);

    // Common motion props
    const motionProps = {
        ref: buttonRef,
        style: prefersReducedMotion ? {} : { x, y, scale },
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        className: `magnetic-button ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        whileTap: prefersReducedMotion ? {} : { scale: 0.95 },
        ...props
    };

    // Render as Link if href is provided
    if (href && !disabled) {
        return (
            <m.div {...motionProps}>
                <Link
                    href={href}
                    className="magnetic-button-inner flex items-center justify-center gap-inherit w-full h-full"
                    style={{ gap: 'inherit' }}
                >
                    {children}
                </Link>
            </m.div>
        );
    }

    // Render as button
    return (
        <m.button
            {...motionProps}
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
        >
            {children}
        </m.button>
    );
}

/**
 * MagneticWrapper - Wraps any element with magnetic behavior
 * 
 * Use this to add magnetic effects to existing components without
 * changing their underlying implementation.
 */
export function MagneticWrapper({
    children,
    strength = 0.2,
    radius = 100,
    className = '',
}) {
    const ref = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = useCallback((e) => {
        if (prefersReducedMotion || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < radius) {
            const pullStrength = (1 - distance / radius) * strength;
            x.set(distanceX * pullStrength);
            y.set(distanceY * pullStrength);
        }
    }, [prefersReducedMotion, strength, radius, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <m.div
            ref={ref}
            style={{ x, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            {children}
        </m.div>
    );
}
