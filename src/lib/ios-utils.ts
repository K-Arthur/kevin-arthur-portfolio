/**
 * iOS and mobile device detection utilities
 * Used to conditionally disable expensive animations
 */

export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (typeof window !== 'undefined' && window.innerWidth < 768);
};

export const isLowPowerDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for low-end device indicators
  const hasLowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
  const hasLowCores = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
  const isMobileDevice = isMobile();
  
  return isMobileDevice && (hasLowMemory || hasLowCores);
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const shouldDisableAnimations = (): boolean => {
  return isIOS() || prefersReducedMotion() || isLowPowerDevice();
};

export const getDeviceQuality = (): 'low' | 'medium' | 'high' => {
  if (isIOS() || isLowPowerDevice()) return 'low';
  if (isMobile()) return 'medium';
  return 'high';
};
