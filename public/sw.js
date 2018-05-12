/**
 * Created by saikham on 5/12/18.
 */
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing service worker ...', event)
})

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating service worker ...', event)
    return self.clients.claim() // might not be needed in the futures
})

self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetching service worker ...', event)
    event.respondWith(fetch(event.request))
})