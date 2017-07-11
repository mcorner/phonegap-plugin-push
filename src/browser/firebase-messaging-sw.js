importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

firebase.initializeApp({
//   'messagingSenderId': '85075801930' // This value seems to be required, but it doesn't matter what it is?
 });
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]

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

  if (messageChannel){
    messageChannel.ports[0].postMessage(pushData);
  }

  return self.registration.showNotification(pushData.title, {
    body: pushData.message,
    icon: pushData.image,
    tag: 'simple-push-demo-notification-tag',
  });
});

self.addEventListener('message', function(event) {
    console.log("SW Received message channel");
    messageChannel = event;
});
