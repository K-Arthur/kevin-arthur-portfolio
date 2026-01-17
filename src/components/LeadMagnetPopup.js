'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaClipboardCheck, FaBrain } from 'react-icons/fa';
import LeadMagnetForm from './LeadMagnetForm';

const STORAGE_KEY = 'portfolio-lead-popup-dismissed';
const STORAGE_KEY_SHOWN = 'portfolio-lead-popup-shown-at';

/**
 * LeadMagnetPopup - Exit intent or time-delayed popup for lead magnet capture
 * 
 * @param {string} resource - Which lead magnet to promote ('design-checklist' | 'ai-audit')
 * @param {number} delayMs - Time delay before showing (default: 60000ms / 60 seconds)
 * @param {boolean} exitIntent - Enable exit intent trigger
 * @param {string} pageType - Current page type for contextual messaging
 */
export default function LeadMagnetPopup({
  resource = 'design-checklist',
  delayMs = 60000,
  exitIntent = true,
  pageType = 'general',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

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
    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    if (wasDismissed) return;

    // Check if shown recently (within 24 hours)
    const lastShown = localStorage.getItem(STORAGE_KEY_SHOWN);
    if (lastShown) {
      const hoursSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursSinceShown < 24) return;
    }

    setIsVisible(true);
    localStorage.setItem(STORAGE_KEY_SHOWN, Date.now().toString());
  }, []);

  useEffect(() => {
    // Check initial dismissed state
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    setIsDismissed(wasDismissed);
    if (wasDismissed) return;

    // Time delay trigger
    const timer = setTimeout(() => {
      showPopup();
    }, delayMs);

    // Exit intent trigger (desktop only)
    const handleMouseLeave = (e) => {
      if (!exitIntent) return;
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    if (exitIntent && typeof window !== 'undefined') {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearTimeout(timer);
      if (exitIntent) {
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [delayMs, exitIntent, showPopup]);

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
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
