const CACHE_NAME = 'choice-of-god-v4.0.0';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/art/adam_eve.png',
  './assets/art/noah.png',
  './assets/art/abraham.png',
  './assets/art/moses.png',
  './assets/art/cherubim.png',
  './assets/art/serpent.png',
  './assets/bg/bg_eden.jpg',
  './assets/bg/bg_ark.jpg',
  './assets/bg/bg_abraham.jpg',
  './assets/bg/bg_plagues.jpg',
  './assets/bg/bg_redsea.jpg',
  './assets/bg/bg_sinai.jpg',
  './assets/sprites/hero_adam.png',
  './assets/sprites/hero_noah.png',
  './assets/sprites/hero_abraham.png',
  './assets/sprites/hero_moses.png',
  './assets/sprites/hero_aaron.png',
  './assets/sprites/unit_angel.png',
  './assets/sprites/unit_knight.png',
  './assets/sprites/unit_miriam.png',
  './assets/sprites/boss_serpent.png',
  './assets/sprites/boss_pharaoh.png',
  './assets/sprites/enemy_magician.png',
  './assets/sprites/enemy_chariot.png',
  './assets/sprites/animal_sheep.png',
  './assets/sprites/animal_lion.png',
  './assets/sprites/bld_ark.png',
  './assets/sprites/bld_mill.png',
  './assets/sprites/bld_well.png',
  './assets/sprites/bld_pen.png',
  './assets/sprites/prop_tree_life.png',
  './assets/sprites/prop_tree_forb.png',
  './assets/sprites/bld_tabernacle.png',
  './js/i18n/ko.js',
  './js/i18n/en.js',
  './js/i18n/ja.js',
  './js/i18n/es.js',
  './js/i18n/zh.js',
  './js/data/bible.js',
  './js/data/guides.js',
  './js/data/items.js',
  './js/data/dialogues.js',
  './js/data/stages.js',
  './js/engine/i18n.js',
  './js/engine/state.js',
  './js/engine/audio.js',
  './js/engine/spriteLoader.js',
  './js/engine/chibiSprites.js',
  './js/engine/stageHost.js',
  './js/stages/stage1_eden_arpg.js',
  './js/stages/stage2_ark_sim.js',
  './js/stages/stage3_abraham_hex.js',
  './js/stages/stage4_plagues_jrpg.js',
  './js/stages/stage5_redsea_rts.js',
  './js/stages/stage6_sinai_fps.js',
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
