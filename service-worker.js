const CACHE_NAME = "snapclone-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.png",
  // ajoute ici d'autres ressources statiques que tu veux cacher
];

// Installation - mise en cache des fichiers
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // active immédiatement ce service worker
  );
});

// Activation - nettoyage des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim()) // prend le contrôle immédiatement
  );
});

// Interception des requêtes pour servir les fichiers cache ou réseau
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Ecoute des messages pour skipWaiting (mise à jour forcée)
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
