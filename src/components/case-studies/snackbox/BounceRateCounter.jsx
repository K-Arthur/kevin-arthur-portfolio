"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useInView } from "framer-motion";

function CountUp({ to, start = 0, duration = 2, isInView }) {
    const [count, setCount] = useState(start);

    useEffect(() => {
        if (!isInView) return;
        let startTime;
        let animationFrame;

        const update = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            // Ease out quart
            const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
            const percentage = Math.min(progress / (duration * 1000), 1);
            const easedProgress = easeOutQuart(percentage);

            setCount(Math.floor(start + (to - start) * easedProgress));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(update);
            }
        };

        animationFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrame);
    }, [to, start, duration, isInView]);

    return <>{count}</>;
}

function CounterItem({ value, label, prefix = "", suffix = "%", color = "text-foreground" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="text-center p-6 bg-card/50 backdrop-blur border border-border rounded-2xl shadow-lg transform transition-transform hover:scale-105 duration-300">
            <div className={`text-4xl md:text-5xl font-black mb-3 ${color} tabular-nums`}>
                {prefix}
                <CountUp to={value} isInView={isInView} />
                {suffix}
            </div>
            <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
    );
}

export default function BounceRateCounter() {
    return (
        <div className="w-full max-w-4xl mx-auto my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <CounterItem value={32} label="Lower Bounce Rate" prefix="↓" color="text-pink-600 dark:text-pink-400" />
            <CounterItem value={45} label="Increase in Search" prefix="+" color="text-violet-600 dark:text-violet-400" />
            <CounterItem value={15} label="CTA Engagement" prefix="+" color="text-amber-600 dark:text-amber-400" />
        </div>
    );
}
