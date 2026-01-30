'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCalendarAlt, FaTimes, FaArrowRight } from 'react-icons/fa';

const STORAGE_KEY = 'portfolio-sticky-cta-dismissed';

/**
 * StickyCTA - A mobile-only sticky footer CTA that appears after scrolling
 * 
 * Features:
 * - Fixed position at bottom of viewport on mobile (≤768px)
 * - Appears only after scrolling past a threshold
 * - Glassmorphism styling
 * - Dismissible with localStorage persistence
 */
export default function StickyCTA({
    schedulingUrl = 'https://calendly.com/arthurkevin27/15min',
    emailAddress = 'hello@kevinarthur.design',
    scrollThreshold = 400,
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(true); // Start hidden until we check localStorage

    // Check localStorage and set up scroll listener
    useEffect(() => {
        // Check if component was previously dismissed
        const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
        setIsDismissed(wasDismissed);

        if (wasDismissed) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY > scrollThreshold);
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollThreshold]);

    const handleDismiss = () => {
        setIsDismissed(true);
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    // Don't render on desktop or if dismissed
    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <m.div
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4">
                        {/* Dismiss Button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-lg"
                            aria-label="Dismiss contact options"
                        >
                            <FaTimes className="w-3 h-3" />
                        </button>

                        {/* CTA Buttons */}
                        <div className="flex gap-3">
                            {/* Email Button */}
                            <a
                                href={`mailto:${emailAddress}`}
                                className="flex-1 inline-flex items-center justify-center gap-2 btn-secondary-enhanced font-semibold px-4 py-3 rounded-xl transition-all duration-300"
                                aria-label="Send an email"
                            >
                                <FaEnvelope className="w-4 h-4" />
                                <span>Email</span>
                            </a>

                            {/* Book Call Button */}
                            <a
                                href={schedulingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center justify-center gap-3 btn-primary-enhanced font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <FaCalendarAlt className="w-4 h-4" />
                                Book a 15-Min Call
                                <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
