importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '85075801930',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

let messageChannel = null;

messaging.setBackgroundMessageHandler(function(event) {
  console.log('[firebase-messaging-sw.js] Received background message ', event);

  // parse incoming message
  var obj = {};
  var pushData = {
    image: 'https://avatars1.githubusercontent.com/u/60365?v=3&s=200',
    additionalData: {}
  };
  if (event.data) {
    obj = event.data;
  }

  // convert to push plugin API
  for (var key in obj) {
    if (key === 'title') {
      pushData.title = obj[key];
    } else if (key === 'message' || key === 'body') {
      pushData.message = obj[key];
    } else if (key === 'count' || key === 'msgcnt' || key === 'badge') {
      pushData.count = obj[key];
    } else if (key === 'sound' || key === 'soundname') {
      pushData.sound = obj[key];
    } else if (key === 'image') {
      pushData.image = obj[key];
    } else {
      pushData.additionalData[key] = obj[key];
    }
  }

  if (messageChannel) {
    messageChannel.ports[0].postMessage(pushData);
  }

  return self.registration.showNotification(pushData.title, {
    body: pushData.message,
    icon: pushData.image,
    tag: 'simple-push-demo-notification-tag',
  });
});

self.addEventListener('message', function(event) {
  messageChannel = event;
});

self.addEventListener('notificationclick', function(event) {
    console.log("notificationclick");
//    console.log(event.notification.tag);
    let url = 'http://markdcorner.com';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
