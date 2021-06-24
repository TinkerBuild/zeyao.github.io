'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "670302804ce78ff1ea3c9ee1763aef4e",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "1e4fcf0d9351c7754c752247d9607890",
"assets/shopping_assets/grocery.gif": "3e6602f525d24078efa4e05406c89dff",
"assets/shopping_assets/grocery.png": "1a5292f27d2939fe1b3dc4cdb5c0b773",
"assets/shopping_assets/grocery_responsive.gif": "3e6602f525d24078efa4e05406c89dff",
"assets/shopping_assets/icons/add_to_cart.svg": "91d2102e7b89fec10fcb816275041b0a",
"assets/shopping_assets/icons/back.svg": "6faa6d40f8e404d040b147b67d9bf16c",
"assets/shopping_assets/icons/bag_1.svg": "25dc761330863a4fc3123437787c95c9",
"assets/shopping_assets/icons/cart.svg": "2cc4f936dbb97ec3263d3d3c08a38290",
"assets/shopping_assets/icons/heart.svg": "fafdb8afc30748f259b6ff64d51e3088",
"assets/shopping_assets/icons/search.svg": "676863abb3dbd91d7139d3434c94736a",
"assets/shopping_assets/images/bakery_snacks/cover.png": "d1cb049b7f9cf4f53073dec15eb8bde6",
"assets/shopping_assets/images/beverage/cover.png": "9c1094f36f47f54fe22a9dca95816e15",
"assets/shopping_assets/images/cooking_oil/cooking_cover.png": "1c9e00f17ebea192cb90b97e580ed809",
"assets/shopping_assets/images/dairy_eggs/cover.png": "5fa39628d486b265c7e1a29aa77aa7ba",
"assets/shopping_assets/images/fruits/apple.png": "329677ef5e8ac2578e022b326f4d294d",
"assets/shopping_assets/images/fruits/banana.png": "d4b231a5b3613b57f41419aba9d8a44d",
"assets/shopping_assets/images/fruits/cover.png": "bc86ecf6566d179906c344d1c994060c",
"assets/shopping_assets/images/fruits/lemon.png": "4fd4a9f3559e1303db109184bd4d3f13",
"assets/shopping_assets/images/fruits/mango.png": "0a3d6f26ebd567d3f215ea57e2f1cd99",
"assets/shopping_assets/images/fruits/orange.png": "87b0ea6e4b17a4cf6e0b5e1782830bfb",
"assets/shopping_assets/images/fruits/pineapple.png": "9905a03e9ee41f13b60bba511c2a2a35",
"assets/shopping_assets/images/user.png": "6d542556f67c0c9e709a010e7fbd8981",
"assets/shopping_assets/images/vegetables/carrot.png": "7c2adc3b3ef9048af76323527a2a5fee",
"assets/shopping_assets/images/vegetables/cucumber.png": "b92f6f9ff4492ad8e334e539155126fb",
"assets/shopping_assets/images/vegetables/onion.png": "22aff902b4b4695eec1ba21f495a4f46",
"assets/shopping_assets/images/vegetables/potato.png": "143e5631d252768892438a0d82e32331",
"assets/shopping_assets/images/vegetables/red_chillies.png": "31f17cffe6433ab9549d163cbb59dd8f",
"assets/shopping_assets/images/vegetables/tomato.png": "e77d5e23501f19eb257a0ee9f71bf906",
"assets/shopping_assets/images/vegetables/vegetables_cover.png": "f5e39673785c6c6ea650bb62fcc60ef3",
"assets/shopping_assets/nav_drawer_image.png": "cf46a5f721f1552ab214a71fe82a38d7",
"assets/shopping_assets/welcome.png": "f4c21298dbb060f1d63675788ae5e842",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "c76b5fe74ff89ea9fca9ec738f4cbbf6",
"/": "c76b5fe74ff89ea9fca9ec738f4cbbf6",
"main.dart.js": "9f8af46f974caf840b9bc11eb290327a",
"version.json": "7e152bba7027c7aa127bba7a9e76ff71"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
