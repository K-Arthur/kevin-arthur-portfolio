"use client";

import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function DottedGlowBackgroundDemo() {
  return (
    <div 
      className="relative flex size-60 items-end justify-end overflow-hidden rounded-md rounded-tl-3xl rounded-br-3xl rounded-bl-3xl border border-border/50 px-4 shadow-lg ring-1 shadow-black/10 ring-black/5 md:size-100 dark:shadow-white/10 dark:ring-white/5"
    >
      <img
        src="https://assets.aceternity.com/logos/calcom.png"
        className="absolute inset-0 z-20 m-auto size-10 md:size-20 dark:invert dark:filter"
        alt="Demo logo"
      />
      <div className="relative z-20 flex w-full justify-between px-2 py-3 backdrop-blur-[2px] md:px-4">
        <p className="text-xs font-normal text-muted-foreground md:text-sm">
          The modern call scheduling app
        </p>
        <p className="text-xs font-normal text-muted-foreground md:text-sm">
          &rarr;
        </p>
      </div>
      <DottedGlowBackground
        className="pointer-events-none"
        style={{
          maskImage: "radial-gradient(circle at center, black 0%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 90%)",
        }}
        opacity={1}
        gap={10}
        radius={1.6}
        color="hsl(230, 10%, 45%)"
        darkColor="hsl(240, 5%, 75%)"
        glowColor="hsl(220, 85%, 55%)"
        darkGlowColor="hsl(217, 100%, 76%)"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
    </div>
  );
}
