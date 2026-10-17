self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (/^(tien-cua-dien|tiendien)[-_]/.test(name)) await caches.delete(name);
  await self.registration.unregister();
})()));
