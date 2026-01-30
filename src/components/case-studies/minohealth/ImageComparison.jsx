"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ImageComparison({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

    const handleStart = () => setIsResizing(true);
    const handleEnd = () => setIsResizing(false);

    const handleMove = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
        if (!isResizing) return;
        handleMove(e.touches[0].clientX);
    };

    const handleClick = (e) => {
        // Allow clicking to jump to position
        handleMove(e.clientX);
    }

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsResizing(false);
        const handleGlobalTouchEnd = () => setIsResizing(false);

        window.addEventListener("mouseup", handleGlobalMouseUp);
        window.addEventListener("touchend", handleGlobalTouchEnd);
        return () => {
            window.removeEventListener("mouseup", handleGlobalMouseUp);
            window.removeEventListener("touchend", handleGlobalTouchEnd);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-xl overflow-hidden cursor-crosshair select-none my-12 border border-border shadow-2xl"
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={handleClick}
        >
            {/* Background Image (Right/After) */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={afterImage}
                    alt={afterLabel}
                    fill
                    className="object-cover"
                    priority={false}
                />
            </div>

            {/* Foreground Image (Left/Before) with Clip Path */}
            <div
                className="absolute top-0 left-0 bottom-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={beforeImage}
                    alt={beforeLabel}
                    fill
                    className="object-cover"
                    priority={false}
                />
            </div>

            {/* Slider Handle Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-none"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Handle Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform active:scale-90 transition-transform z-30">
                    <div className="flex gap-1">
                        <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                        <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Labels */}
            <span className="absolute top-6 left-6 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md z-10 border border-white/10">{beforeLabel}</span>
            <span className="absolute top-6 right-6 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md z-10 border border-white/10">{afterLabel}</span>
        </div>
    );
}
