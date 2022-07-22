import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getToken, getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgOkGU7SBqj34wnqJ_R4oyWP4i9vAYFmo",
    authDomain: "quickstart-1554606735377.firebaseapp.com",
    projectId: "quickstart-1554606735377",
    storageBucket: "quickstart-1554606735377.appspot.com",
    messagingSenderId: "583597831454",
    appId: "1:583597831454:web:490de2f8a2f9631ee3850f",
    measurementId: "G-DE5DDCZR3N"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

var request, preference;

export default {

    install : function (app, options) {
        
        const icon = (options.production ? options.icon_production : options.icon_development)
        
        async function nofify__config(){
            try {
                let tokenDevice = await getToken(messaging, { vapidKey: 'BNEvpY9TWJd9cP4vrHysbuipCzhDUH2DL7bAXYrJh5Nw795n5xROpaJisoPBLjwtrUvXWJ-ClmYE2gBqgpcLq4U' })
                await preference('device', tokenDevice)
                let status = await request('@notification/save_device', {
                    device:tokenDevice
                });
                if(status.error) return -1;
                return 1;
            } catch(e){
                return 0;
            }
        }

        app.config.globalProperties.$notify = function (listener, req, pref){
            request = req
            preference = pref
            onMessage(messaging, payload => {
                listener()
                console.log("Message received. ", payload);
            });
        }

        app.config.globalProperties.$request_permission = async function(){
            if (!("Notification" in window)) return -1;
            let permission = await Notification.requestPermission();
            if (permission === "granted") {
                await nofify__config()
                return  1;
            } else
            if (permission === "default") {
                return  0;
            }  else {
                return -1;
            }
        }

    }

}