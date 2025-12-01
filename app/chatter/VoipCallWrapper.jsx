'use client';
import { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-react';
import VoipCall from './VoipCall';
//import { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
var clientConfig = { mode: "rtc", codec: "vp8" };
// Wrapper Component with Providers
export function VoipCallWrapper(_a) {
    var userEmail = _a.userEmail, targetUserEmail = _a.targetUserEmail;
    var AgoraRtcClient = useRTCClient(AgoraRTC.createClient(clientConfig));
    return (<AgoraRTCProvider client={AgoraRtcClient}>
            <VoipCall currentUserEmail={userEmail} targetUserEmail={targetUserEmail}/>
        </AgoraRTCProvider>);
}
