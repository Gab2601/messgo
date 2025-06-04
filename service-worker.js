const CACHE_VERSION = "v3"; // ↑ incrémente à chaque mise à jour
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
    const cameraSelect = document.getElementById("cameraSelect");
const startCameraBtn = document.getElementById("startCameraBtn");
const video = document.getElementById("video");

let currentStream = null;

// Liste les caméras disponibles dans le select
async function listCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === "videoinput");

  cameraSelect.innerHTML = "";
  videoDevices.forEach((device, index) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label || `Caméra ${index + 1}`;
    cameraSelect.appendChild(option);
  });
}

// Lance la caméra sélectionnée
async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  const deviceId = cameraSelect.value;
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
      audio: false
    });
    video.srcObject = currentStream;
    await video.play();
  } catch (err) {
    alert("Erreur d'accès à la caméra : " + err.message);
  }
}

// Au chargement, liste les caméras
listCameras();

// Quand on clique, lance la caméra choisie
startCameraBtn.onclick = startCamera;

  );
});


