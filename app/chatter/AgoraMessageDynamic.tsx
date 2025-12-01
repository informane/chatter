'use client';

import dynamic from 'next/dynamic';
import { AgoraMsgProps } from '../lib/props';

const AgoraMessageDynamic = dynamic(
  () => import('./AgoraMessage').then(mod => mod.AgoraMessage),
  { ssr: false, loading: () => <p>Loading chat...</p> } 
);

export default function AgoraMessasgeWrapper({ shown, onNewMessage, chat_id, currentUserEmail, targetUserEmail, onChangeChatId }: AgoraMsgProps) {
  return (
    <AgoraMessageDynamic shown={shown} onNewMessage={onNewMessage} chat_id={chat_id} onChangeChatId={onChangeChatId} currentUserEmail={currentUserEmail} targetUserEmail={targetUserEmail} />
  );
}