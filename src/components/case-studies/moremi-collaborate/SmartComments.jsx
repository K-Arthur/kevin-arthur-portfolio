"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartComments() {
    const [pins, setPins] = useState([
        { x: 20, y: 30, id: 1, text: "Verify patient ID here", isNew: false }
    ]);
    const [activePin, setActivePin] = useState(null);

    const handleImageClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Prevent drawing outside sensible bounds
        if (x > 95 || y > 95) return;

        const newPin = { x, y, id: Date.now(), text: "", isNew: true };
        setPins([...pins, newPin]);
        setActivePin(newPin.id);
    };

    const handleSave = (id, text) => {
        setPins(pins.map(p => p.id === id ? { ...p, text, isNew: false } : p));
        setActivePin(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-12">
            <div className="text-center mb-4">
                <span className="text-xs font-mono text-muted-foreground border border-border px-2 py-1 rounded-full">INTERACTIVE DEMO</span>
                <p className="text-sm font-medium mt-2">Click anywhere on the report to add a collaborative annotation.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl overflow-hidden shadow-2xl relative aspect-[16/10] cursor-crosshair group select-none transition-shadow hover:shadow-primary/5" onClick={handleImageClick}>
                {/* Mock Report Content */}
                <div className="absolute inset-0 p-8 md:p-12 opacity-80 pointer-events-none">
                    <div className="flex justify-between items-start mb-8 border-b pb-4">
                        <div className="w-32 h-6 bg-current opacity-10 rounded"></div>
                        <div className="w-24 h-20 bg-current opacity-5 rounded"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="col-span-1 h-32 bg-current opacity-5 rounded-lg"></div>
                        <div className="col-span-2 space-y-3">
                            <div className="w-full h-3 bg-current opacity-10 rounded"></div>
                            <div className="w-5/6 h-3 bg-current opacity-10 rounded"></div>
                            <div className="w-full h-3 bg-current opacity-10 rounded"></div>
                            <div className="w-4/6 h-3 bg-current opacity-10 rounded"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="w-1/4 h-4 bg-current opacity-10 rounded mb-2"></div>
                        <div className="w-full h-2 bg-current opacity-5 rounded"></div>
                        <div className="w-full h-2 bg-current opacity-5 rounded"></div>
                        <div className="w-full h-2 bg-current opacity-5 rounded"></div>
                    </div>
                </div>

                {/* Pins */}
                {pins.map(pin => (
                    <div
                        key={pin.id}
                        className="absolute"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        onClick={(e) => { e.stopPropagation(); setActivePin(pin.id); }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                            className={`
                            w-8 h-8 -ml-4 -mt-4 rounded-full border-[3px] border-white dark:border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.2)] 
                            flex items-center justify-center cursor-pointer transition-colors z-10
                            ${activePin === pin.id ? 'bg-primary ring-4 ring-primary/20' : 'bg-primary group-hover:bg-primary/90'}
                        `}
                        >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </motion.div>

                        {/* Tooltip Card */}
                        <AnimatePresence>
                            {activePin === pin.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute top-6 left-0 w-56 bg-card border border-border shadow-2xl rounded-xl p-3 z-50 text-left origin-top-left"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-muted-foreground">Dr. Arthur</span>
                                    </div>
                                    <input
                                        autoFocus
                                        type="text"
                                        defaultValue={pin.text}
                                        placeholder="Type your comment..."
                                        className="w-full bg-secondary/50 rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave(pin.id, e.target.value)}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                const newPins = pins.filter(p => p.id !== pin.id);
                                                setPins(newPins);
                                            }}
                                            className="text-[10px] text-muted-foreground hover:text-red-500 px-2 py-1"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={(e) => handleSave(pin.id, e.target.previousSibling.value)}
                                            className="text-[10px] bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-md hover:bg-primary/90"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
