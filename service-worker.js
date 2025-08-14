const CACHE_NAME = "reckoning-cache-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./images/logo.png",
  "./images/mapa.jpg",
  "./images/mapa_fixo.jpg",
  "./images/fixo.jpg",
  "./images/p1.jpg","./images/p2.jpg","./images/p3.jpg","./images/p4.jpg","./images/p5.jpg","./images/p6.jpg"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
