const CACHE_NAME = "snapclone-cache-v1";
const CACHE_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm",
  // ajoute ici tes fichiers CSS, images, icônes si besoin
];

// Installation : mise en cache des fichiers
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

// Activation : nettoyage ancien cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Interception requêtes : cache first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      if (cachedRes) return cachedRes;
      return fetch(event.request).then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkRes.clone());
          return networkRes;
        });
      }).catch(() => {
        // Optionnel : afficher une page hors-ligne ici
      });
    })
  );
});
