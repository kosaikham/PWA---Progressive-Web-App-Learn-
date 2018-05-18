var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
    createPostArea.style.display = 'block';
    if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(function (choiceResult) {
            console.log(choiceResult.outcome);

            if (choiceResult.outcome === 'dismissed') {
                console.log('User cancelled installation');
            } else {
                console.log('User added to home screen');
            }
        });

        deferredPrompt = null;
    }

    // if('serviceWorker' in navigator){
    //     navigator.serviceWorker.getRegistrations()
    //         .then(function (registrations) {
    //             for (var i = 0; i < registrations.length; i++){
    //                 registrations[i].unregister()
    //             }
    //         })
    // }
}

function closeCreatePostModal() {
    createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// just testing user request
function onSaveButtonClicked() {
    console.log('clicked');
    if ('caches' in window) {
        caches.open('user-requested')
            .then(function (cache) {
                cache.add('https://httpbin.org/get')
                cache.add('/src/images/sf-boat.jpg')
            })
    }
}

function clearCard() {
    while (sharedMomentsArea.hasChildNodes()) {
        sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
    }
}

function createCard(data) {
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    var cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    cardTitle.style.backgroundImage = 'url(' + data.image + ')';
    cardTitle.style.backgroundSize = 'cover';
    cardTitle.style.height = '180px';
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = data.title;
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = data.location;
    cardSupportingText.style.textAlign = 'center';
    // var cardSaveButton = document.createElement('button');
    // cardSaveButton.textContent = 'Save';
    // cardSaveButton.addEventListener('click', onSaveButtonClicked);
    // cardSupportingText.appendChild(cardSaveButton);
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

function UpdateUI(data) {
    clearCard();
    for (var i = 0; i < data.length; i++) {
        createCard(data[i])
    }
}

var url = 'https://pwagram-805d5.firebaseio.com/posts.json';
var fromWeb = false;

// web
fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        fromWeb = true;
        console.log('[From Web]...', data);
        var dataArray = [];
        for (var key in data) {
            dataArray.push(data[key])
        }
        UpdateUI(dataArray);
    });

// cache
if ('indexedDB' in window) {
    readData('posts')
        .then(function (data) {
            if (!fromWeb) {
                console.log('[From Cache]...', data)
                UpdateUI(data)
            }
        })
}




