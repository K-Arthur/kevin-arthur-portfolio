'use client';

import { useState } from 'react';
import { FaCheck, FaArrowRight, FaCalendarAlt, FaEnvelope, FaChevronDown, FaStar, FaShieldAlt } from 'react-icons/fa';
import { HandWrittenTitle } from '@/components/ui/hand-writing-text';
import MagneticButton from '@/components/MagneticButton';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Lazy load background and effects
const InfiniteGridBackground = dynamic(
    () => import('@/components/ui/the-infinite-grid').then((mod) => mod.InfiniteGridBackground),
    { ssr: false }
);

const GlowingEffect = dynamic(
    () => import('@/components/ui/glowing-effect').then(mod => mod.GlowingEffect),
    { ssr: false }
);

const pricingTiers = [
    {
        id: 'discovery',
        number: '01',
        name: 'Discovery Sprint',
        tagline: 'Best for Startups & MVPs',
        description: 'Validate your product direction with research-backed design foundations.',
        price: '$1,200',
        priceEnd: '$1,800',
        unit: 'project',
        popular: false,
        cta: 'Get Started',
        ctaHref: '/contact',
        features: [
            'User Research & Stakeholder Interviews',
            'Competitive Analysis Report',
            'User Journey Mapping',
            'Lo-fi Wireframes (Figma)',
            'Research Report with Recommendations',
            '2-3 Week Delivery',
            '1 Round of Revisions',
            'Remote / Online Collaboration',
        ],
    },
    {
        id: 'design',
        number: '02',
        name: 'Design & Prototype',
        tagline: 'Most Popular',
        description: 'Full design execution from wireframes to interactive prototypes.',
        price: '$3,500',
        priceEnd: '$5,500',
        unit: 'project',
        popular: true,
        cta: 'Get Started',
        ctaHref: '/contact',
        features: [
            'Everything in Discovery Sprint',
            'Wireframe & Art Direction',
            'High-Fidelity UI Design (Figma)',
            'Interactive Prototyping',
            'Basic Design System Components',
            'WCAG 2.1 AA Accessibility Review',
            'Usability Testing (1 Round, 5 Users)',
            '4-6 Week Delivery',
            '2 Rounds of Revisions',
            '30 Days Post-Launch Support',
        ],
    },
    {
        id: 'custom',
        number: '03',
        name: 'Full Partnership',
        tagline: 'Enterprise & Complex Projects',
        description: 'End-to-end design and development for ambitious teams.',
        price: 'Custom',
        priceEnd: null,
        unit: 'quote',
        popular: false,
        cta: 'Contact Me',
        ctaHref: '/contact',
        features: [
            'Everything in Design & Prototype',
            'Detailed Wireframe & Prototyping',
            'Advanced Design with Figma',
            'Full-stack Implementation: React, Next.js',
            'Complete Design System Build',
            'Analytics & Tracking Setup (GA4)',
            'A/B Testing Strategy',
            'Priority Delivery & Communication',
            'Monthly Performance Reviews',
            'Dedicated Slack/Teams Channel',
        ],
    },
];

const faqs = [
    {
        question: "What if my project doesn't fit a tier?",
        answer: "No problem! Every project is unique. The tiers are starting points. Book a free 15-minute call and we'll discuss your specific needs and create a custom proposal that fits your budget and timeline.",
    },
    {
        question: "Do you offer payment plans?",
        answer: "Yes! Standard terms are 50% upfront to begin work, and 50% upon project completion. For larger projects, we can discuss milestone-based payments.",
    },
    {
        question: "What happens if the scope changes mid-project?",
        answer: "I use a transparent change order process. If requirements evolve, we'll discuss the impact on timeline and cost before proceeding. No surprises.",
    },
    {
        question: "Do you work with international clients?",
        answer: "Absolutely! I work remotely with clients across time zones. All prices are in CAD, but I can invoice in USD or EUR if preferred.",
    },
    {
        question: "What tools do you use?",
        answer: "Design: Figma (prototyping, design systems). Development: React, Next.js, TypeScript. Communication: Slack, Notion, Loom for async updates.",
    },
    {
        question: "How quickly can you start?",
        answer: "Depending on my current workload, I can typically start within 1-2 weeks. For urgent projects, let's discuss—I may be able to accommodate faster timelines.",
    },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-white/5 last:border-b-0">
        <button
            onClick={onClick}
            className="w-full py-5 flex items-center justify-between text-left group"
            aria-expanded={isOpen}
        >
            <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors text-balance">
                {question}
            </span>
            <FaChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                    }`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
        >
            <p className="text-muted-foreground leading-relaxed text-pretty">{answer}</p>
        </div>
    </div>
);

const BentoCard = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        className={`bento-card relative overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

