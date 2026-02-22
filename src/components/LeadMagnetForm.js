'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaSpinner, FaEnvelope, FaRedo } from 'react-icons/fa';
import { addLeadScorePoints } from '@/lib/lead-scoring';
import { trackFormEvent, trackEmailCapture } from '@/lib/analytics-store';

/**
 * LeadMagnetForm - Reusable email capture component for lead magnets
 *
 * @param {string} resource - Identifier for the lead magnet ('design-checklist' | 'ai-audit')
 * @param {string} buttonText - CTA button text
 * @param {string} successMessage - Message shown after successful submission
 * @param {boolean} showName - Whether to show the name field
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Visual variant ('default' | 'compact' | 'inline')
 * @param {object} quizAnswers - Quiz answers for AI audit report generation
 * @param {number} quizScore - Quiz score for AI audit report generation
 */
export default function LeadMagnetForm({
  resource = 'design-checklist',
  buttonText = 'Get the Free Checklist',
  successMessage = "Check your inbox! Your resource is on its way.",
  showName = true,
  className = '',
  variant = 'default',
  onSuccess,
  onConversion,
  quizAnswers = {},
  quizScore = 0,
}) {
  const [formData, setFormData] = useState({ name: '', email: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error, verification
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Honeypot field name – hidden from users, bots tend to fill it; API rejects if non-empty
  const HONEYPOT_NAME = 'website';

  // Track form view when component mounts
  useEffect(() => {
    if (!hasTrackedView) {
      trackFormEvent('view', window.location.pathname);
      setHasTrackedView(true);
    }
  }, [hasTrackedView]);

  // Track form start for lead scoring and analytics
  useEffect(() => {
    if (!hasTrackedStart && (formData.name || formData.email)) {
      addLeadScorePoints('START_CHECKLIST_FORM', {
        resource,
        timestamp: Date.now(),
      });
      trackFormEvent('start', window.location.pathname);
      setHasTrackedStart(true);
    }
  }, [formData.name, formData.email, hasTrackedStart, resource]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          resource,
          [HONEYPOT_NAME]: formData.website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Specific error mapping
        if (!navigator.onLine) {
          setErrorMessage('No internet connection. Please check your network and try again.');
        } else if (response && response.status === 429) {
          setErrorMessage('Too many requests. Please wait a moment and try again.');
        } else {
          setErrorMessage(data.error || 'Something went wrong. Please try again or contact me directly.');
        }
        setStatus('error');
        return; // Exit function after setting error
      }

      // Honeypot triggered: API returned success but did not subscribe; do not run success path
      if (data.honeypotReject) {
        setStatus('success');
        return;
      }

      if (data.requiresVerification) {
        setStatus('verification');
        setVerificationUrl(data.verificationUrl || '');
        return;
      }

      setStatus('success');
      if (onSuccess) onSuccess();
      if (onConversion) onConversion();

      // Track form completion and email capture
      trackFormEvent('complete', window.location.pathname);
      trackEmailCapture(resource);

      // Track lead scoring based on resource type
      if (resource === 'design-checklist') {
        addLeadScorePoints('DOWNLOAD_CHECKLIST', {
          email: formData.email,
          name: formData.name,
          uniqueId: formData.email, // Prevent duplicate scoring for same email
        });
      } else if (resource === 'ai-audit') {
        addLeadScorePoints('REQUEST_AI_REPORT', {
          email: formData.email,
          name: formData.name,
          score: quizScore,
          uniqueId: formData.email,
        });
      } else if (resource.includes('waitlist')) {
        addLeadScorePoints('JOIN_WAITLIST', {
          email: formData.email,
          resource,
          uniqueId: formData.email,
        });
      }

      // Mark user as converted (prevents future popups)
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio-lead-converted', 'true');
      }

      // Auto-download personalized PDF for design-checklist
      if (resource === 'design-checklist') {
        const pdfUrl = formData.name
          ? `/api/generate-checklist-pdf?name=${encodeURIComponent(formData.name)}`
          : '/api/generate-checklist-pdf';
        window.open(pdfUrl, '_blank');
      } else if (resource === 'ai-audit' && Object.keys(quizAnswers).length > 0) {
        // Generate AI audit PDF with quiz answers
        const pdfResponse = await fetch('/api/generate-checklist-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            type: 'ai-audit',
            answers: quizAnswers,
          }),
        });

        if (pdfResponse.ok) {
          const pdfBlob = await pdfResponse.blob();
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const filename = formData.name
            ? `AI-Readiness-Audit-for-${formData.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
            : 'AI-Readiness-Audit.pdf';

          // Create download link and trigger download
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pdfUrl);
        }
      }

      // Track conversion
      if (typeof window !== 'undefined') {
        // Plausible
        if (window.plausible) {
          window.plausible('Lead Magnet Signup', { props: { resource } });
        }
        // GA4
        if (window.gtag) {
          window.gtag('event', 'lead_magnet_signup', {
            resource_name: resource,
            source: variant,
          });
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to subscribe. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          resource,
          [HONEYPOT_NAME]: formData.website,
        }),
      });

      const data = await response.json();

      if (response.ok && data.requiresVerification) {
        setVerificationUrl(data.verificationUrl || '');
        setStatus('verification');
      } else {
        setStatus('error');
        setErrorMessage('Failed to resend verification email.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to resend verification email.');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Honeypot: hidden input, never focused; bots fill it, API ignores submission if set
  const honeypotInput = (
    <div className="absolute -left-[9999px] h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
      <label htmlFor={`${HONEYPOT_NAME}-${resource}`}>Leave blank</label>
      <input
        type="text"
        id={`${HONEYPOT_NAME}-${resource}`}
        name={HONEYPOT_NAME}
        value={formData.website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );

  // Verification state UI
  if (status === 'verification') {
    return (
      <div className={`prevent-sticky-cta ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Check your email!</h3>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a verification link to <strong>{formData.email}</strong>. Please click it to confirm your subscription and get your resource.
          </p>

          {/* Development only: Show verification link */}
          {process.env.NODE_ENV === 'development' && verificationUrl && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Development Mode:</p>
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {verificationUrl}
              </a>
            </div>
          )}

          <button
            onClick={handleResendVerification}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors disabled:opacity-50"
          >
            <FaRedo className="w-4 h-4" />
            <span>Resend verification email</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Inline variant (single row)
  if (variant === 'inline') {
    return (
      <div className={`prevent-sticky-cta ${className}`}>
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-500 font-medium"
            >
              <FaCheck className="w-4 h-4" />
              <span>{successMessage}</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 h-full"
            >
              {honeypotInput}
              <div className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border-2 border-border/50 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all bg-card">
                <label htmlFor={`email-${resource}-inline`} className="sr-only">Email address</label>
                <input
                  type="email"
                  id={`email-${resource}-inline`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-1 px-4 py-3.5 bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground text-foreground text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3.5 transition-all hover:bg-primary/90 disabled:opacity-50 min-w-[140px]"
                >
                  {status === 'loading' ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span className="text-sm">{buttonText}</span>
                      <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        {status === 'error' && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Compact variant (stacked, minimal)
  if (variant === 'compact') {
    return (
      <div className={`prevent-sticky-cta ${className}`}>
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheck className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-foreground font-medium">{successMessage}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {honeypotInput}
              <label htmlFor={`email-${resource}-compact`} className="sr-only">Email address</label>
              <input
                type="email"
                id={`email-${resource}-compact`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full px-4 py-3 bg-card border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-glow font-bold px-4 py-3.5 rounded-xl transition-all disabled:opacity-50 text-sm shadow-xl shadow-primary/20"
              >
                {status === 'loading' ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {status === 'error' && (
          <p className="text-red-500 text-xs mt-2 text-center">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Default variant (full form)
  return (
    <div className={`prevent-sticky-cta ${className}`}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaCheck className="w-6 h-6 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-2">You&apos;re all set!</h3>
            <p className="text-muted-foreground">{successMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {honeypotInput}
            {showName && (
              <div>
                <label htmlFor={`name-${resource}`} className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id={`name-${resource}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your first name"
                  className="w-full px-4 py-3 bg-card border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
                />
              </div>
            )}
            <div>
              <label htmlFor={`email-${resource}`} className="block text-sm font-medium text-foreground mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id={`email-${resource}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-card border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-glow font-semibold px-6 py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>{buttonText}</span>
                  <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-3 text-center"
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  );
}
