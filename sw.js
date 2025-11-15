const CACHE_NAME = "story-app-cache-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/styles/style.css",
  "/src/main.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin === self.location.origin && (event.request.mode === 'navigate' || event.request.destination === 'document')) {
    event.respondWith(caches.match('/index.html'));
    return;
  }

  if (url.pathname.startsWith('/v1')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(c => c || fetch(event.request)));
});

// push notification
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Story Baru!";
  const options = {
    body: data.message || "Ada cerita baru dari temanmu.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: data.url || "/#/home" },
    actions: [{ action: "open", title: "Buka Aplikasi" }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.includes(target) && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
