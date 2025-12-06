'use client';
import dynamic from 'next/dynamic';
// Import the component dynamically, disabling Server-Side Rendering (ssr: false)
const DynamicVoipCall = dynamic(() => import('./VoipCallWrapper').then(mod => mod.VoipCallWrapper), { ssr: false, loading: () => <p>Loading communication module...</p> });
export default function VoipCallDynamic({ chatId, userId, userEmail, targetUserEmail }) {
    return (<DynamicVoipCall chatId={chatId} userId={userId} userEmail={userEmail} targetUserEmail={targetUserEmail}/>);
}
