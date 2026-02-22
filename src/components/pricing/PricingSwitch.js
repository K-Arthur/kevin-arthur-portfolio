'use client';

import { motion } from 'framer-motion';

const PricingSwitch = ({ enabled, setEnabled }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <div className="relative inline-flex p-1 rounded-full bg-secondary/30 border border-white/5 backdrop-blur-sm">
                {/* Project Option */}
                <button
                    onClick={() => setEnabled(false)}
                    className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${!enabled ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Project
                    {!enabled && (
                        <motion.div
                            layoutId="activePill"
                            className="absolute inset-0 bg-primary rounded-full shadow-glow -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>

                {/* Retainer Option */}
                <button
                    onClick={() => setEnabled(true)}
                    className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${enabled ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Retainer
                    {enabled && (
                        <motion.div
                            layoutId="activePill"
                            className="absolute inset-0 bg-primary rounded-full shadow-glow -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
            </div>

            {/* Dynamic Label/Badge */}
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2"
            >
                <span className="text-sm text-muted-foreground/60">
                    {enabled ? 'Monthly retainer' : 'One-time project fee'}
                </span>
                {enabled && (
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide border border-primary/20">
                            Priority Scheduling
                        </span>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide border border-primary/20">
                            Dedicated Capacity
                        </span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PricingSwitch;
