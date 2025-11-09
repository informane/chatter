'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    AgoraRTCProvider,
    useRTCClient,
    useIsConnected,
    LocalUser,
    useJoin,
    RemoteUser,
    useLocalMicrophoneTrack,
    usePublish,
    IAgoraRTCClient,
    ClientConfig,
    useRemoteUsers
} from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';


const clientConfig: ClientConfig = { mode: "rtc", codec: "vp8" };

// Helper function to generate a consistent channel name for a 1:1 call
const getDirectChannelName = (email1: string, email2: string) => {
    email1 = email1.replaceAll('.', '');
    email2 = email2.replaceAll('.', '');
    const sortedEmails = [email1, email2].sort();

    return `direct_call_${sortedEmails[0]}_${sortedEmails[1]}`;
};

const getUserId = (email: string) => {
    email = email.replaceAll('.', '');
    return email;
}

function DirectCallControls({ currentUserEmail, RemoteUserEmail }: { currentUserEmail: string, RemoteUserEmail: string }) {
    const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'RECEIVING_CALL' | 'IN_CALL'>('IDLE');
    const [remoteUserEmail, setRemoteUserEmail] = useState('');
    const [rtmClient, setRtmClient] = useState(null);
    const rtcClient = useRTCClient();
    const [userId, setUserId] = useState(null);

    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected(); // Store the user's connection status
    const [appId, setAppId] = useState(process.env.NEXT_PUBLIC_AGORA_APP_ID);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);
    usePublish([localMicrophoneTrack]);


    const remoteUsers = useRemoteUsers();

    //setRemoteUserEmail(RemoteUserEmail);
    // Initialize RTM Client (Signaling)
    useEffect(() => {
        const initRTM = async () => {
            const { RTM } = AgoraRTM;

            // 1. Check if a client already exists in the local state.
            if (rtmClient) return; // Prevents re-running initialization if already set

            const client = new RTM(appId, getUserId(currentUserEmail));

            setRtmClient(client);

            const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(currentUserEmail))}`);
            const data = await response.json();
            if (!data.rtmToken) {
                console.error("Token fetch failed or token is empty.");
                return; // Stop execution if no token
            }
            setUserId(data.userId);
            await client.login({ token: data.rtmToken });

            // V2 uses the 'message' event on the 'messaging' property
            client.addEventListener('message', event => {
                const signal = event.customType;
                console.log('peerId:', event.publisher, 'signal:', signal);
                if (signal === 'CALL_INVITE') {
                    setRemoteUserEmail(event.publisher);
                    setCallState('RECEIVING_CALL');
                } else if (signal === 'CALL_END') {
                    setCallState('IDLE');
                    setRemoteUserEmail('');
                    handleLeave();
                }
            });
            /*client.messaging.on('message', (message: { text: string }, peerId: string) => {
                const signal = JSON.parse(message.text);
                console.log('peerId:', peerId);
                if (signal.type === 'CALL_INVITE') {
                    setRemoteUserEmail(peerId);
                    setCallState('RECEIVING_CALL');
                } else if (signal.type === 'CALL_END') {
                    handleLeave();
                }
            });*/

            //await client.subscribe(getDirectChannelName(currentUserEmail, RemoteUserEmail))

        };

        initRTM();

        return () => {
            if (rtmClient) {
                console.log('rtm logout');
                rtmClient.logout();
            }
        };
    }, [currentUserEmail]);

    // RTC Handlers
    const handleJoin = useCallback(async (channelName: string, uid: number) => {
        const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(RemoteUserEmail))}&channelName=${encodeURIComponent(getDirectChannelName(currentUserEmail, RemoteUserEmail))}`);
        if (!response.ok) {
            console.error("Failed to fetch RTC token");
            setCallState('IDLE');
            return;
        }
        const data = await response.json();
        if (!data.rtcToken || !data.appId) {
            console.error("RTC token or App ID missing from API response.");
            setCallState('IDLE');
            return;
        }
        // Use type assertions to fix type conflicts
        await (rtcClient.join as unknown as Function)(data.appId, channelName, data.rtcToken, uid);
        setCallState('IN_CALL');
    },[rtcClient, RemoteUserEmail, setCallState]);

    const handleLeave = async () => {
        await rtcClient.leave();
        if (rtmClient && remoteUserEmail) {
            // Notify the other user the call ended
            console.log(remoteUserEmail);
            const payload = "CALL_END";
            const options = {
                customType: "CALL_END",
                channelType: "USER",
            };
            await rtmClient.publish(getUserId(remoteUserEmail), payload, options);
            setCallState('IDLE');
            setRemoteUserEmail('');
        }
    };

    // UI Actions
    const callUser = async (targetEmail: string) => {

        //const channelName = getDirectChannelName(currentUserEmail, targetEmail);
        setRemoteUserEmail(targetEmail);
        setCallState('CALLING');
        const payload = "CALL_INVITE";
        const options = {
            customType: "CALL_INVITE",
            channelType: "USER",
        };
        await rtmClient.publish(getUserId(targetEmail), payload, options);
        //if (rtmClient && rtmClient.messaging) {
        /* await rtmClient.sendMessageToPeer(
             { text: JSON.stringify({ type: 'CALL_INVITE', channel: channelName }) },
             targetEmail
         );*/
        //}
    };

    const answerCall = async () => {
        //setChannel(getDirectChannelName(currentUserEmail, RemoteUserEmail));
        //const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(RemoteUserEmail))}&channelName=${channel}`);
        const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(RemoteUserEmail))}`);
        const data = await response.json();
        //setRtcToken(data.rtcToken);
        //setCalling(true);
        const channel = getDirectChannelName(currentUserEmail, RemoteUserEmail);

        handleJoin(channel, data.numericUid);
    };

    if (callState === 'IN_CALL' || callState == 'CALLING') {
        return (
            <div>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={handleLeave}>End Call</button>
                {localMicrophoneTrack && <LocalUser audioTrack={localMicrophoneTrack} />}
                {remoteUsers.map((user) => (
                    <RemoteUser user={user} key={user.uid} />
                ))}
            </div>
        );
    }

    if (callState === 'RECEIVING_CALL') {

        return (
            <div>
                <p>Incoming call from: {remoteUserEmail}</p>
                <button onClick={answerCall}>Answer</button>
                <button onClick={handleLeave}>Decline</button>
            </div>
        );
    }

    // IDLE state (Lobby UI)
    return (
        <div>
            <button onClick={() => callUser(RemoteUserEmail)}>
                Call User
            </button>
        </div>
    );
}

// Wrapper Component with Providers
export default function ({ userEmail, remoteUserEmail }: { userEmail: string, remoteUserEmail: string }) {
    // Use type assertions to fix type conflicts
    const rtcClient = useRTCClient(AgoraRTC.createClient(clientConfig) as unknown as IAgoraRTCClient);

    return (
        <AgoraRTCProvider client={rtcClient}>
            <DirectCallControls currentUserEmail={userEmail} RemoteUserEmail={remoteUserEmail} />
        </AgoraRTCProvider>
    );
}
