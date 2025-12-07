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
import { sendPushCall, sendPushHangUp } from 'app/lib/chatter';
import { ChatTokenBuilder } from 'agora-token';
import { stat } from 'fs';


// Helper function to generate a consistent channel name for a 1:1 call
const getDirectChannelName = (email1: string, email2: string) => {
    email1 = email1.replaceAll('.', '');
    email2 = email2.replaceAll('.', '');
    const sortedEmails = [email1, email2].sort();

    return `direct_call_${sortedEmails[0]}_${sortedEmails[1]}`;
};

const getUserId = (email1: string, email2: string) => {
    email1 = email1.replaceAll('.', '');
    email2 = email2.replaceAll('.', '');

    return `direct_call_${email1}_${email2}`;
};

function isTrackPublished(agoraClient, trackToCheck) {
    const published = agoraClient.localTracks.includes(trackToCheck);

    if (published) {
        console.log("The track is currently published.");
    } else {
        console.log("The track is not currently published.");
    }
    return published;
}

/*const checkUserStatus = async (rtmClient, targetUserId: string, channelName: string) => {
  try {
    // This fetches the activity of specific users in a specific channel
    const response = await rtmClient.presence.getUsers({
      channelName: channelName,
      channelType: 'message', // Or 'stream' if using RTC channels
      userIds: [targetUserId]
    });

    if (response.users && response.users.length > 0) {
      console.log(`User ${targetUserId} is currently online in ${channelName}.`);
      return true;
    } else {
      console.log(`User ${targetUserId} is offline or not in ${channelName}.`);
      return false;
    }

  } catch (error) {
    console.error("Failed to query user presence:", error);
    return false;
  }
};*/

