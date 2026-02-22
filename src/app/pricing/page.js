'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { pricingTiers, faqs } from '@/data/pricing';
import PricingCard from '@/components/pricing/PricingCard';
import PricingSwitch from '@/components/pricing/PricingSwitch';
import ComparisonTable from '@/components/pricing/ComparisonTable';
import { FaPlus, FaMinus } from 'react-icons/fa';

// Lazy Load Heavy Visuals
const InfiniteGridBackground = dynamic(() => import('@/components/ui/the-infinite-grid').then(mod => mod.InfiniteGridBackground), { ssr: false });

export default function PricingPage() {
    const [isMonthly, setIsMonthly] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <main className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20">

                {/* Background Layer */}
                <div className="fixed inset-0 z-0">
                    <InfiniteGridBackground />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
                </div>

                {/* Hero Section */}
                <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-secondary/50 border border-white/5 text-xs font-mono text-primary mb-4 backdrop-blur-md">
                            Currently Booking for March 2026
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
                            Ship Your Product in Weeks, Not Months.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
                            Fixed-scope packages with guaranteed delivery. From strategy to launch—no hourly surprises, no scope creep.
                        </p>

                        {/* ROI Stats */}
                        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">47+</span>
                                <span className="text-sm text-muted-foreground">products shipped</span>
                            </div>
                            <div className="w-px h-6 bg-border/50 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">4.6</span>
                                <span className="text-sm text-muted-foreground">week avg. delivery</span>
                            </div>
                            <div className="w-px h-6 bg-border/50 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">3.2x</span>
                                <span className="text-sm text-muted-foreground">avg. client ROI</span>
                            </div>
                        </div>

                        {/* Trust Signals */}
                        <div className="pt-6 flex items-center justify-center space-x-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Trusted by founders from</span>
                            <span className="text-sm font-bold text-foreground">Y Combinator</span>
                            <span className="text-sm font-bold text-foreground">Techstars</span>
                            <span className="text-sm font-bold text-foreground">Antler</span>
                        </div>
                    </motion.div>

                    {/* Pricing Controls */}
                    <div className="mt-8">
                        <PricingSwitch enabled={isMonthly} setEnabled={setIsMonthly} />
                    </div>
                </section>

                {/* Pricing Cards Grid */}
                <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                        {pricingTiers.map((tier, index) => (
                            <PricingCard
                                key={tier.id}
                                tier={tier}
                                index={index}
                                isMonthly={isMonthly}
                            />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-sm text-muted-foreground/60">
                            Not sure which plan is right for you? <a href="https://calendly.com/arthurkevin27/15min" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Book a free consultation</a>.
                        </p>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-32">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Feature Breakdown</h2>
                        <p className="text-muted-foreground mt-4">A detailed look at what&apos;s included in each partnership tier.</p>
                    </div>
                    <ComparisonTable />
                </section>

                {/* FAQ Section */}
                <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="group border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all hover:border-white/10"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex items-center justify-between w-full p-6 text-left cursor-pointer focus:outline-none"
                                    aria-expanded={openFaq === index}
                                >
                                    <span className="font-medium text-lg pr-8">{faq.question}</span>
                                    <span className={`flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                        {openFaq === index ? <FaMinus className="w-4 h-4 text-primary" /> : <FaPlus className="w-4 h-4 text-muted-foreground" />}
                                    </span>
                                </button>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative z-10 px-4 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl font-bold mb-6">Ready to ship your product?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Most projects start within 1-2 weeks. Book a free call to discuss your timeline.
                        </p>
                        
                        {/* Process Steps */}
                        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                                <span>15-min call</span>
                            </div>
                            <span className="text-muted-foreground/30">→</span>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                                <span>Proposal in 24hrs</span>
                            </div>
                            <span className="text-muted-foreground/30">→</span>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
                                <span>Kickoff & build</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact?source=pricing"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg"
                            >
                                Start Your Project
                            </a>
                            <a
                                href="https://calendly.com/arthurkevin27/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-secondary/80 text-foreground hover:bg-secondary border border-white/5 hover:border-white/10 transition-all"
                            >
                                Book a Free Call
                            </a>
                        </div>
                    </motion.div>
                </section>

                {/* Structured Data for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqs.map(faq => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.answer
                                }
                            }))
                        })
                    }}
                />

            </main>
    );
}
