'use client';
import { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-react';
import VoipCall from './VoipCall';
//import { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
const clientConfig = { mode: "rtc", codec: "vp8" };
// Wrapper Component with Providers
export function VoipCallWrapper({ chatId, userId, userEmail, targetUserEmail }) {
    const AgoraRtcClient = useRTCClient(AgoraRTC.createClient(clientConfig));
    return (<AgoraRTCProvider client={AgoraRtcClient}>
            <VoipCall chatId={chatId} oneSignalUserId={userId} currentUserEmail={userEmail} targetUserEmail={targetUserEmail}/>
        </AgoraRTCProvider>);
}
