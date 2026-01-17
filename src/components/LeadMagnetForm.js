'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaSpinner } from 'react-icons/fa';

/**
 * LeadMagnetForm - Reusable email capture component for lead magnets
 * 
 * @param {string} resource - Identifier for the lead magnet ('design-checklist' | 'ai-audit')
 * @param {string} buttonText - CTA button text
 * @param {string} successMessage - Message shown after successful submission
 * @param {boolean} showName - Whether to show the name field
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Visual variant ('default' | 'compact' | 'inline')
 */
export default function LeadMagnetForm({
  resource = 'design-checklist',
  buttonText = 'Get the Free Checklist',
  successMessage = "Check your inbox! Your resource is on its way.",
  showName = true,
  className = '',
  variant = 'default',
}) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      
      // Auto-download PDF for design-checklist
      if (resource === 'design-checklist') {
        window.open('/api/generate-checklist-pdf', '_blank');
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Inline variant (single row)
  if (variant === 'inline') {
    return (
      <div className={className}>
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
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
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
      <div className={className}>
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
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full group inline-flex items-center justify-center gap-2 btn-primary-enhanced font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50 text-sm"
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
    <div className={className}>
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
            <h3 className="text-xl font-semibold text-foreground mb-2">You're all set!</h3>
            <p className="text-muted-foreground">{successMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
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
                  className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
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
                className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
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
