'use client';
import { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { linkOneSignalUserToDb } from '../lib/chatter';
import { assert } from 'console';


export default function SubscribePopup({ chatId }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [userId, setUserId] = useState(null);
  const appId = "731a811c-a368-4af1-b5d3-6674c10f47f6";
  const safari_web_id = "web.onesignal.auto.597eddd1-7088-4460-8312-f4c61675b8f7";


  useEffect(() => {
    const initializeOneSignal = async () => {
      //await OneSignal.logout();
      await OneSignal.init({
        appId: appId,
        safari_web_id: safari_web_id,
        notificationClickHandlerMatch: 'exact',
        webhooks: {
          cors: false,
          'notification.willDisplay': 'https://chatter-psi-six.vercel.app/api/onesignal/shown',
          'notification.clicked': 'https://chatter-psi-six.vercel.app/api/onesignal/accepted',
          'notification.dismissed': 'https://chatter-psi-six.vercel.app/api/onesignal/rejected'
        },
        promptOptions: {
          slidedown: {
            prompts: [{
              type: 'push',
              autoPrompt: true,
              delay: { pageViews: 1, timeDelay: 3 },
              categories: [{
                tag: "call",
                label: "Incoming call"
              }],
              /*text: {
                actionMessage: "<h3>Stay Updated with Chatter Messenger!</h3><p> We want to notify you immediately when you receive a new call.</p>",
                acceptButton: "Enable Notifications",
                //cancelButton: "Maybe Later"
              }*/
            }]
          }
        },
        /*notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: false,
        },*/
        allowLocalhostAsSecureOrigin: true,
      });

      // Attach the event listener *after* initialization
      OneSignal.User.PushSubscription.addEventListener(
        'change',
        subscribeUser
      );

      // Use the native browser check for initial support
      /*if ('Notification' in window && navigator.serviceWorker) {
        const user_id = OneSignal.User.onesignalId;
        setUserId(user_id);

        console.log('service worker present. OneSignal obj: ', OneSignal)

        if (!user_id) {
          // User is not subscribed, show the custom UI after a delay
          setTimeout(() => setShowPrompt(true), 3000);
          console.log('user is not subbed')
        } else {
          console.log('user is subbed');
        }
      } else {
        console.log("Push notifications not supported in this browser/environment.");
      }*/
    }

    initializeOneSignal();
    // Cleanup the event listener when the component unmounts
    return () => {
      OneSignal.User.PushSubscription.removeEventListener(
        'change',
        subscribeUser
      );
    };
  }, []);

  const subscribeUser = async (isSubscribed) => {

    if (isSubscribed) {
      console.log('user subscribed success')
      const user_id = OneSignal.User.onesignalId;
      setUserId(user_id);

      if (user_id) {
        const linkRes = await linkOneSignalUserToDb(user_id);
        if (linkRes.success) {
          console.log('signal user linked to db success')
        } else {
          console.log('error linking: ', linkRes.error ? "" : "no error msg")
        }
      }

    } else {
      console.log('user unsubed')
    }


    // Hide custom UI once they click the button
    //setShowPrompt(false);

    // *** The crucial step: Trigger the required native browser prompt ***
    /*try {
      const subResult = await OneSignal.Notifications.requestPermission();
      if (!subResult) {
        console.log('Native prompt not shown')
      } else {
        console.log("Native prompt shown and hopefully accepted!");
      }

      const user_id = OneSignal.User.onesignalId;
      setUserId(user_id);

      if (user_id) {
        const linkRes = await linkOneSignalUserToDb(user_id);
        if (linkRes.success) {
          console.log('signal user linked to db success')
        } else {
          console.log('error linking: ', linkRes.error ? "" : "no error msg")
        }
      }

      return () => {
        OneSignal.User.PushSubscription.removeEventListener(
          'change',
          subscribeUser
        );
      };

    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }*/
  };
return null;

  /*return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      padding: '15px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      transition: 'transform 0.5s ease-out', // CSS transition handles the slide
      transform: showPrompt ? 'translateY(0)' : 'translateY(100px)',
      zIndex: 1000
    }}>
      <h3>Stay Updated with Chatter Messenger!</h3>
      <p>We want to notify you immediately when you receive a new call.</p>
      <button onClick={handleSubscribeClick}>Enable Notifications</button>
      <button onClick={() => setShowPrompt(false)}>Maybe Later</button>
    </div>
  );*/
};
