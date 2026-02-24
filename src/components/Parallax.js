'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { isIOS, isMobile } from '@/lib/ios-utils';

export default function Parallax({ children, offset = 50, className = '' }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Only enable animations after mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setIsMobileDevice(isMobile() || isIOS());
  }, []);

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

  // Server-side and initial client render: no motion (prevents hydration mismatch)
  // Also disable if user prefers reduced motion or on mobile/iOS to prevent scroll blur
  if (!isMounted || prefersReducedMotion || isMobileDevice) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
