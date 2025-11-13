'use client';
import dynamic from 'next/dynamic';
var AgoraMessageDynamic = dynamic(function () { return import('./AgoraMessage').then(function (mod) { return mod.AgoraMessage; }); }, { ssr: false, loading: function () { return <p>Loading chat...</p>; } });
export default function AgoraMessasgeWrapper(_a) {
    var chat_id = _a.chat_id, onChangeChatId = _a.onChangeChatId, shown = _a.shown;
    return (<AgoraMessageDynamic shown={shown} chat_id={chat_id} onChangeChatId={onChangeChatId}/>);
}
