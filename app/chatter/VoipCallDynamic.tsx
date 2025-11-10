'use client';

import dynamic from 'next/dynamic';

// Import the component dynamically, disabling Server-Side Rendering (ssr: false)
const DynamicVoipCall = dynamic(
  () => import('./VoipCall').then(mod => mod.VoipCallWrapper),
  { ssr: false, loading: () => <p>Loading communication module...</p> }
);

export default function VoipCallDynamic({ userEmail, targetUserEmail }: { userEmail: string, targetUserEmail: string }) {

  return (
    <DynamicVoipCall userEmail={userEmail} targetUserEmail={targetUserEmail} />
  );
}

