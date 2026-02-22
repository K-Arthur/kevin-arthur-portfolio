'use client';

import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useDragControls, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function MobileMenu({ isOpen, onClose, navLinks }) {
    const pathname = usePathname();
    const menuRef = useRef(null);
    const dragControls = useDragControls();
    const prefersReducedMotion = useReducedMotion();

    // Close menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Lock body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Focus trap for accessibility
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const focusableElements = menuRef.current.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKey = (e) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);
            firstElement?.focus();

            return () => {
                document.removeEventListener('keydown', handleTabKey);
            };
        }
    }, [isOpen]);

    const handleDragEnd = useCallback((event, info) => {
        // Close if dragged down more than 100px or with velocity
        if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
        }
    }, [onClose]);

    // Bottom sheet spring animation config
    const bottomSheetVariants = {
        hidden: {
            y: '100%',
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                },
        },
        exit: {
            y: '100%',
            opacity: 0,
            transition: prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                },
        },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        ref={menuRef}
                        id="mobile-menu-bottom-sheet"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation menu"
                        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
                        variants={bottomSheetVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        drag="y"
                        dragControls={dragControls}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.3 }}
                        onDragEnd={handleDragEnd}
                    >
                        <div
                            className="bg-card rounded-t-3xl border-t border-x border-border/50 shadow-2xl"
                            style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
                        >
                            {/* Drag Handle */}
                            <div
                                className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
                            </div>

                            {/* Navigation Links */}
                            <nav className="px-4 pb-6 pt-2" aria-label="Mobile navigation">
                                <ul className="space-y-2">
                                    {navLinks.map((link, index) => {
                                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                        return (
                                            <motion.li
                                                key={link.href}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: prefersReducedMotion ? 0 : 0.05 * index,
                                                    duration: 0.2
                                                }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 ${isActive
                                                        ? 'bg-primary/15 text-primary'
                                                        : 'text-foreground hover:bg-muted active:scale-[0.98]'
                                                        }`}
                                                    onClick={onClose}
                                                    aria-current={isActive ? 'page' : undefined}
                                                >
                                                    <span className="text-2xl" aria-hidden="true">{link.icon}</span>
                                                    <span>{link.label}</span>
                                                    {isActive && (
                                                        <motion.span
                                                            className="ml-auto text-primary"
                                                            layoutId="mobile-active-indicator"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </motion.span>
                                                    )}
                                                </Link>
                                            </motion.li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            {/* Mobile Contact CTA */}
                            <div className="px-4 pb-4">
                                <Button asChild className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg shadow-primary/20">
                                    <Link href="/contact" onClick={onClose}>
                                        <span className="mr-2">✉️</span>
                                        Get in touch
                                    </Link>
                                </Button>
                            </div>

                            {/* Home Link at Bottom */}
                            <div className="px-4 pb-4 border-t border-border/30 pt-4">
                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                                    onClick={onClose}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Home</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
