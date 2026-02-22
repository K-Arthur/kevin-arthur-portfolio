"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Type } from 'lucide-react';

// Color palette updated to match actual Kamen Rider: Rising Impact game UI
const palette = [
    {
        name: "Impact Orange",
        hex: "#FF6B35",
        description: "Primary title color. Used for headings like 'MISSION SELECT' and 'DIFFICULTY SELECT'. Bold, energetic, unmissable.",
        wcagLight: { ratio: "3.2:1", status: "AA Large" },
        wcagDark: { ratio: "7.4:1", status: "AAA" }
    },
    {
        name: "Rider Teal",
        hex: "#00C9B7",
        description: "Primary accent and UI chrome. Used for borders, info panels, and selection highlights. Creates the 'tech' feel.",
        wcagLight: { ratio: "2.5:1", status: "Decorative Only" },
        wcagDark: { ratio: "9.1:1", status: "AAA" }
    },
    {
        name: "Cream White",
        hex: "#F5F3EB",
        description: "Secondary text and menu items. Warm off-white that's easier on the eyes than pure white in dark environments.",
        wcagLight: { ratio: "1.1:1", status: "N/A" },
        wcagDark: { ratio: "16.8:1", status: "AAA" }
    },
    {
        name: "Deep Black",
        hex: "#0A0A0A",
        description: "Primary background. Near-pure black for maximum contrast and that cinematic, premium feel.",
        wcagLight: { ratio: "19.4:1", status: "AAA" },
        wcagDark: { ratio: "1:1", status: "N/A" }
    },
    {
        name: "Crimson Glow",
        hex: "#C41E3A",
        description: "Accent for danger/power states. Used for the Rider suit's glowing elements and critical UI states.",
        wcagLight: { ratio: "4.8:1", status: "AA" },
        wcagDark: { ratio: "5.2:1", status: "AA" }
    },
];

export default function ColorPaletteExplorer() {
    const [activeColor, setActiveColor] = useState(null);
    const [showContrastTest, setShowContrastTest] = useState(false);

    return (
        <div className="w-full max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-xl">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="text-xs font-mono text-primary tracking-widest uppercase">{"// Color System"}</span>
                    <h3 className="text-xl font-bold text-foreground mt-1">Rising Impact Palette</h3>
                    <p className="text-sm text-muted-foreground mt-2">Click a color to explore details.</p>
                </div>

                <button
                    onClick={() => setShowContrastTest(!showContrastTest)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${showContrastTest
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-muted-foreground border-border hover:border-primary/50'
                        }`}
                >
                    <Type className="w-4 h-4" />
                    {showContrastTest ? 'Hide Text Test' : 'Test Contrast'}
                </button>
            </div>

            {/* Color Swatches */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                {palette.map((color) => (
                    <motion.button
                        key={color.hex}
                        onClick={() => setActiveColor(activeColor?.hex === color.hex ? null : color)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            relative w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden
                            ${activeColor?.hex === color.hex ? 'ring-4 ring-offset-4 ring-offset-background ring-primary' : 'hover:shadow-xl'}
                        `}
                        style={{
                            backgroundColor: color.hex,
                            boxShadow: color.hex === '#0A0A0A'
                                ? 'inset 0 0 0 2px rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.1)'
                                : color.hex === '#F5F3EB'
                                    ? 'inset 0 0 0 2px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'
                                    : undefined
                        }}
                        aria-label={`Select ${color.name}`}
                    >
                        {showContrastTest ? (
                            <div className="flex flex-col items-center gap-1 w-full px-1">
                                <span style={{ color: '#0A0A0A' }} className="text-[10px] font-bold leading-tight text-center">Abc</span>
                                <span style={{ color: '#F5F3EB' }} className="text-[10px] font-bold leading-tight text-center">Abc</span>
                            </div>
                        ) : (
                            activeColor?.hex === color.hex && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-white/20 backdrop-blur-md p-2 rounded-full"
                                >
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </motion.div>
                            )
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Expanded Info Panel */}
            <AnimatePresence mode="wait">
                {activeColor && (
                    <motion.div
                        key={activeColor.hex}
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 rounded-xl border border-border bg-background/80 mt-4 space-y-4 shadow-inner">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-lg shadow-md flex-shrink-0 border border-white/10"
                                    style={{ backgroundColor: activeColor.hex }}
                                />
                                <div>
                                    <h4 className="font-bold text-lg text-foreground">{activeColor.name}</h4>
                                    <p className="text-xs font-mono text-muted-foreground uppercase">{activeColor.hex}</p>
                                </div>
                            </div>

                            <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">{activeColor.description}</p>

                            {/* WCAG Contrast Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                                {/* Light Mode Context */}
                                <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-2 right-2 opacity-50">☀️</div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">On Light Bg</p>

                                    <div className="flex items-end justify-between mb-2">
                                        <p className="text-2xl font-black text-gray-900">{activeColor.wcagLight.ratio}</p>
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${activeColor.wcagLight.status.includes('AAA') ? 'bg-green-100 text-green-700' :
                                            activeColor.wcagLight.status.includes('AA') ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            {activeColor.wcagLight.status.includes('N/A') ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                            {activeColor.wcagLight.status}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Sample Text:</p>
                                    <p style={{ color: activeColor.hex }} className="text-sm font-bold truncate mt-1">The quick brown fox</p>
                                </div>

                                {/* Dark Mode Context */}
                                <div className="p-4 rounded-lg bg-[#0A0A0A] border border-gray-800 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-2 right-2 opacity-50">🌙</div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-2">On Dark Bg</p>

                                    <div className="flex items-end justify-between mb-2">
                                        <p className="text-2xl font-black text-white">{activeColor.wcagDark.ratio}</p>
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${activeColor.wcagDark.status.includes('AAA') ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                                            activeColor.wcagDark.status.includes('AA') ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' :
                                                'bg-red-900/20 text-red-400 border border-red-900/30'
                                            }`}>
                                            {activeColor.wcagDark.status.includes('N/A') ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                            {activeColor.wcagDark.status}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Sample Text:</p>
                                    <p style={{ color: activeColor.hex }} className="text-sm font-bold truncate mt-1">The quick brown fox</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
