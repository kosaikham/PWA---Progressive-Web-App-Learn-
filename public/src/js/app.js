var deferredPrompt;

if(!window.Promise){
    window.Promise = Promise;
}

if('serviceWorker' in navigator){
    navigator.serviceWorker
        .register('/sw.js')
        .then(function () {
            console.log('Service Worker registered.')
        });
}

window.addEventListener('beforeinstallprompt', function (event) {
    console.log('beforeinstallprompt fired.')
    event.preventDefault()
    deferredPrompt = event
})

var xhr = new XMLHttpRequest();
xhr.open('GET','http://httpbin.org/ip');
xhr.responseType = 'json';

xhr.onload = function () {
    console.log(xhr.response)
}

xhr.onerror = function () {
    console.log('Error!')
}

xhr.send();


fetch('http://httpbin.org/ip')
    .then(function (response) {
        console.log(response)
        return response.json()
    })
    .then(function(data){
        console.log(data)
    })
    .catch(function(err){
        console.log(err)
    });

fetch('http://httpbin.org/post',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({message: 'hello world'})
    })
    .then(function (response) {
        console.log(response)
        return response.json()
    })
    .then(function(data){
        console.log(data)
    })
    .catch(function(err){
        console.log(err)
    });

// var promise = new Promise(function(resolve, reject){
//    setTimeout(function () {
//        resolve('now it is 3s')
//    },3000)
// })
//
// promise.then(function (text) {
//     return text
// }).then(function(nextText){
//     console.log(nextText)
// })
//
// console.log('next tasks')