'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

const navLinks = [
  { href: '/about', label: 'About', icon: '👤' },
  { href: '/case-studies', label: 'Case Studies', icon: '📁' },
  { href: '/lab', label: 'Lab', icon: '🧪' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);


  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    // Return focus to trigger button
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 100);
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
  }, [mobileMenuOpen, closeMobileMenu]);

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



  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
        ? 'glass-premium'
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
          {/* Logo - CSS-only hover effect */}
          <div className="flex-shrink-0 lg:flex-1">
            <div className="magnetic-button">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold gradient-text-brand 
                           hover:scale-[1.03] active:scale-[0.98] 
                           transition-transform duration-200
                           focus:outline-none focus-visible:ring-2 
                           focus-visible:ring-primary focus-visible:ring-offset-2 
                           focus-visible:ring-offset-background focus-visible:rounded-md"
                aria-label="Kevin Arthur - Home"
                onClick={closeMobileMenu}
              >
                Kevin Arthur
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 bg-card/30 border border-border/20 rounded-full px-4 py-2 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-3 min-h-[44px] inline-flex items-center text-sm font-medium transition-colors duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-foreground'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10 transition-all duration-300"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="hidden lg:flex lg:flex-1 items-center justify-end gap-4">
            <ThemeSwitcher />
            <Button asChild size="default" className="rounded-full px-6 min-h-[44px]">
              <Link href="/contact">
                Get in touch
              </Link>
            </Button>
          </div>

          {/* Mobile menu button - CSS animations */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3" style={{ contain: 'layout', minWidth: '80px' }}>
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
              <div className="flex flex-col justify-center items-center w-6 h-6">
                <span 
                  className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : 'rotate-0 translate-y-0'
                  }`} 
                />
                <span 
                  className={`block h-0.5 w-5 bg-current rounded-full mt-1.5 transition-all duration-200 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'
                  }`} 
                />
                <span 
                  className={`block h-0.5 w-5 bg-current rounded-full mt-1.5 transition-all duration-200 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : 'rotate-0 translate-y-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Sheet Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        navLinks={navLinks}
      />
    </header>
  );
};

export default Header;
