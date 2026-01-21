'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FaTimes, FaClipboardCheck, FaBrain } from 'react-icons/fa';
import LeadMagnetForm from './LeadMagnetForm';

const STORAGE_KEY = 'portfolio-lead-popup-dismissed';
const STORAGE_KEY_SHOWN = 'portfolio-lead-popup-shown-at';
const STORAGE_KEY_CONVERTED = 'portfolio-lead-converted';

/**
 * LeadMagnetPopup - Enhanced exit intent popup for lead magnet capture
 * 
 * Triggers:
 * - Exit intent (mouse leaves viewport top) - desktop only
 * - Scroll depth (user scrolled past threshold) - indicates engagement
 * - Time delay (configurable)
 * - Idle detection (no activity after engagement)
 * 
 * @param {string} resource - Which lead magnet to promote ('design-checklist' | 'ai-audit')
 * @param {number} delayMs - Time delay before showing (default: 45000ms / 45 seconds)
 * @param {boolean} exitIntent - Enable exit intent trigger
 * @param {string} pageType - Current page type for contextual messaging
 * @param {number} scrollThreshold - Scroll depth % to trigger (default: 65)
 * @param {boolean} scrollTrigger - Enable scroll depth trigger
 * @param {number} idleTimeMs - Idle time before showing (default: 25000ms)
 */
export default function LeadMagnetPopup({
  resource = 'design-checklist',
  delayMs = 45000,
  exitIntent = true,
  pageType = 'general',
  scrollThreshold = 65,
  scrollTrigger = true,
  idleTimeMs = 25000,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const hasTriggeredRef = useRef(false);
  const hasEngagedRef = useRef(false);
  const idleTimerRef = useRef(null);

  const content = {
    'design-checklist': {
      icon: FaClipboardCheck,
      title: 'Before You Go...',
      contextTitle: {
        healthtech: 'Liked This Healthcare Case Study?',
        ai: 'Building AI Products Too?',
        general: 'Before You Go...',
      },
      subtitle: 'Get my 12-point checklist for shipping designs that developers actually love.',
      buttonText: 'Get the Free Checklist',
    },
    'ai-audit': {
      icon: FaBrain,
      title: 'Is Your UX AI-Ready?',
      contextTitle: {
        healthtech: 'Adding AI to Your HealthTech Product?',
        ai: 'How Ready Is Your UX for AI?',
        general: 'Is Your UX AI-Ready?',
      },
      subtitle: 'Take the 2-minute audit to find out before you invest in development.',
      buttonText: 'Start the Free Audit',
      isQuiz: true,
    },
  };

  const currentContent = content[resource];
  const Icon = currentContent.icon;
  const title = currentContent.contextTitle[pageType] || currentContent.contextTitle.general;

  const showPopup = useCallback(() => {
    // Prevent multiple triggers
    if (hasTriggeredRef.current) return;

    // Skip if user already converted (submitted a form)
    const hasConverted = localStorage.getItem(STORAGE_KEY_CONVERTED) === 'true';
    if (hasConverted) return;

    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    if (wasDismissed) return;

    // Check if shown recently (within 12 hours - reduced from 24)
    const lastShown = localStorage.getItem(STORAGE_KEY_SHOWN);
    if (lastShown) {
      const hoursSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursSinceShown < 12) return;
    }

    hasTriggeredRef.current = true;
    setIsVisible(true);
    localStorage.setItem(STORAGE_KEY_SHOWN, Date.now().toString());
  }, []);

  // Reset idle timer on user activity
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Only start idle timer if user has engaged (scrolled/clicked)
    if (hasEngagedRef.current) {
      idleTimerRef.current = setTimeout(() => {
        showPopup();
      }, idleTimeMs);
    }
  }, [idleTimeMs, showPopup]);

  // Mark user as engaged
  const markEngaged = useCallback(() => {
    if (!hasEngagedRef.current) {
      hasEngagedRef.current = true;
      resetIdleTimer();
    }
  }, [resetIdleTimer]);

  useEffect(() => {
    // Check initial dismissed state
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    const hasConverted = localStorage.getItem(STORAGE_KEY_CONVERTED) === 'true';
    setIsDismissed(wasDismissed || hasConverted);
    if (wasDismissed || hasConverted) return;

    // Time delay trigger (fallback)
    const timer = setTimeout(() => {
      showPopup();
    }, delayMs);

    // Exit intent trigger (desktop only - mouse leaves top of viewport)
    const handleMouseLeave = (e) => {
      if (!exitIntent) return;
      // Only trigger if mouse leaves from the top (y <= 0)
      // and mouse was moving upward (indicates intent to leave)
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Scroll depth trigger
    const handleScroll = () => {
      if (!scrollTrigger) return;
      markEngaged();

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= scrollThreshold) {
        // User has scrolled past threshold - start exit intent watching more aggressively
        // but don't show popup immediately (let them finish reading)
      }
    };

    // Activity tracking for idle detection
    const handleActivity = () => {
      resetIdleTimer();
    };

    // Attach event listeners
    if (typeof window !== 'undefined') {
      if (exitIntent) {
        document.addEventListener('mouseleave', handleMouseLeave);
      }
      if (scrollTrigger) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
      // Track activity for idle detection
      document.addEventListener('mousemove', handleActivity, { passive: true });
      document.addEventListener('click', markEngaged);
      document.addEventListener('keydown', handleActivity, { passive: true });
    }

    return () => {
      clearTimeout(timer);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (typeof window !== 'undefined') {
        document.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousemove', handleActivity);
        document.removeEventListener('click', markEngaged);
        document.removeEventListener('keydown', handleActivity);
      }
    };
  }, [delayMs, exitIntent, scrollTrigger, scrollThreshold, showPopup, markEngaged, resetIdleTimer]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  if (isDismissed && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <m.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <m.div
            className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-magnet-title"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Close popup"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 id="lead-magnet-title" className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground">
                  {currentContent.subtitle}
                </p>
              </div>

              {currentContent.isQuiz ? (
                <div className="space-y-4">
                  <a
                    href="/lab#ai-audit"
                    className="w-full group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-glow font-semibold px-6 py-4 rounded-xl transition-all"
                    onClick={handleDismiss}
                  >
                    {currentContent.buttonText}
                  </a>
                  <button
                    onClick={handleDismiss}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    No thanks, I'll figure it out
                  </button>
                </div>
              ) : (
                <>
                  <LeadMagnetForm
                    resource={resource}
                    buttonText={currentContent.buttonText}
                    successMessage="Check your inbox! It's on its way."
                    showName={false}
                    variant="compact"
                  />
                  <button
                    onClick={handleDismiss}
                    className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    No thanks, I'm just browsing
                  </button>
                </>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
