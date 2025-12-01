'use client';
import dynamic from 'next/dynamic';
var AgoraMessageDynamic = dynamic(function () { return import('./AgoraMessage').then(function (mod) { return mod.AgoraMessage; }); }, { ssr: false, loading: function () { return <p>Loading chat...</p>; } });
export default function AgoraMessasgeWrapper(_a) {
    var shown = _a.shown, onNewMessage = _a.onNewMessage, chat_id = _a.chat_id, currentUserEmail = _a.currentUserEmail, targetUserEmail = _a.targetUserEmail, onChangeChatId = _a.onChangeChatId;
    return (<AgoraMessageDynamic shown={shown} onNewMessage={onNewMessage} chat_id={chat_id} onChangeChatId={onChangeChatId} currentUserEmail={currentUserEmail} targetUserEmail={targetUserEmail}/>);
}
