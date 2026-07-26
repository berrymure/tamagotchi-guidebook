const CACHE_NAME = "tmz-guide-cache-v1";
const CORE_ASSETS = [
  "index.html",
  "characters.html",
  "growth.html",
  "marriage.html",
  "genetics.html",
  "items.html",
  "towns.html",
  "translate.html",
  "faq.html",
  "assets/css/base.css",
  "assets/css/guide.css",
  "assets/js/data.js",
  "assets/js/common.js",
  "manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
