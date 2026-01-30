"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';

export default function ComparisonSlider({
    beforeImage = "https://res.cloudinary.com/dov1tv077/image/upload/v1769725624/Loading_Screen_llxrsj.png",
    afterImage = "https://res.cloudinary.com/dov1tv077/image/upload/v1769725668/Mission_Select_vcdg2w.png",
    beforeLabel = "Raw Environment",
    afterLabel = "HUD Overlay"
}) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef(null);
    const sliderRef = useRef(null);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((event) => {
        const step = event.shiftKey ? 10 : 5; // Shift for larger steps

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                event.preventDefault();
                setSliderPosition(prev => Math.max(0, prev - step));
                setHasInteracted(true);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                event.preventDefault();
                setSliderPosition(prev => Math.min(100, prev + step));
                setHasInteracted(true);
                break;
            case 'Home':
                event.preventDefault();
                setSliderPosition(0);
                setHasInteracted(true);
                break;
            case 'End':
                event.preventDefault();
                setSliderPosition(100);
                setHasInteracted(true);
                break;
            default:
                break;
        }
    }, []);

    const handleMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
        setHasInteracted(true);
    }, [isDragging]);

    const handleTouchMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
        setHasInteracted(true);
    }, [isDragging]);

    useEffect(() => {
        const handleUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchend', handleUp);
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleTouchMove);
        }

        return () => {
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isDragging, handleMove, handleTouchMove]);

    return (
        <div className="w-full max-w-5xl mx-auto my-12">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-xs font-mono text-primary tracking-widest uppercase">// Visual Hierarchy</span>
                    <h3 className="text-xl font-bold text-foreground mt-1">Controlled Chaos</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Drag the slider or use arrow keys to compare.
                    </p>
                </div>
            </div>

            <div
                ref={containerRef}
                className={`relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none shadow-2xl border group transition-all duration-200 ${isFocused
                        ? 'border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                        : 'border-border/50 hover:border-border'
                    }`}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
            >
                {/* Background Image (After - Right side usually, but layering logic means this is the base) */}
                <div className="absolute inset-0">
                    <Image
                        src={afterImage}
                        alt={`After: ${afterLabel}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/30">
                        {afterLabel}
                    </div>
                </div>

                {/* Foreground Image (Before - Left side, clipped) */}
                <div
                    className="absolute inset-0"
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                    <Image
                        src={beforeImage}
                        alt={`Before: ${beforeLabel}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                        {beforeLabel}
                    </div>
                </div>

                {/* Slider Handle - Now focusable with ARIA */}
                <div
                    ref={sliderRef}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(sliderPosition)}
                    aria-valuetext={`${Math.round(sliderPosition)}% showing ${beforeLabel}`}
                    aria-label={`Image comparison slider between ${beforeLabel} and ${afterLabel}`}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`absolute top-0 bottom-0 w-1 cursor-ew-resize transition-shadow focus:outline-none ${isFocused
                            ? 'bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]'
                            : 'bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                        }`}
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors ${isFocused
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white text-black'
                        }`}>
                        <MoveHorizontal className="w-5 h-5" />
                    </div>
                </div>

                {/* Instructions Overlay (fades out on interaction) */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isDragging || hasInteracted ? 'opacity-0' : 'opacity-100'
                    }`}>
                    <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs font-medium border border-white/10">
                        Drag or use ← → keys to compare
                    </div>
                </div>
            </div>
        </div>
    );
}