const PricingCard = ({ tier, index }) => {
    const isPopular = tier.popular;

    return (
        <BentoCard delay={index + 2} className={`h-full ${isPopular ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        {tier.tagline}
                    </span>
                </div>
            )}

            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
            />

            {/* Header */}
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                    <span className="text-sm font-mono text-muted-foreground/60 block mb-2">/{tier.number}</span>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                        {tier.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed text-balance">
                        {tier.description}
                    </p>
                </div>

                {/* Price */}
                <div className="mb-8 p-4 bg-background/30 rounded-xl border border-white/5 backdrop-blur-sm">
                    {tier.priceEnd ? (
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-3xl font-bold text-foreground tracking-tight">
                                {tier.price}
                            </span>
                            <span className="text-xl font-bold text-muted-foreground">
                                –{tier.priceEnd}
                            </span>
                            <span className="text-xs text-muted-foreground w-full mt-1">/ {tier.unit}</span>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground tracking-tight uppercase">
                                {tier.price}
                            </span>
                            <span className="text-xs text-muted-foreground">/ {tier.unit}</span>
                        </div>
                    )}
                </div>

                {/* Features List */}
                <div className="flex-1 mb-8">
                    <ul className="space-y-3">
                        {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm group">
                                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isPopular ? 'border-primary/30 bg-primary/10 text-primary' : 'border-white/10 bg-white/5 text-muted-foreground group-hover:text-primary transition-colors'
                                    }`}>
                                    <FaCheck className="h-2.5 w-2.5" />
                                </span>
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    <MagneticButton
                        href={tier.ctaHref}
                        strength={0.2}
                        className={`w-full group/btn flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${isPopular
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                            : 'bg-secondary/50 text-foreground hover:bg-secondary/80 border border-white/5'
                            }`}
                    >
                        <span>{tier.cta}</span>
                        <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </MagneticButton>
                </div>
            </div>
        </BentoCard>
    );
};

const PricingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <InfiniteGridBackground
            className="min-h-screen"
            gridSize={50}
            speedX={0.25}
            speedY={0.2}
            revealRadius={350}
            baseOpacity={0.04}
            revealOpacity={0.45}
            fullPage={true}
        >
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 space-y-20">
                {/* Section 1: Header */}
                <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
                    <HandWrittenTitle
                        title="Pricing"
                        highlightedText="That Makes Sense"
                        subtitle="Transparent packages tailored to your needs. No hidden fees, just high-impact design."
                    />
                </div>

                {/* Trust Indicators - Linear Layout */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 animate-fade-in-up animation-delay-200">
                    {[
                        { icon: FaStar, text: '4.8/5 Client Satisfaction' },
                        { icon: FaCheck, text: '20+ Projects Delivered' },
                        { icon: FaCalendarAlt, text: '4+ Years Experience' },
                        { icon: FaShieldAlt, text: '100% Ownership' },
                    ].map((badge, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-white/5 text-sm text-foreground/80 backdrop-blur-md shadow-sm transition-transform duration-300 hover:scale-105 hover:bg-primary/5 hover:border-primary/20"
                        >
                            <badge.icon className="w-4 h-4 text-primary" />
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </div>

                {/* Section 2: Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

                    {/* Pricing Tiers - 3 cols each (spanning 2 grid cols each on standard 6-col grid) */}
                    <div className="md:col-span-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {pricingTiers.map((tier, index) => (
                            <PricingCard key={tier.id} tier={tier} index={index} />
                        ))}
                    </div>

                    {/* FAQ Section - Spans 4 cols */}
                    <BentoCard className="md:col-span-4 lg:col-span-4 flex flex-col justify-center" delay={4}>
                        <div className="p-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <span className="bg-primary/10 p-2 rounded-lg text-primary text-xl">?</span>
                                Common Questions
                            </h2>
                            <div className="space-y-1">
                                {faqs.slice(0, 4).map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        question={faq.question}
                                        answer={faq.answer}
                                        isOpen={openFaq === index}
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    />
                                ))}
                                <div className="pt-2">
                                    <button
                                        className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
                                        onClick={() => window.location.href = '/contact'}
                                    >
                                        Have more questions? Contact me <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Final Call to Action - Spans 2 cols */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/20 via-background/60 to-primary/5 text-center flex flex-col justify-center items-center p-8" delay={5}>
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 transform transition-transform hover:rotate-6">
                                <FaEnvelope className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                Need something custom?
                            </h3>
                            <p className="text-muted-foreground text-sm text-pretty">
                                Let's build a package that fits your specific requirements and budget.
                            </p>
                            <MagneticButton
                                href="/contact"
                                strength={0.3}
                                className="w-full inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-4 text-base rounded-xl shadow-xl"
                            >
                                <span>Let's Talk</span>
                                <FaArrowRight className="w-4 h-4" />
                            </MagneticButton>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </InfiniteGridBackground>
    );
};

export default PricingPage;
