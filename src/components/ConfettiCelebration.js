'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

/**
 * ConfettiCelebration Component
 * 
 * Displays confetti celebration animation using canvas-confetti
 * Supports different celebration types and intensities
 */

export default function ConfettiCelebration({
  trigger = false,
  intensity = 'medium',
  onComplete,
  className = ''
}) {
  const confettiRef = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;
      triggerConfetti();

      // Reset after animation
      setTimeout(() => {
        hasTriggered.current = false;
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [trigger, onComplete, triggerConfetti]);

  const triggerConfetti = useCallback(() => {
    const duration = intensity === 'high' ? 3000 : intensity === 'low' ? 1500 : 2000;
    const particleCount = intensity === 'high' ? 150 : intensity === 'low' ? 50 : 100;
    const spread = intensity === 'high' ? 100 : intensity === 'low' ? 50 : 70;

    // Main burst from center
    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    // Secondary burst
    setTimeout(() => {
      confetti({
        particleCount: particleCount / 2,
        spread: spread / 2,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 200);

    // Third burst
    setTimeout(() => {
      confetti({
        particleCount: particleCount / 3,
        spread: spread / 3,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#8b5cf6'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 400);
  }, [intensity]);

  return <div ref={confettiRef} className={className} />;
}

/**
 * ConfettiButton Component
 * 
 * Button that triggers confetti celebration on click
 */
export function ConfettiButton({
  children,
  onClick,
  intensity = 'medium',
  className = '',
  ...props
}) {
  const [trigger, setTrigger] = useState(false);

  const handleClick = (e) => {
    setTrigger(true);
    if (onClick) onClick(e);

    // Reset trigger after a short delay
    setTimeout(() => setTrigger(false), 100);
  };

  return (
    <>
      <ConfettiCelebration trigger={trigger} intensity={intensity} />
      <button
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    </>
  );
}

/**
 * ContinuousConfetti Component
 * 
 * Displays continuous confetti rain effect
 */
export function ContinuousConfetti({
  active = false,
  duration = 5000,
  className = ''
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        confetti({
          particleCount: 3,
          spread: 70,
          origin: { y: -0.1 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
          disableForReducedMotion: true,
          zIndex: 9999,
        });
      }, 100);

      // Stop after duration
      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, duration);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [active, duration]);

  return <div className={className} />;
}

/**
 * SideCannonsConfetti Component
 * 
 * Displays confetti cannons from the sides
 */
export function SideCannonsConfetti({
  trigger = false,
  onComplete,
  className = ''
}) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;
      triggerSideCannons();

      setTimeout(() => {
        hasTriggered.current = false;
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [trigger, onComplete]);

  const triggerSideCannons = () => {
    // Left cannon
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      angle: 45,
      colors: ['#3b82f6', '#10b981'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        angle: 135,
        colors: ['#f59e0b', '#ef4444'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 200);

    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: 0.5, y: 0.7 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 400);
  };

  return <div className={className} />;
}

/**
 * ConfettiScoreDisplay Component
 * 
 * Displays a score with confetti celebration
 */
export function ConfettiScoreDisplay({
  score,
  maxScore,
  trigger = false,
  label = 'Your Score',
  className = ''
}) {
  return (
    <div className={`relative ${className}`}>
      <ConfettiCelebration trigger={trigger} intensity="high" />
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">{label}</div>
        <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
          {score}
        </div>
        <div className="text-lg text-muted-foreground">
          / {maxScore}
        </div>
      </div>
    </div>
  );
}
