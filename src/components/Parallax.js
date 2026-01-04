'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

export default function Parallax({ children, offset = 50, className = '' }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 };
  
  // Use spring physics for smoother movement
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [offset, -offset]),
    springConfig
  );

  // If user prefers reduced motion, disable the effect
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
