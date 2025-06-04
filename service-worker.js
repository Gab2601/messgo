const CACHE_NAME = "snapclone-cache-v1.2";
const urlsToCache = [
  "index.html",
  "manifest.json",
  "icon.png",
  "icon.png"
];

// Installation : mise en cache initiale
self.addEventListener("install", event => {
  self.skipWaiting(); // active immédiatement cette version du service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activation : suppression des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // contrôle immédiat des pages ouvertes
});

// Interception des requêtes
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // Renvoie la réponse en cache immédiatement
        // Puis met à jour en arrière-plan (stale-while-revalidate)
        fetch(event.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }).catch(() => {
          // Pas grave si le réseau est indisponible
        });
        return response;
      }
      // Si pas dans le cache, fetch réseau normal
      return fetch(event.request)
        .then(networkResponse => {
          // Met en cache la nouvelle réponse
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => {
          // Option : fallback offline ici si tu veux
        });
    })
  );
});
