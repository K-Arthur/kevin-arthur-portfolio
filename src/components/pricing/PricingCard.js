'use client';

import { m } from 'framer-motion';
import { FaCheck, FaArrowRight, FaStar } from 'react-icons/fa';
import MagneticButton from '@/components/MagneticButton';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const PricingCard = ({ tier, index, isMonthly }) => {
    const isPopular = tier.popular;

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -8,
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
            borderColor: "rgba(255,255,255,0.2)",
            transition: { duration: 0.3 }
        }
    };

    return (
        <m.div
            custom={index}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            variants={cardVariants}
            className={`relative h-full flex flex-col p-6 rounded-2xl border backdrop-blur-xl transition-colors duration-300
        ${isPopular
                    ? 'bg-primary/5 border-primary/40 shadow-glow'
                    : 'bg-glass-gradient border-white/5 shadow-glass'
                }
      `}
        >
            {isPopular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 z-20">
                    <m.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-lg"
                    >
                        <FaStar className="w-3 h-3" /> {tier.tagline}
                    </m.span>
                </div>
            )}

            {/* Background Glow Effect - subtle/interactive */}
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
            />

            {/* Card Content */}
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-muted-foreground/60">/{tier.number}</span>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground tracking-tight text-balance group-hover:text-primary transition-colors">
                            {tier.name}
                        </h3>
                        <p className="mt-2 text-muted-foreground text-sm leading-relaxed text-pretty">
                            {tier.description}
                        </p>
                    </div>
                </div>

                {/* Price Display */}
                <div className="mb-8 p-6 bg-background/40 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold font-mono text-foreground tracking-tighter">
                            {isMonthly ? tier.monthlyPrice : tier.price}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">/{isMonthly ? tier.monthlyUnit : tier.unit}</span>
                    </div>
                    {/* Detail badge moved inside for better layout resonance */}
                    <div className="mt-2">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded inline-block">
                            {isMonthly ? tier.monthlyDetail : tier.priceDetail}
                        </span>
                    </div>
                </div>

                {/* Features List */}
                <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                        {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm group/item">
                                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300
                  ${isPopular
                                        ? 'border-primary/30 bg-primary/10 text-primary'
                                        : 'border-white/10 bg-white/5 text-muted-foreground group-hover/item:text-primary group-hover/item:border-primary/30'
                                    }`}>
                                    <FaCheck className="h-2.5 w-2.5" />
                                </span>
                                <span className="text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Call to Action */}
                <div className="mt-auto">
                    <MagneticButton
                        href={tier.ctaHref === '/contact' ? `/contact?plan=${tier.id}&billing=${isMonthly ? 'retainer' : 'project'}` : tier.ctaHref}
                        strength={0.2}
                        className={`w-full group/btn flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold transition-all duration-300
              ${isPopular
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                                : 'bg-secondary/80 text-foreground hover:bg-secondary border border-white/5 hover:border-white/10'
                            }`}
                    >
                        <span>{tier.cta}</span>
                        <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </MagneticButton>

                    {/* Trust/Guarantee Micro-copy */}
                    {index === 1 && (
                        <p className="mt-3 text-xs text-center text-muted-foreground/60">
                            100% Satisfaction Guarantee
                        </p>
                    )}
                </div>
            </div>
        </m.div>
    );
};

export default PricingCard;
