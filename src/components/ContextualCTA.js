'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalendarAlt, FaEnvelope, FaArrowRight } from 'react-icons/fa';

/**
 * Industry-specific contextual messaging for CTAs
 */
const industryContent = {
    healthtech: {
        headline: "Need a designer who understands complex HealthTech?",
        subtext: "I specialize in making medical interfaces intuitive and accessible.",
    },
    saas: {
        headline: "Building a data-heavy SaaS platform?",
        subtext: "I can help make complexity feel simple for your users.",
    },
    fintech: {
        headline: "Creating financial tools that users trust?",
        subtext: "I design interfaces that balance security with usability.",
    },
    ai: {
        headline: "Designing AI-powered experiences?",
        subtext: "I bridge the gap between complex AI and human intuition.",
    },
    general: {
        headline: "Like what you see?",
        subtext: "Let's explore how we can work together on your next project.",
    },
};

/**
 * ContextualCTA - A flexible CTA component that adapts messaging based on context
 * 
 * @param {string} industry - One of: healthtech, saas, fintech, ai, general
 * @param {string} customHeadline - Optional custom headline override
 * @param {string} customSubtext - Optional custom subtext override
 * @param {string} schedulingUrl - URL for booking calls (defaults to contact page)
 * @param {boolean} showEmailOption - Whether to show email CTA alongside scheduling
 */
export default function ContextualCTA({
    industry = 'general',
    customHeadline,
    customSubtext,
    schedulingUrl = '/contact#schedule',
    showEmailOption = true,
}) {
    const content = industryContent[industry] || industryContent.general;
    const headline = customHeadline || content.headline;
    const subtext = customSubtext || content.subtext;

    return (
        <motion.div
            className="mt-16 py-12 px-6 md:px-10 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="text-center max-w-2xl mx-auto">
                <motion.p
                    className="text-2xl md:text-3xl font-bold text-foreground mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    {headline}
                </motion.p>
                <motion.p
                    className="text-lg text-muted-foreground mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {subtext}
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    {/* Primary CTA - Book a Call */}
                    <Link
                        href={schedulingUrl}
                        className="group inline-flex items-center justify-center gap-3 btn-primary-enhanced font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <FaCalendarAlt className="w-4 h-4" />
                        Book a 15-Min Call
                        <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    {/* Secondary CTA - Email */}
                    {showEmailOption && (
                        <a
                            href="mailto:hello@kevinarthur.design"
                            className="group inline-flex items-center justify-center gap-3 btn-secondary-enhanced font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <FaEnvelope className="w-4 h-4" />
                            Send an Email
                        </a>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
