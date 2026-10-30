// Esquadrão Éter: funciona offline depois da primeira abertura.
// Para publicar uma atualização, troque a versão abaixo.
const VERSION = 'eter-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(k => k.put('./index.html', c)); return r; }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok && new URL(req.url).origin === location.origin) { const c = r.clone(); caches.open(VERSION).then(k => k.put(req, c)); } return r; })));
});
