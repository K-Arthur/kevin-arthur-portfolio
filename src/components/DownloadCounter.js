'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaArrowUp } from '@/lib/icons';

const DOWNLOAD_STORAGE_KEY = 'download-counter';
const BASE_COUNT = 2347; // Base count to start with

export default function DownloadCounter({ className = '' }) {
  const [count, setCount] = useState(BASE_COUNT);
  const [displayCount, setDisplayCount] = useState(BASE_COUNT);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load count from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(DOWNLOAD_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCount(parsed.count);
          setDisplayCount(parsed.count);
        }
      } catch (error) {
        console.error('Error loading download count:', error);
      }
    }
  }, []);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    setIsAnimating(true);

    // Animate the counter
    let start = displayCount;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(start + (newCount - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DOWNLOAD_STORAGE_KEY, JSON.stringify({
          count: newCount,
          timestamp: Date.now(),
        }));
      } catch (error) {
        console.error('Error saving download count:', error);
      }
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 cursor-pointer hover:bg-primary/20 transition-all"
        onClick={incrementCount}
        title="Click to simulate a download"
      >
        <div className="relative">
          <FaDownload className="w-5 h-5 text-primary" />
          {isAnimating && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-primary/30 rounded-full"
            />
          )}
        </div>
        <span className="text-foreground font-medium">
          Downloaded <span className="font-bold text-primary">{displayCount.toLocaleString()}</span> times this month
        </span>
        <FaArrowUp className="w-4 h-4 text-green-500" />
      </motion.div>
    </div>
  );
}
