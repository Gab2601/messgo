const CACHE_NAME = "messgo-cache-v1";

const urlsToCache = [
  "index.html",
  "manifest.json",
  "icon.png",
  // Fichiers essentiels
  "/",
];

// Installation : mise en cache initiale
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // active immédiatement
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
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
  self.clients.claim(); // prend le contrôle immédiatement
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si trouvé dans le cache, on sert ça
      if (cachedResponse) return cachedResponse;

      // Sinon, on essaie le réseau et on met à jour le cache
      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // En cas d’échec (hors-ligne), on peut gérer ici un fallback
          // return caches.match('/offline.html');
        });
    })
  );
});

