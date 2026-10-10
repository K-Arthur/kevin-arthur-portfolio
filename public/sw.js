/**
 * Legacy service worker.
 * The site no longer caches the home page (or anything else) in a SW.
 * This file only unregisters itself so returning visitors drop the old cache.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      const registrations = await self.registration.unregister();
      return registrations;
    })()
  );
});
