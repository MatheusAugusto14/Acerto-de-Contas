// Updated to prefer network-first and avoid stale caches
const CACHE_NAME = "reckoning-cache-network-first-v1";

self.addEventListener("install", (event) => {
  // Activate updated SW immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clear ALL existing caches to avoid using old versions
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    try {
      // Always try network first with no-store to bypass HTTP caches
      const fresh = await fetch(event.request, { cache: "no-store" });
      // Optionally update a fresh cache for offline fallback
      try {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, fresh.clone());
      } catch (e) {}
      return fresh;
    } catch (err) {
      // Fallback to cache if offline
      const cached = await caches.match(event.request);
      if (cached) return cached;
      // As a last resort, return a generic offline response
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }
  })());
});