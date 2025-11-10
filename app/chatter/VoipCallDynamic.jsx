'use client';
import dynamic from 'next/dynamic';
// Import the component dynamically, disabling Server-Side Rendering (ssr: false)
var DynamicVoipCall = dynamic(function () { return import('./VoipCall').then(function (mod) { return mod.VoipCallWrapper; }); }, { ssr: false, loading: function () { return <p>Loading communication module...</p>; } });
export default function VoipCallDynamic(_a) {
    var userEmail = _a.userEmail, targetUserEmail = _a.targetUserEmail;
    return (<DynamicVoipCall userEmail={userEmail} targetUserEmail={targetUserEmail}/>);
}
