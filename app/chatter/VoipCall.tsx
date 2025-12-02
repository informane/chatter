'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    useRTCClient,
    LocalUser,
    RemoteUser,
    LocalVideoTrack,
    LocalAudioTrack,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    useRemoteUsers,
    useRemoteAudioTracks,
    useRemoteVideoTracks,
    RemoteAudioTrack,
    RemoteVideoTrack,
    ILocalTrack
} from 'agora-rtc-react';
//import useMicrophoneAndCameraTracks from "agora-rtc-react";
import AgoraRTM from 'agora-rtm-sdk';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

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

export default function VoipCall({ currentUserEmail, targetUserEmail }: { currentUserEmail: string, targetUserEmail: string }) {

    const { RTM } = AgoraRTM;
    const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'RECEIVING_CALL' | 'IN_CALL'>('IDLE');
    const [remoteUserEmail] = useState(targetUserEmail);
    const rtmClient = useRef(null);
    const rtcClient = useRTCClient();

    const rtcToken = useRef(null);
    const uid = useRef(null);

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const userId = getUserId(currentUserEmail);
    const channel = getDirectChannelName(currentUserEmail, targetUserEmail);

    //const { localAudioTrack, localVideoTrack, isLoading, error } = useMicrophoneAndCameraTracks();

    const { error: micError, isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { error: camError, isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
    const localVideoTrack = useRef<ICameraVideoTrack | null>(null);

    //const { localAudioTrack, localVideoTrack, isLoading, error } = usetMicrophoneAndCameraTracks();

    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);
    const { videoTracks } = useRemoteVideoTracks(remoteUsers);
    console.log(remoteUsers, currentUserEmail, targetUserEmail);
    //const { audioTracks } = useRemoteAudioTracks(remoteUsers);
    //audioTracks.map((track) => { track.play(); track.setVolume(100) });



    //usePublish([localMicrophoneTrack, localCameraTrack]);

    const [isMicMuted, setIsMicMuted] = useState(false);

    /*const toggleMicMute = () => {
        if (localMicrophoneTrack) {
            localMicrophoneTrack.setEnabled(true);
            const newMutedState = !isMicMuted;
            localMicrophoneTrack.setMuted(newMutedState);
            setIsMicMuted(newMutedState); // Update React state for UI
        }
    };*/
    // Initialize RTM Client (Signaling) and RTC options(Voice Calling)
    useEffect(() => {

        const init = async () => {

            const response = await fetch(`/api/token?userId=${encodeURIComponent(userId)}&channelName=${encodeURIComponent(channel)}`);
            const data = await response.json();
            if (!data.rtmToken || !data.rtcToken) {
                console.error("Token fetch failed or token is empty.");
                return; // Stop execution if no token
            }
            //setUid(data.numericUId);
            rtcToken.current = data.rtcToken;
            uid.current = data.numericUid;

            console.log(rtcToken.current, uid.current);
            const client = new RTM(appId, userId);
            await client.login({ token: data.rtmToken });
            rtmClient.current = client;
            rtmClient.current.addEventListener('message', (event) => {
                const signal = event.customType;

                if (signal === 'CALL_INVITE') {
                    console.log(event.publisher);
                    setCallState('RECEIVING_CALL');
                } else if (signal === 'CALL_ANSWERED') {
                    handleJoin();

                } else if (signal === 'CALL_END') {
                    setCallState('IDLE');
                    handleLeave();
                }
            });
        }

        init()

        return () => {
            if (rtmClient) {
                console.log('rtm logout');
                rtmClient.current.logout();
            }

            if (rtcClient) {
                rtcClient.leave();
            }
        };
    }, []);


    var handleJoin = useCallback(async () => {

        console.log(appId, channel, rtcToken.current);
        await rtcClient.join(appId, channel, rtcToken.current, uid.current);

        //const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        localAudioTrack.current = audioTrack;
        localVideoTrack.current = videoTrack;
        if(/*audioTrack && */videoTrack){
            await rtcClient.publish(/*[localAudioTrack.current, */localVideoTrack.current/*]*/ as unknown as ILocalTrack);
            //await rtcClient.publish([audioTrack, videoTrack] as unknown as ILocalTrack[]);
        } else throw new Error('no audio or video track!');

        //await rtcClient.publish([localAudioTrack!, localVideoTrack!] as unknown as ILocalTrack[]);
        //while (isLoadingCam || isLoadingMic) { }
        //await rtcClient.publish([localCameraTrack, localMicrophoneTrack]);
        //await rtcClient.publish(localCameraTrack);
        console.log("Publish success!");
    }, []);

    var handleLeave = useCallback(async () => {

        if (callState === 'IN_CALL' || callState == 'CALLING' || callState == 'RECEIVING_CALL') {
            // Notify the other user the call ended

            const payload = "CALL_END";
            const options = {
                customType: "CALL_END",
                channelType: "USER",
            };
            if (rtmClient.current) {
                await rtmClient.current.publish(getUserId(remoteUserEmail), payload, options);
            }
        }
        await rtcClient.leave();
    }, [callState]);

    // UI Actions
    const callUser = async (targetEmail: string) => {

        setCallState('CALLING');
        const payload = 'CALL_INVITE';
        const options = {
            customType: "CALL_INVITE",
            channelType: "USER",
        };
        if (rtmClient.current) {
            await rtmClient.current.publish(getUserId(targetEmail), payload, options);
        }
    };

    const answerCall = async () => {
        await handleJoin();
        setCallState('IN_CALL');

        const payload = "CALL_ANSWERED";
        const options = {
            customType: "CALL_ANSWERED",
            channelType: "USER",
        }
        await rtmClient.current.publish(getUserId(targetUserEmail), payload, options);

    };

    const cancelCall = async () => {
        await handleLeave();
        setCallState('IDLE');
    }

    if (callState === 'IN_CALL' || callState == 'CALLING') {

        //if (!isLoadingCam && !isLoadingMic)         
        /*if (camError)
            return (<div>{camError.message}</div>)

        if (micError)
            return (<div>{micError.message}</div>)*/
        return (
            <div className='call-wrapper'>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={cancelCall}>End Call</button>

                {/*<button onClick={toggleMicMute}>
                    {isMicMuted ? 'Unmute Mic 🔇' : 'Mute Mic 🎤'}
                </button>*/}
                {<LocalVideoTrack track={localCameraTrack} play={true} />}
                {<LocalAudioTrack track={localMicrophoneTrack} />}
                <div className="video-grid-container">
                    {/* Render each remote video track in its own container */}
                    {videoTracks.map((track) => (
                        <div key={track.getUserId()} className="video-card">
                            <RemoteVideoTrack
                                track={track}
                                play={true} // Ensures playback starts
                                // Style the container/video element here if needed
                                style={{ width: '100%', height: '100%' }}
                            />
                            <p>User UID: {track.getUserId()}</p>
                        </div>
                    ))}

                    {/* Render each remote audio track (audio only, no UI needed) */}
                    {audioTracks.map((track) => (
                        <RemoteAudioTrack
                            key={track.getUserId()}
                            track={track}
                            play={true} // Ensures audio playback
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (callState === 'RECEIVING_CALL') {

        return (
            <div className='call-wrapper'>
                <p>Incoming call from: {remoteUserEmail}</p>
                <button onClick={answerCall}>Answer</button>
                <button onClick={cancelCall}>Decline</button>
            </div>
        );
    }

    // IDLE state (Lobby UI)
    return (
        <div className='call-wrapper'>
            <button onClick={() => callUser(targetUserEmail)}>
                Call User
            </button>
        </div>
    );
}