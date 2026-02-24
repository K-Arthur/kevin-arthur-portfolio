'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCalendarAlt, FaTimes, FaArrowRight } from '@/lib/icons';

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
    const [isFormVisible, setIsFormVisible] = useState(false); // Track form visibility

    // Check localStorage and set up scroll listener
    useEffect(() => {
        const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
        setIsDismissed(wasDismissed);

        if (wasDismissed) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY > scrollThreshold);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollThreshold]);

    // Check for elements that should hide the CTA (like forms)
    useEffect(() => {
        if (isDismissed) return;

        const visibleForms = new Set();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        visibleForms.add(entry.target);
                    } else {
                        visibleForms.delete(entry.target);
                    }
                });
                setIsFormVisible(visibleForms.size > 0);
            },
            { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
        );

        // Function to observe all currently existing forms
        const observeForms = () => {
            const avoidElements = document.querySelectorAll('.prevent-sticky-cta');
            avoidElements.forEach(el => observer.observe(el));
        };

        // Initial check
        observeForms();

        // Mutation observer to catch dynamically rendered forms (e.g., lazy loaded)
        const mutationObserver = new MutationObserver(() => {
            observeForms();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [isDismissed]);

    const handleDismiss = () => {
        setIsDismissed(true);
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    id="sticky-cta-container"
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: isFormVisible ? 100 : 0,
                        opacity: isFormVisible ? 0 : 1
                    }}
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

                        {/* CTA Button */}
                        <a
                            href={schedulingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex w-full shadow-lg items-center justify-center gap-3 btn-primary-enhanced font-bold text-lg px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            <FaCalendarAlt className="w-5 h-5" />
                            Book a Quick Chat
                            <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
