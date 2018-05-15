/**
 * Created by saikham on 5/12/18.
 */
const CACHE_STATIC = 'static-v5'
const CACHE_DYNAMIC = 'dynamic-v2'


self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing service worker ...', event)
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(function (cache) {
                console.log('[Service Worker] Precaching app shell')
                cache.addAll([
                    '/',
                    '/index.html',
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
                ])
            })
    )
})

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating service worker ...', event)
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if(key !== CACHE_STATIC && key !== CACHE_DYNAMIC){
                        console.log('[Service Worker] Removing old cache.', key)
                        return caches.delete(key)
                    }
                }))
            })
    )
    return self.clients.claim() // might not be needed in the futures
})

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if(response){
                    return response
                }else {
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC)
                                .then(function (cache) {
                                    cache.put(event.request.url, res.clone())
                                    return res
                                })
                        })
                        .catch(function (err) {
                            console.log('[Fetch Error]...')
                        })
                }
            })
    )
})