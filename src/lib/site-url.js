/**
 * Canonical public origin for metadata, sitemap, robots, and JSON-LD.
 * Override with NEXT_PUBLIC_SITE_URL; default is the www production host.
 */
export const DEFAULT_SITE_URL = 'https://www.kevinarthur.design';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl().replace(/\/$/, '');
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}
