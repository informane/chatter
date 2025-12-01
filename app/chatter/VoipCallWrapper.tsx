'use client';

import { AgoraRTCProvider, ClientConfig, useRTCClient } from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-react';
import VoipCall from './VoipCall';
//import { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

const clientConfig: ClientConfig = { mode: "rtc", codec: "vp8" };
// Wrapper Component with Providers
export function VoipCallWrapper({ userEmail, targetUserEmail }: { userEmail: string, targetUserEmail: string }) {
    const AgoraRtcClient = useRTCClient(AgoraRTC.createClient(clientConfig));
    return (
        <AgoraRTCProvider client={AgoraRtcClient}>
            <VoipCall currentUserEmail={userEmail} targetUserEmail={targetUserEmail} />
        </AgoraRTCProvider>
    );
}
