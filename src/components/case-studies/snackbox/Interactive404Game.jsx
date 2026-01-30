"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Interactive404Game() {
    const [candies, setCandies] = useState([]);

    const spawnCandy = () => {
        const id = Date.now() + Math.random();
        const type = Math.floor(Math.random() * 4);
        const x = Math.random() * 80 + 10;
        setCandies(prev => [...prev, { id, type, x }]);

        setTimeout(() => {
            setCandies(prev => prev.filter(c => c.id !== id));
        }, 2500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-2xl -z-10"></div>

            <div className="h-72 border-2 border-dashed border-pink-200 dark:border-pink-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">

                <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                    OBJECTS: {candies.length}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        // Spawn multiple at once for fun
                        for (let i = 0; i < 3; i++) setTimeout(spawnCandy, i * 100);
                    }}
                    className="z-10 bg-[#FF4081] hover:bg-[#F50057] text-white font-black py-4 px-8 rounded-full shadow-[0_4px_14px_rgba(255,64,129,0.4)] border-b-4 border-[#C51162] active:border-b-0 active:translate-y-1 transition-all"
                >
                    DO NOT PRESS
                </motion.button>
                <p className="mt-4 text-sm font-bold text-[#FF4081]/70">Seriously, don't.</p>

                <AnimatePresence>
                    {candies.map(candy => (
                        <motion.div
                            key={candy.id}
                            initial={{ y: -100, x: 0, rotate: 0 }}
                            animate={{
                                y: 400,
                                rotate: Math.random() > 0.5 ? 360 : -360,
                                x: (Math.random() - 0.5) * 50
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, type: "spring", bounce: 0.25 }}
                            className="absolute top-0 text-3xl md:text-5xl pointer-events-none drop-shadow-lg"
                            style={{ left: `${candy.x}%` }}
                        >
                            {['🧸', '🍬', '🍭', '🍪'][candy.type]}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-2 bg-pink-100 dark:bg-pink-900/30"></div>
            </div>
        </div>
    );
}
