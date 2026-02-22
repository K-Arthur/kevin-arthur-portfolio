'use client';

import { motion } from 'framer-motion';

function HandWrittenDecoration() {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className="absolute -inset-x-6 -inset-y-4 md:-inset-x-12 md:-inset-y-6 pointer-events-none">
            <motion.svg
                width="100%"
                height="100%"
                viewBox="40 60 740 280"
                initial="hidden"
                animate="visible"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
            >
                <title>Decorative circle</title>
                <motion.path
                    d="M 680 120 
                   C 780 200, 750 320, 400 340
                   C 100 340, 40 280, 40 200
                   C 40 120, 150 60, 400 60
                   C 620 60, 680 140, 680 140"
                    fill="none"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={draw}
                    className="text-primary/60 dark:text-primary/50"
                    vectorEffect="non-scaling-stroke"
                />
            </motion.svg>
        </div>
    );
}

export default HandWrittenDecoration;
