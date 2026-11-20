const CACHE_NAME = 'choice-of-god-v1.0.0';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/i18n/ko.js',
  './js/i18n/en.js',
  './js/i18n/ja.js',
  './js/i18n/es.js',
  './js/i18n/zh.js',
  './js/data/bible.js',
  './js/data/guides.js',
  './js/data/items.js',
  './js/data/stages.js',
  './js/engine/i18n.js',
  './js/engine/state.js',
  './js/engine/audio.js',
  './js/engine/runner.js',
  './js/games/eden.js',
  './js/games/ark.js',
  './js/games/abraham.js',
  './js/games/plagues.js',
  './js/games/redsea.js',
  './js/games/sinai.js',
  './js/ui/dialogs.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
