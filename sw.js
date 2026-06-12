var CACHE_NAME = 'my-planet-v1';
var STATIC_ASSETS = [
  './',
  './index.html',
  './blog.html',
  './post.html',
  './css/base.css',
  './css/nav.css',
  './css/effects.css',
  './css/animations.css',
  './css/home.css',
  './css/blog.css',
  './css/post.css',
  './js/core/utils.js',
  './js/core/stars.js',
  './js/core/effects.js',
  './js/core/bg.js',
  './js/core/markdown.js',
  './js/core/theme.js',
  './js/core/animations.js',
  './js/home.js',
  './js/blog.js',
  './js/post.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(fetchResponse) {
        if (fetchResponse && fetchResponse.status === 200) {
          var responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      }).catch(function() {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
