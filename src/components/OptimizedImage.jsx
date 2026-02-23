'use client';

import Image from 'next/image';
import { optimizeCloudinaryUrl, generateCloudinarySrcSet, DEFAULT_SIZES } from '@/lib/cloudinary';

/**
 * OptimizedImage Component
 * 
 * A wrapper around Next.js Image component that automatically optimizes
 * Cloudinary URLs with modern formats (WebP/AVIF) and responsive sizing.
 * 
 * For non-Cloudinary images, it falls back to standard Next.js Image behavior.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  quality = 'auto',
  format = 'auto',
  crop = 'limit',
  priority = false,
  className,
  style,
  onLoad,
  onError,
  placeholder,
  blurDataURL,
  responsive = false,
  responsiveWidths = [640, 750, 828, 1080, 1200, 1600, 1920],
  ...props
}) {
  // Skip optimization for non-Cloudinary images or data URLs
  const isCloudinary = src && typeof src === 'string' && src.includes('res.cloudinary.com');
  
  if (!isCloudinary) {
    // Use standard Next.js Image for non-Cloudinary images
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
        style={style}
        onLoad={onLoad}
        onError={onError}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        {...props}
      />
    );
  }

  // Optimize the Cloudinary URL
  const optimizeOptions = {
    quality,
    format,
    crop,
  };

  // Add dimensions if provided
  if (width && !fill) optimizeOptions.width = width;
  if (height && !fill) optimizeOptions.height = height;

  const optimizedSrc = optimizeCloudinaryUrl(src, optimizeOptions);

  // Generate srcSet for responsive images if requested
  const srcSet = responsive
    ? generateCloudinarySrcSet(src, responsiveWidths, { quality, format, crop })
    : undefined;

  // Use provided sizes or default based on layout
  const finalSizes = sizes || (fill ? DEFAULT_SIZES.fullWidth : undefined);

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={finalSizes}
      srcSet={srcSet}
      priority={priority}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      {...props}
    />
  );
}

/**
 * CloudinaryImage Component
 * 
 * Specialized component for Cloudinary images with preset optimizations
 * for common use cases (featured, thumbnail, gallery, logo).
 */
export function CloudinaryImage({
  src,
  alt,
  preset = 'featured',
  fill,
  width,
  height,
  priority = false,
  className,
  style,
  sizes,
  ...props
}) {
  if (!src || typeof src !== 'string' || !src.includes('res.cloudinary.com')) {
    // Fall back to standard Image for non-Cloudinary URLs
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
        style={style}
        {...props}
      />
    );
  }

  const { optimizeCloudinaryUrl, generateCloudinarySrcSet, DEFAULT_SIZES, CLOUDINARY_PRESETS } = require('@/lib/cloudinary');
  
  const presetConfig = CLOUDINARY_PRESETS[preset] || CLOUDINARY_PRESETS.featured;
  const { widths, ...transformOptions } = presetConfig;

  // Apply specific dimensions if provided
  if (width) transformOptions.width = width;
  if (height) transformOptions.height = height;

  // Generate optimized URL
  const optimizedSrc = optimizeCloudinaryUrl(src, transformOptions);

  // Generate srcSet for responsive images
  const srcSet = generateCloudinarySrcSet(src, widths, {
    quality: presetConfig.quality,
    format: presetConfig.format,
    crop: presetConfig.crop,
  });

  // Determine sizes attribute
  const finalSizes = sizes || DEFAULT_SIZES[preset] || (fill ? DEFAULT_SIZES.fullWidth : undefined);

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={finalSizes}
      srcSet={srcSet}
      priority={priority}
      className={className}
      style={style}
      {...props}
    />
  );
}

export default OptimizedImage;
