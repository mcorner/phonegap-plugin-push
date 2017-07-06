import firebase from 'firebase';

//const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
*/
 firebase.initializeApp({
   'messagingSenderId': '85075801930' //TBD: get this from package.json
 });
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]



// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(event) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // parse incoming message
  var obj = {};
  var pushData = {
      image: 'https://avatars1.githubusercontent.com/u/60365?v=3&s=200',
      additionalData: {}
  };
  if (event.data) {
      obj = event.data.json();
  }

  console.log(obj);

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

  event.waitUntil(
      self.registration.showNotification(pushData.title, {
          body: pushData.message,
          icon: pushData.image,
          tag: 'simple-push-demo-notification-tag'
      })
  );

  messageChannel.ports[0].postMessage(pushData);


  // Customize notification here
/*  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);*/
});
// [END background_handler]
