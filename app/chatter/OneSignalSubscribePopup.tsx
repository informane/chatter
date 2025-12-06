'use client';
import { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { linkOneSignalUserToDb } from '../lib/chatter';
import { redirect } from 'next/dist/server/api-utils';


export default function SubscribePopup({ email, chatId }) {
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
        autoResubscribe: false,
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
              text: {
                actionMessage: "Stay Updated with Chatter Messenger! Click Accept to subscribe",
                acceptButton: "Accept",
                //cancelButton: "Maybe Later"
              }
            }]
          }
        },
        /*notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: false,
        },*/
        //allowLocalhostAsSecureOrigin: true,
      });


      OneSignal.User.PushSubscription.addEventListener(
        'change',
        subscribeUser
      );
      OneSignal.login(email);

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
      } else {
        console.log('user unsubed')
      }


      return () => {
        OneSignal.User.PushSubscription.removeEventListener(
          'change',
          subscribeUser
        );
      };
    }
  }
  return null;
};
