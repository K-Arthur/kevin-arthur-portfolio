/**
 * iOS-Safe Motion Components
 * 
 * Wraps Framer Motion components with error boundaries and iOS-specific
 * optimizations to prevent crashes on WebKit.
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { isIOS, prefersReducedMotion } from '@/lib/ios-utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary specifically for motion-related crashes
 */
class MotionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Motion component error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="contents">{this.props.children}</div>;
    }
    return this.props.children;
  }
}

/**
 * Wrapper component that provides iOS-safe rendering
 * - Disables animations on iOS if they cause issues
 * - Respects reduced motion preferences
 * - Catches and handles Framer Motion errors gracefully
 */
interface IOSafeContainerProps {
  children: ReactNode;
  className?: string;
  disableOnIOS?: boolean;
}

export const IOSafeContainer: React.FC<IOSafeContainerProps> = ({
  children,
  className = '',
  disableOnIOS = true,
}) => {
  const isIOSDevice = typeof navigator !== 'undefined' && isIOS();
  const shouldReduceMotion = typeof window !== 'undefined' && prefersReducedMotion();
  
  // On iOS or reduced motion, render without animation wrappers
  if ((isIOSDevice && disableOnIOS) || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionErrorBoundary fallback={<div className={className}>{children}</div>}>
      <div className={className}>{children}</div>
    </MotionErrorBoundary>
  );
};

export { MotionErrorBoundary };
