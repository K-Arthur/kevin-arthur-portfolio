'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function InlineContactForm({ onSuccess }) {
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate network request
        setTimeout(() => {
            setStatus('success');
            if (onSuccess) {
                setTimeout(onSuccess, 3000);
            }
        }, 1500);
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center"
            >
                <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
            </motion.div>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 text-left w-full max-w-xl mx-auto bg-background/40 p-6 md:p-8 rounded-2xl border border-border/30 backdrop-blur-md shadow-sm"
        >
            {status === 'error' && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg flex items-center gap-2 text-sm">
                    <FaExclamationCircle />
                    There was an error sending your message. Please try again.
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                        type="text"
                        id="name"
                        required
                        disabled={status === 'submitting'}
                        className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-muted-foreground/50"
                        placeholder="Your Name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        id="email"
                        required
                        disabled={status === 'submitting'}
                        className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-muted-foreground/50"
                        placeholder="Your Email"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                    id="message"
                    required
                    rows={4}
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none placeholder:text-muted-foreground/50"
                    placeholder="Tell me about your project..."
                />
            </div>
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
                {status === 'submitting' ? (
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                    <>
                        <FaPaperPlane className="w-4 h-4" />
                        Send Message
                    </>
                )}
            </button>
        </motion.form>
    );
}
