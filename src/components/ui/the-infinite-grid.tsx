import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  const maskImage = useMotionTemplate`radial-gradient(${revealRadius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const gridLayerClass = fullPage 
    ? "fixed inset-0 z-0" 
    : "absolute inset-0 z-0";

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
      {/* Base grid layer - always visible, very subtle */}
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

      {/* Revealed grid layer - follows mouse cursor */}
      <motion.div 
        className={gridLayerClass}
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

      {/* Ambient glow effects - very subtle, theme-aware */}
      <div className={cn("pointer-events-none z-0", fullPage ? "fixed inset-0" : "absolute inset-0")}>
        {/* Top-right primary glow - subtle */}
        <div className="absolute right-[-10%] top-[-10%] w-[30%] h-[30%] rounded-full bg-primary/10 dark:bg-primary/6 blur-[120px]" />
        {/* Top accent glow - subtle */}
        <div className="absolute right-[20%] top-[0%] w-[12%] h-[12%] rounded-full bg-accent/15 dark:bg-accent/10 blur-[100px]" />
        {/* Bottom-left secondary glow - subtle */}
        <div className="absolute left-[-5%] bottom-[-10%] w-[25%] h-[25%] rounded-full bg-primary/3 dark:bg-primary/2 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
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
