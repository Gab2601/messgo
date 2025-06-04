const CACHE_VERSION = "v2"; // ↑ incrémente à chaque mise à jour
const CACHE_NAME = `messgo-cache-${CACHE_VERSION}`;

const urlsToCache = [
  "/",
  "index.html",
  "manifest.json",
  "icon.png",
  // ajoute d'autres fichiers si nécessaire
];

// Installation : mise en cache initiale
self.addEventListener("install", (event) => {
  self.skipWaiting(); // active immédiatement la nouvelle version
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activation : suppression des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim(); // prend le contrôle immédiatement
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Option : ajouter fallback offline ici
        });
    })
  );
});


