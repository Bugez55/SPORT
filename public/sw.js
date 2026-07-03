/* Service Worker — Transformation 1 An
   Rend l'application installable et fonctionne hors-ligne. */
const CACHE = "transfo-1an-v1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-512.png",
];

// À l'installation : on pré-cache le "coeur" de l'application.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

// À l'activation : on supprime les anciens caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Interception des requêtes réseau.
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // On ne gère que les requêtes GET sur la même origine.
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations (ouverture de pages) -> réseau d'abord, cache en repli hors-ligne.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(
          () =>
            caches.match("./index.html").then((r) => r || caches.match("./"))
        )
    );
    return;
  }

  // Autres ressources -> stale-while-revalidate (cache instantané + mise à jour).
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
