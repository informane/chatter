'use client';

import dynamic from 'next/dynamic';
import { ChatterProps } from '../lib/props';

const AgoraMessageDynamic = dynamic(
  () => import('./AgoraMessage').then(mod => mod.AgoraMessage),
  { ssr: false, loading: () => <p>Loading chat...</p> } 
);

export default function AgoraMessasgeWrapper({ chat_id, onChangeChatId, shown  }: ChatterProps) {
  return (
    <AgoraMessageDynamic shown={shown} chat_id={chat_id} onChangeChatId={onChangeChatId} />
  );
}