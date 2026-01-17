'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { motion, AnimatePresence, useDragControls, useReducedMotion } from 'framer-motion';

const navLinks = [
  { href: '/about', label: 'About', icon: '👤' },
  { href: '/case-studies', label: 'Case Studies', icon: '📁' },
  { href: '/contact', label: 'Contact', icon: '✉️' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const dragControls = useDragControls();
  const prefersReducedMotion = useReducedMotion();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Lock body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focus trap for accessibility
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
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
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    // Return focus to trigger button
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 100);
  }, []);

  const handleDragEnd = useCallback((event, info) => {
    // Close if dragged down more than 100px or with velocity
    if (info.offset.y > 100 || info.velocity.y > 500) {
      closeMobileMenu();
    }
  }, [closeMobileMenu]);

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
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? 'bg-background/30 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
        }`}
      role="banner"
    >
      {/* Skip to main content link - only visible on focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 p-3 bg-card text-card-foreground font-medium rounded-md shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>

      <div className="container-responsive">
        <nav
          className="flex items-center justify-between h-20"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex-shrink-0 md:flex-1">
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className="text-2xl font-bold gradient-text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:rounded-md"
                aria-label="Kevin Arthur - Home"
                onClick={closeMobileMenu}
              >
                Kevin Arthur
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 bg-card/30 border border-border/20 rounded-full px-4 py-2 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      layoutId="active-nav-item"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="hidden md:flex md:flex-1 items-center justify-end">
            <ThemeSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeSwitcher />
            <button
              ref={triggerRef}
              type="button"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-bottom-sheet"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <motion.div
                animate={mobileMenuOpen ? 'open' : 'closed'}
                className="flex flex-col justify-center items-center w-6 h-6"
              >
                <motion.span
                  className="block h-0.5 w-5 bg-current rounded-full"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-5 bg-current rounded-full mt-1.5"
                  variants={{
                    closed: { opacity: 1, x: 0 },
                    open: { opacity: 0, x: -10 },
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-5 bg-current rounded-full mt-1.5"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Sheet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm md:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Bottom Sheet */}
            <motion.div
              ref={menuRef}
              id="mobile-menu-bottom-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
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
                            onClick={closeMobileMenu}
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

                {/* Home Link at Bottom */}
                <div className="px-4 pb-4 border-t border-border/30 pt-4">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                    onClick={closeMobileMenu}
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
    </header>
  );
};

export default Header;