export default function VoipCall({ state, chatId, oneSignalUserId, currentUserEmail, targetUserEmail }: { state: string, chatId: string, oneSignalUserId: string, currentUserEmail: string, targetUserEmail: string }) {

    const { RTM } = AgoraRTM;
    const [callState, setCallState] = useState(state ? state : 'IDLE');
    const [remoteUserEmail] = useState(targetUserEmail);
    const rtmClient = useRef(null);
    const rtcClient = useRTCClient();
    const isInited = useRef(false);
    const rtcToken = useRef(null);
    const uid = useRef(null);

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const userId = getUserId(currentUserEmail, targetUserEmail);
    console.log('userId: ', userId)
    const channel = getDirectChannelName(currentUserEmail, targetUserEmail);

    //const { localAudioTrack, localVideoTrack, isLoading, error } = useMicrophoneAndCameraTracks();

    const { error: micError, isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { error: camError, isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const isLoadingDevices = !localMicrophoneTrack || !localCameraTrack;
    /*const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
    const localVideoTrack = useRef<ICameraVideoTrack | null>(null);*/

    //const { localAudioTrack, localVideoTrack, isLoading, error } = usetMicrophoneAndCameraTracks();

    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);
    const { videoTracks } = useRemoteVideoTracks(remoteUsers);
    //audioTracks.map((track) => { track.play(); track.setVolume(100) });



    //usePublish([localMicrophoneTrack, localCameraTrack]);

    const [isMicMuted, setIsMicMuted] = useState(false);

    const toggleMicMute = () => {
        if (localMicrophoneTrack) {
            localMicrophoneTrack.setEnabled(true);
            const newMutedState = !isMicMuted;
            localMicrophoneTrack.setMuted(newMutedState);
            setIsMicMuted(newMutedState);
        }
    };

    const [isCameraMuted, setIsCameraMuted] = useState(false);

    const toggleCameraMute = () => {
        if (localCameraTrack) {
            const newMutedState = !isCameraMuted;
            localCameraTrack.setEnabled(!newMutedState);
            //localCameraTrack.setMuted(newMutedState);
            setIsCameraMuted(newMutedState);
        }
    };


    var handleConnectionStateChange = (state: string, reason: string) => {
        console.log('Connection State Changed:', state, 'Reason:', reason);
        // This is key: If kicked out due to conflict, manually logout before trying again later
        if (state === 'ABORTED' && reason === 'UID_CONFLICT') {
            console.log("Conflict detected, forcing logout to clear session.");
            rtmClient.current.logout();
        }
    };
    // Initialize RTM Client (Signaling) and RTC options(Voice Calling)
    useEffect(() => {

        const init = async () => {

            const response = await fetch(`/api/token?userId=${encodeURIComponent(userId)}&channelName=${encodeURIComponent(channel)}`);
            const data = await response.json();
            if (!data.rtmToken || !data.rtcToken) {
                console.error("Token fetch failed or token is empty.");
                return;
            }

            rtcToken.current = data.rtcToken;
            uid.current = data.numericUid;

            console.log(remoteUsers, currentUserEmail, targetUserEmail, channel, isInited.current);
            const client = new RTM(appId, userId);
            await client.login({ token: data.rtmToken });
            rtmClient.current = client;

            rtmClient.current.addEventListener('connection-state-change', handleConnectionStateChange);

            rtmClient.current.addEventListener('message', (event) => {
                const signal = event.customType;

                if (signal === 'CALL_INVITE') {
                    console.log(event.publisher);
                    setCallState('RECEIVING_CALL');
                } else if (signal === 'CALL_ANSWERED') {
                    handleJoin(localCameraTrack, localMicrophoneTrack);

                } else if (signal === 'CALL_END') {

                    handleLeave();
                }
            });
        }

        if (!isLoadingDevices && !isInited.current && !rtmClient.current) {

            setTimeout(async function () {
                console.log("tracks: ", isLoadingDevices, localCameraTrack, localMicrophoneTrack, isInited.current);
                isInited.current = true;
                await init()
                console.log('state:', state, callState);
                if (callState == 'RECEIVING_CALL') {
                    await answerCall();
                }
            }, 3000);
        }

        //await new Promise(resolve => setTimeout(resolve, 3000));
        return () => {

            if (rtmClient.current) {
                rtmClient.current.removeEventListener('connection-state-change', handleConnectionStateChange);
                rtmClient.current.logout();

            }

            if (rtcClient) {
                rtcClient.leave();
            }
        };
    }, [isLoadingDevices]);


    var handleJoin = async (localCameraTrack, localMicrophoneTrack) => {

        console.log(appId, channel, rtcToken.current);
        await rtcClient.join(appId, channel, rtcToken.current, uid.current);

        await rtcClient.publish([localCameraTrack, localMicrophoneTrack]);
        console.log("Publish success!");
    }

    var handleLeave = (async () => {
        if (localCameraTrack && rtcClient && isTrackPublished(rtcClient, localCameraTrack))
            await rtcClient.unpublish(localCameraTrack);
        if (localMicrophoneTrack && rtcClient && isTrackPublished(rtcClient, localMicrophoneTrack))
            await rtcClient.unpublish(localMicrophoneTrack);
        if (rtcClient) await rtcClient.leave();

        if (callState === 'IN_CALL' || callState == 'CALLING' || callState == 'RECEIVING_CALL') {
            setCallState('IDLE');
            // Notify the other user the call ended
            //const message = currentUserEmail + ' hanged up!';
            //const PushPromise = await sendPushHangUp(oneSignalUserId, chatId, message);
            const payload = "CALL_END";
            const options = {
                customType: "CALL_END",
                channelType: "USER",
            };
            if (rtmClient.current) {
                await rtmClient.current.publish(getUserId(targetUserEmail, currentUserEmail), payload, options);
            }
        }

    });

    // UI Actions
    const callUser = async () => {

        //if(!checkUserStatus(rtmClient, getUserId(targetUserEmail, currentUserEmail), channelName: string) {};
        setCallState('CALLING');
        const message = currentUserEmail + ' is calling!';
        const PushPromise = await sendPushCall(oneSignalUserId, chatId, 'RECEIVING_CALL', message);
        console.log(PushPromise);
        const payload = 'CALL_INVITE';
        const options = {
            customType: "CALL_INVITE",
            channelType: "USER",
        };
        /*if (rtmClient.current) {
            await rtmClient.current.publish(getUserId(targetUserEmail, currentUserEmail), payload, options);
        }*/
    };

    const answerCall = async () => {
        console.log('tracks: ', isLoadingDevices, localCameraTrack, localMicrophoneTrack)
        await handleJoin(localCameraTrack, localMicrophoneTrack);
        setCallState('IN_CALL');
        //const PushPromise = await sendPushCall(oneSignalUserId, chatId, 'IN_CALL', '');
        const payload = "CALL_ANSWERED";
        const options = {
            customType: "CALL_ANSWERED",
            channelType: "USER",
        }
        await rtmClient.current.publish(getUserId(targetUserEmail, currentUserEmail), payload, options);

    };

    const cancelCall = async () => {

        await handleLeave();

    }

    if (callState === 'IN_CALL' || callState == 'CALLING') {

        //if (!isLoadingCam && !isLoadingMic)         
        if (camError)
            return (<div>{camError.message}</div>)

        if (micError)
            return (<div>{micError.message}</div>)
        return (
            <div className='call-wrapper'>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={cancelCall}>End Call</button>
                <button onClick={toggleCameraMute}>
                    {isCameraMuted ? 'Unmute Video 📸' : 'Mute Video 🚫'}
                </button>
                {<button onClick={toggleMicMute}>
                    {isMicMuted ? 'Unmute Mic 🔇' : 'Mute Mic 🎤'}
                </button>}
                <div className='video-container'>
                    <div className="video-local">
                        {<LocalVideoTrack track={localCameraTrack} play={true} />}
                        {<LocalAudioTrack track={localMicrophoneTrack} play={true} />}
                    </div>
                    <div className="video-remote">
                        {/* Render each remote video track */}
                        {videoTracks.map((track) => (
                            <div key={track.getUserId()} className="video-card">
                                <RemoteVideoTrack
                                    track={track}
                                    play={true}
                                />
                                <p>Remote User UID: {track.getUserId()}</p>
                            </div>
                        ))}

                        {/* Render each remote audio track */}
                        {audioTracks.map((track) => (
                            <RemoteAudioTrack
                                key={track.getUserId()}
                                track={track}
                                play={true}
                            />
                        ))}
                    </div>
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
            <button onClick={() => callUser()}>
                Call User
            </button>
        </div>
    );
}