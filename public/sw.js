/**
 * Created by saikham on 5/12/18.
 */
const CACHE_STATIC = 'static-v17'
const CACHE_DYNAMIC = 'dynamic-v2'
var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/promise.js',
    '/src/js/fetch.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

// function trimCache(cacheName, maxItem) {
//     caches.open(cacheName)
//         .then(function (cache) {
//             return cache.keys()
//                 .then(function (keys) {
//                     if(keys.length > maxItem){
//                         cache.delete(keys[0])
//                             .then(trimCache(cacheName, maxItem))
//                     }
//                 })
//         })
// }


self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing service worker ...', event)
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(function (cache) {
                console.log('[Service Worker] Precaching app shell')
                cache.addAll(STATIC_FILES)
            })
    )
})

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating service worker ...', event)
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
                        console.log('[Service Worker] Removing old cache.', key)
                        return caches.delete(key)
                    }
                }))
            })
    )
    return self.clients.claim() // might not be needed in the futures
})


self.addEventListener('fetch', function (event) {
    var url = 'https://httpbin.org/get';

    if (event.request.url.indexOf(url) > -1) {
        event.respondWith(
            caches.open(CACHE_DYNAMIC)
                .then(function (cache) {
                    return fetch(event.request)
                        .then(function (res) {
                            // trimCache(CACHE_DYNAMIC, 3)
                            cache.put(event.request.url, res.clone())
                            return res
                        })
                })
        )
    }
    else if (STATIC_FILES.includes(event.request.url)) {
        console.log('[RegExp] works...')
        event.respondWith(
            caches.match(event.request)
        )
    }
    else {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        return response
                    } else {
                        return fetch(event.request)
                            .then(function (res) {
                                return caches.open(CACHE_DYNAMIC)
                                    .then(function (cache) {
                                        // trimCache(CACHE_DYNAMIC, 3)
                                        cache.put(event.request.url, res.clone())
                                        return res
                                    })
                            })
                            .catch(function (err) {
                                return caches.open(CACHE_STATIC)
                                    .then(function (cache) {
                                        if (event.request.headers.get('accept').includes('text/html')) {
                                            return cache.match('/offline.html')
                                        }
                                    })
                            })
                    }
                })
        )
    }
})


// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//             .then(function (response) {
//                 if(response){
//                     return response
//                 }else {
//                     return fetch(event.request)
//                         .then(function (res) {
//                             return caches.open(CACHE_DYNAMIC)
//                                 .then(function (cache) {
//                                      cache.put(event.request.url, res.clone())
//                                     return res
//                                 })
//                         })
//                         .catch(function (err) {
//                             return caches.open(CACHE_STATIC)
//                                 .then(function (cache) {
//                                     return cache.match('/offline.html')
//                                 })
//                         })
//                 }
//             })
//     )
// })

// network with cache fallback
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         fetch(event.request)
//             .then(function (res) {
//                 return caches.open(CACHE_DYNAMIC)
//                     .then(function (cache) {
//                         cache.put(event.request.url, res.clone())
//                         return res
//                     })
//             })
//             .catch(function (err) {
//                 return caches.match(event.request)
//             })
//     )
// })

// cache-only strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//     )
// })

// network-only strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         fetch(event.request)
//     )
// })