'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    useRTCClient,
    useIsConnected,
    LocalUser,
    RemoteUser,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers
} from 'agora-rtc-react';

import AgoraRTM from 'agora-rtm-sdk';

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

export default function DirectCallControls({ currentUserEmail, targetUserEmail }: { currentUserEmail: string, targetUserEmail: string }) {

    const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'RECEIVING_CALL' | 'IN_CALL'>('IDLE');
    const [remoteUserEmail, setRemoteUserEmail] = useState('');
    const [rtmClient, setRtmClient] = useState(null);
    const rtcClient = useRTCClient();
    const [userId, setUserId] = useState(null);
    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected(); // Store the user's connection status
    const [appId, setAppId] = useState(process.env.NEXT_PUBLIC_AGORA_APP_ID);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack();
    usePublish([localMicrophoneTrack]);


    const remoteUsers = useRemoteUsers();

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

            //await client.subscribe(getDirectChannelName(currentUserEmail, RemoteUserEmail))

        };

        initRTM();

        return () => {
            if (rtmClient) {
                console.log('rtm logout');
                rtmClient.logout();
            }
        };
    }, [appId, rtmClient, handleLeave, currentUserEmail]);

    // RTC Handlers
    const handleJoin = useCallback(async (channelName: string, uid: number) => {
        const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(targetUserEmail))}&channelName=${encodeURIComponent(getDirectChannelName(currentUserEmail, targetUserEmail))}`);
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
    }, [rtcClient, currentUserEmail, targetUserEmail, setCallState]);

    var handleLeave = useCallback(async () => {
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
    }, [rtcClient, rtmClient, remoteUserEmail]);

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
    };

    const answerCall = async () => {
        //setChannel(getDirectChannelName(currentUserEmail, RemoteUserEmail));
        //const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(RemoteUserEmail))}&channelName=${channel}`);
        const response = await fetch(`/api/token?userId=${encodeURIComponent(getUserId(targetUserEmail))}`);
        const data = await response.json();
        //setRtcToken(data.rtcToken);
        //setCalling(true);
        const channel = getDirectChannelName(currentUserEmail, targetUserEmail);

        handleJoin(channel, data.numericUid);
    };

    if (callState === 'IN_CALL' || callState == 'CALLING') {

        return (
            <div>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={handleLeave}>End Call</button>
                {localMicrophoneTrack && <LocalUser audioTrack={localMicrophoneTrack} />}
                {
                    remoteUsers.map((user) => (
                        <RemoteUser user={user} key={user.uid} />
                    ))
                }
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
            <button onClick={() => callUser(targetUserEmail)}>
                Call User
            </button>
        </div>
    );
}