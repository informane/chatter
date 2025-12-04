'use client';
import dynamic from 'next/dynamic';
// Import the component dynamically, disabling Server-Side Rendering (ssr: false)
const DynamicVoipCall = dynamic(() => import('./VoipCallWrapper').then(mod => mod.VoipCallWrapper), { ssr: false, loading: () => <p>Loading communication module...</p> });
export default function VoipCallDynamic({ userEmail, targetUserEmail }) {
    return (<DynamicVoipCall userEmail={userEmail} targetUserEmail={targetUserEmail}/>);
}
