'use client';
import { useState, useEffect } from 'react';

export default function SubscribePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show prompt after 3 seconds of page load
    const timer = setTimeout(() => {
      // Check if user has already made a choice via localStorage/cookies
      if (!localStorage.getItem('notification_prompt_shown')) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = () => {
    // This is where you would then trigger the *native* browser prompt
    console.log("User accepted the prompt. Now request native permissions.");
    localStorage.setItem('notification_prompt_shown', 'true');
    setIsVisible(false);
  };

  const handleDeny = () => {
    localStorage.setItem('notification_prompt_shown', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    // Simple inline styles for demonstration of sliding position
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
      transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
      zIndex: 1000
    }}>
      <p>✨ **Subscribe to updates?**</p>
      <p>We&#39;d like to show notifications for new messages and calls.</p>
      <button onClick={handleDeny} style={{ marginRight: '10px' }}>Maybe Later</button>
      <button onClick={handleAllow}>Allow Notifications</button>
    </div>
  );
};