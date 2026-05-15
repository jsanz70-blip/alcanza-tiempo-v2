const CACHE_NAME = 'tareas-app-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Delete old caches when a new version is activated
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network First strategy: try network, fall back to cache if offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Optionally cache the new response here, but for now we just return it
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
