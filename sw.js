var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  'index.html',
  'css/style.css',
  'js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installation');
    e.waitUntil(
      caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Mise en cache globale: app shell et contenu');
        return cache.addAll(filesToCache);
      })
    );

});

/* Serve cached content when offline */
self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((r) => {
            console.log('[Service Worker] Récupération de la ressource: '+e.request.url);
        return r || fetch(e.request).then((response) => {
                  return caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Mise en cache de la nouvelle ressource: '+e.request.url);
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
          if(cacheName.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      })
    );
});

// MDN : https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps/Offline_Service_workers / https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
// Github: https://github.com/jamesjohnson280/hello-pwa
// Others: https://developers.google.com/web/fundamentals/primers/service-workers