'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-sm' 
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
          <div className="hidden md:flex items-center space-x-2 bg-card/50 border border-border/20 rounded-full px-4 py-2 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
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
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="absolute inset-x-0 top-full bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg pt-2 pb-4 px-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-md text-base font-semibold transition-colors duration-300 ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;