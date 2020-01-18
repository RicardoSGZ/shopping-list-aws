var CACHE_NAME = 'shopping-list-v1';
var urlsToCache = [
  '/',
  'index.html',
  'favicon.png',
  'res/js/main.js',
  'res/jquery/jquery-3.4.1.min.js',
  'res/css/main.css',
  'res/fontawesome/5.10.2/css/all.css',
  'res/fontawesome/5.10.2/webfonts/fa-solid-900.ttf',
  'res/fontawesome/5.10.2/webfonts/fa-solid-900.woff',
  'res/fontawesome/5.10.2/webfonts/fa-solid-900.woff2'
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		  .then(function(cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		  })
	  );
  });

  self.addEventListener('fetch', function(event) {
	event.respondWith(
	  caches.match(event.request)
		.then(function(response) {
		  // Cache hit - return response
		  if (response) {
			return response;
		  }
		  return fetch(event.request);
		}
	  )
	);
  });