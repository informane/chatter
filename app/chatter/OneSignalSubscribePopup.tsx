'use client';
import { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { linkOneSignalUserToDb } from '../lib/chatter';


export default function SubscribePopup() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const initializeOneSignal = async () => {
      await OneSignal.init({
        appId: '731a811c-a368-4af1-b5d3-6674c10f47f6',
        safari_web_id: "web.onesignal.auto.597eddd1-7088-4460-8312-f4c61675b8f7",
        /*notifyButton: {
          enable: true,
        },*/
        allowLocalhostAsSecure: true,
      });

      // Use the native browser check for initial support
      if ('Notification' in window && navigator.serviceWorker) {
        // Check if the user is already subscribed using the new V3 method
        setUserId(OneSignal.User.PushSubscription.id);
        console.log('notification is presented')
        if (!userId) {
          // User is not subscribed, show the custom UI after a delay (or based on a user action)
          setTimeout(() => setShowPrompt(true), 3000);
          console.log('user is not subbed')
        }
      } else {
        console.log("Push notifications not supported in this browser/environment.");
      }
    }

    initializeOneSignal();
  }, []);

  const handleSubscribeClick = async () => {
    // Hide your custom UI once they click the button
    setShowPrompt(false);

    // *** The crucial step: Trigger the required native browser prompt ***
    try {
      const subResult = await OneSignal.Notifications.requestPermission();
      console.log("Native prompt shown and hopefully accepted!");

      setUserId(OneSignal.User.PushSubscription.id);

      if (userId) {
        const linkRes = await linkOneSignalUserToDb(userId);
        if (linkRes.success) {
          console.log('linked success')
        } else {
          console.log('error linking: ', linkRes.error)
        }
      }

      // You can add logic here to track if they accepted or denied
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  if (!showPrompt) {
    return null;
  }

  return (
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
      <h3>Stay Updated with Agora Messenger!</h3>
      <p>We want to notify you immediately when you receive a new message.</p>
      <button onClick={handleSubscribeClick}>Enable Message Notifications</button>
      <button onClick={() => setShowPrompt(false)}>Maybe Later</button>
    </div>
  );
};
