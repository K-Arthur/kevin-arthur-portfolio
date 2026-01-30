"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeatmapToggle() {
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <div className="w-full max-w-sm mx-auto my-12 relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 group cursor-default">
            {/* Header */}
            <div className="absolute top-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/70 font-mono tracking-widest">SCAN ANALYSIS</span>
                    <span className="text-xs text-white font-bold">Chest PA View</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded px-2 py-1">
                    <span className="text-[10px] text-white/90 font-mono">CONF: 94%</span>
                </div>
            </div>

            {/* Base Image Container */}
            <div className="relative aspect-[4/5] w-full">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg"
                    alt="Chest X-Ray"
                    fill
                    className="object-cover opacity-90 grayscale contrast-125"
                    sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Heatmap Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showHeatmap ? 0.7 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 pointer-events-none mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle at 35% 45%, #ff0d0d 0%, #ff8e0d 25%, transparent 60%), radial-gradient(circle at 65% 55%, #ff0d0d 0%, #ff4e0d 20%, transparent 50%)',
                    }}
                />

                {/* Anomaly Graphic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: showHeatmap ? 1 : 0, scale: showHeatmap ? 1 : 0.8 }}
                    className="absolute top-[45%] left-[35%] w-16 h-16 border-2 border-red-500 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-center justify-center"
                >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`
                px-6 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-md border transition-all flex items-center gap-2
                ${showHeatmap
                            ? 'bg-white text-black border-white'
                            : 'bg-black/50 text-white border-white/30 hover:bg-black/70'
                        }
            `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {showHeatmap
                            ? <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                            : <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"><circle cx="12" cy="12" r="3" /></path>
                        }
                    </svg>
                    {showHeatmap ? "Hide Heatmap" : "View AI Focus"}
                </motion.button>
            </div>
        </div>
    );
}
