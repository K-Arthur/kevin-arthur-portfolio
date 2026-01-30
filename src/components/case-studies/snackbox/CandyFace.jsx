"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function CandyFace() {
    return (
        <div className="w-full max-w-sm mx-auto my-12 relative group cursor-pointer">
            <div className="absolute inset-0 bg-[#FF4081] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

            <div className="relative bg-white dark:bg-zinc-800 p-8 rounded-3xl border-4 border-[#FF4081]/20 shadow-2xl flex flex-col items-center overflow-hidden">
                <h4 className="text-xs font-black text-[#FF4081] uppercase tracking-[0.2em] mb-8">Asset Reconstruction</h4>

                <motion.div
                    className="relative w-40 h-40"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Face Logic: Bouncing Animation */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            scaleY: [1, 1.05, 0.95, 1]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut"
                        }}
                        className="w-full h-full relative"
                    >
                        {/* Left Eye - Gummy Drop */}
                        <div className="absolute top-8 left-4 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-[inset_-2px_-4px_6px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15)] flex justify-center items-center">
                            <div className="w-4 h-2 bg-white/40 rounded-full absolute top-2 left-2 blur-[1px]"></div>
                        </div>

                        {/* Right Eye - Gummy Drop */}
                        <div className="absolute top-8 right-4 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-[inset_-2px_-4px_6px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15)] flex justify-center items-center">
                            <div className="w-4 h-2 bg-white/40 rounded-full absolute top-2 left-2 blur-[1px]"></div>
                        </div>

                        {/* Mouth - Peach Ring */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full shadow-lg flex items-center justify-center p-1">
                            <div className="w-full h-full bg-white dark:bg-zinc-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"></div>
                            <div className="absolute w-20 h-20 border-2 border-white/20 rounded-full"></div>
                        </div>
                    </motion.div>

                    {/* Shadow */}
                    <motion.div
                        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-sm"
                    ></motion.div>
                </motion.div>

                <p className="mt-8 text-xs font-bold text-muted-foreground">Interactive CSS Component (No Image)</p>
            </div>
        </div>
    );
}
