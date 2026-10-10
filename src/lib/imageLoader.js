/**
 * Custom Next.js image loader for Cloudinary.
 *
 * When `images.loaderFile` is configured, Next.js calls this function for every
 * <Image> (and OptimizedImage / CloudinaryImage) to build the final URL. It
 * strips any existing transforms and emits a clean, responsive, modern-format
 * delivery URL: f_auto (WebP/AVIF), q_auto, c_limit, w_<deviceWidth>.
 *
 * This addresses the cross-site "modern-image-formats", "uses-responsive-images"
 * and "image-delivery-insight" opportunities for ALL images, not just the ones
 * that happen to pass through CloudinaryImage with a srcSet.
 *
 * Used only when passed as the `loader` prop on Cloudinary <Image>s.
 * Local images go through the default Next.js optimizer (AVIF/WebP).
 * Non-Cloudinary URLs are returned untouched if this loader is called anyway.
 *
 * @param {{ src: string, width: number, quality?: string|number }} params
 * @returns {string}
 */
export default function cloudinaryLoader({ src, width, quality }) {
  if (!src || typeof src !== 'string' || !src.includes('res.cloudinary.com')) {
    return src;
  }

  // Capture base + public id, discarding any prior transforms / version.
  const match = src.match(
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)(?:\/v\d+)?\/(.+?)(?:\?.*)?$/
  );
  if (!match) return src;

  const base = match[1];
  const publicId = match[2];
  const q = quality && quality !== 'auto' ? `q_${quality}` : 'q_auto';

  return `${base}/f_auto,${q},c_limit,w_${width}/${publicId}`;
}
