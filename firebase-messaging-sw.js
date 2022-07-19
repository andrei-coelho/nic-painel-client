
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

var firebaseConfig = {
    apiKey: "AIzaSyAgOkGU7SBqj34wnqJ_R4oyWP4i9vAYFmo",
    authDomain: "quickstart-1554606735377.firebaseapp.com",
    projectId: "quickstart-1554606735377",
    storageBucket: "quickstart-1554606735377.appspot.com",
    messagingSenderId: "583597831454",
    appId: "1:583597831454:web:490de2f8a2f9631ee3850f",
    measurementId: "G-DE5DDCZR3N"
};

firebase.initializeApp(firebaseConfig);
  
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'http://127.0.0.1:5500/icon.png'
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});