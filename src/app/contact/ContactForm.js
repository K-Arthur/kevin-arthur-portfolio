'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { getContextualMessage } from '@/data/contact-config';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    const contextualMessage = getContextualMessage({
      source: searchParams.get('source'),
      caseStudyTitle: searchParams.get('caseStudyTitle'),
    });

    if (contextualMessage) {
      setMessage(contextualMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xojnpqrv', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="card-base p-8 prevent-sticky-cta">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Send Me a Message</h2>
        <p className="text-muted-foreground">
          Tell me about the role or the team. I&apos;ll get back to you within 24 hours.
        </p>
      </div>

      {formStatus === 'success' && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center" role="status">
          <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
        </div>
      )}

      {formStatus === 'error' && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-center gap-3" role="alert">
          <FaExclamationCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-destructive text-sm">
            There was an error sending your message. Please try again or email me directly at{' '}
            <a href="mailto:hello@kevinarthur.design" className="underline">hello@kevinarthur.design</a>
          </p>
        </div>
      )}

      {formStatus !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                required
                className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows="6"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
              placeholder="Role, team, or what you'd like to talk about..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={formStatus === 'submitting'}
            className="w-full bg-primary text-primary-foreground py-4 px-8 rounded-xl text-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formStatus === 'submitting' ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
