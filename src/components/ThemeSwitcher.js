'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from '@/lib/icons';

const ThemeSwitcher = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className={`
        relative w-10 h-10 rounded-full 
        bg-white/30 dark:bg-gray-800/30 
        backdrop-blur-sm shadow-lg 
        border border-white/20 dark:border-gray-700/20
        flex items-center justify-center
        transition-all duration-200
        hover:bg-white/40 dark:hover:bg-gray-800/40
        hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.8 : 1,
          rotate: isDark ? -180 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <FaSun className="w-4 h-4 text-yellow-500" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0.8,
          rotate: isDark ? 0 : 180
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <FaMoon className="w-4 h-4 text-blue-300" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher; 