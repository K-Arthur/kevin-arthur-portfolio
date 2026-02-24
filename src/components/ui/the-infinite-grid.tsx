import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame
} from "framer-motion";
import { isIOS, prefersReducedMotion, isMobile } from "@/lib/ios-utils";

interface InfiniteGridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  gridSize?: number;
  speedX?: number;
  speedY?: number;
  revealRadius?: number;
  baseOpacity?: number;
  revealOpacity?: number;
  fullPage?: boolean;
}

export const InfiniteGridBackground = ({
  className,
  children,
  gridSize = 40,
  speedX = 0.3,
  speedY = 0.3,
  revealRadius = 300,
  baseOpacity = 0.03,
  revealOpacity = 0.25,
  fullPage = false,
}: InfiniteGridBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // IntersectionObserver state

  useEffect(() => {
    setIsMounted(true);
    setIsMobileDevice(isMobile() || isIOS());
    setReducedMotion(prefersReducedMotion());
  }, []);

  // IntersectionObserver to pause animation when off-screen
  useEffect(() => {
    if (!containerRef.current || isMobileDevice || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '100px', // Start/pause slightly before/after entering viewport
        threshold: 0
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobileDevice, reducedMotion]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileDevice) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  // Throttle animation frame for mobile/low-power devices
  const lastFrameTime = useRef(0);
  const frameInterval = isMobileDevice ? 33 : 16; // 30fps on mobile, 60fps on desktop

  useAnimationFrame((time) => {
    // Skip frames for throttling
    if (time - lastFrameTime.current < frameInterval) return;
    lastFrameTime.current = time;

    // Pause animation when reduced motion is preferred or not visible
    if (reducedMotion || !isVisible) return;

    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  // Optimize for mobile: Disable expensive radial-gradient mask on small screens
  // and reduce opacity to minimize rendering overhead.
  const maskImage = useMotionTemplate`radial-gradient(${revealRadius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const gridLayerClass = fullPage
    ? "fixed inset-0 z-0"
    : "absolute inset-0 z-0";

  // Render simplified version for mobile/iOS to prevent performance issues
  if (!isMounted || isMobileDevice || reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full min-h-screen bg-background",
          className
        )}
      >
        {/* Static grid background - no animations */}
        <div 
          className={cn(gridLayerClass, "opacity-[0.02]")}
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full overflow-hidden",
        !fullPage && "bg-background",
        className
      )}
    >
      {/* Base Grid Layer - Persistent visibility */}
      <div
        className={gridLayerClass}
        style={{ opacity: baseOpacity }}
      >
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          gridSize={gridSize}
        />
      </div>

      {/* Reveal Grid Layer - Only visible on hover/desktop */}
      <motion.div
        className={cn(
          gridLayerClass,
          "hidden md:block" // Use CSS to hide this expensive layer on mobile
        )}
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          opacity: revealOpacity,
        }}
      >
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          gridSize={gridSize}
        />
      </motion.div>

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

interface GridPatternProps {
  offsetX: ReturnType<typeof useMotionValue<number>>;
  offsetY: ReturnType<typeof useMotionValue<number>>;
  gridSize: number;
}

const GridPattern = ({ offsetX, offsetY, gridSize }: GridPatternProps) => {
  const patternId = React.useId();

  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={patternId}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground/50 dark:text-foreground/40"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export default InfiniteGridBackground;
