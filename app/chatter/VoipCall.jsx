'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRTCClient, LocalUser, RemoteUser, useLocalMicrophoneTrack, usePublish, useRemoteUsers, } from 'agora-rtc-react';
import AgoraRTM from 'agora-rtm-sdk';
// Helper function to generate a consistent channel name for a 1:1 call
var getDirectChannelName = function (email1, email2) {
    email1 = email1.replaceAll('.', '');
    email2 = email2.replaceAll('.', '');
    var sortedEmails = [email1, email2].sort();
    return "direct_call_".concat(sortedEmails[0], "_").concat(sortedEmails[1]);
};
var getUserId = function (email) {
    email = email.replaceAll('.', '');
    return email;
};
export default function VoipCall(_a) {
    var _this = this;
    var currentUserEmail = _a.currentUserEmail, targetUserEmail = _a.targetUserEmail;
    var RTM = AgoraRTM.RTM;
    var _b = __read(useState('IDLE'), 2), callState = _b[0], setCallState = _b[1];
    var _c = __read(useState(targetUserEmail), 1), remoteUserEmail = _c[0];
    var rtmClient = useRef(null);
    var rtcClient = useRTCClient();
    //const [uid, setUid] = useState(null);
    var rtcToken = useRef(null);
    var uid = useRef(null);
    //const [calling, setCalling] = useState(false);
    var appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    var userId = getUserId(currentUserEmail);
    var channel = getDirectChannelName(currentUserEmail, targetUserEmail);
    var _d = useLocalMicrophoneTrack(), error = _d.error, isLoading = _d.isLoading, localMicrophoneTrack = _d.localMicrophoneTrack;
    var remoteUsers = useRemoteUsers();
    console.log(remoteUsers, currentUserEmail, targetUserEmail);
    /*const { audioTracks } = useRemoteAudioTracks(remoteUsers);
    audioTracks.map((track) => { track.play(); track.setVolume(100) });*/
    usePublish([localMicrophoneTrack]);
    var _e = __read(useState(false), 2), isMicMuted = _e[0], setIsMicMuted = _e[1];
    var toggleMicMute = function () {
        if (localMicrophoneTrack) {
            localMicrophoneTrack.setEnabled(true);
            var newMutedState = !isMicMuted;
            localMicrophoneTrack.setMuted(newMutedState);
            setIsMicMuted(newMutedState); // Update React state for UI
        }
    };
    // Initialize RTM Client (Signaling) and RTC options(Voice Calling)
    useEffect(function () {
        var init = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(userId), "&channelName=").concat(encodeURIComponent(channel)))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!data.rtmToken || !data.rtcToken) {
                            console.error("Token fetch failed or token is empty.");
                            return [2 /*return*/]; // Stop execution if no token
                        }
                        //setUid(data.numericUId);
                        rtcToken.current = data.rtcToken;
                        uid.current = data.numericUid;
                        console.log(rtcToken.current, uid.current);
                        client = new RTM(appId, userId);
                        return [4 /*yield*/, client.login({ token: data.rtmToken })];
                    case 3:
                        _a.sent();
                        rtmClient.current = client;
                        rtmClient.current.addEventListener('message', function (event) {
                            var signal = event.customType;
                            if (signal === 'CALL_INVITE') {
                                console.log(event.publisher);
                                setCallState('RECEIVING_CALL');
                            }
                            else if (signal === 'CALL_ANSWERED') {
                                handleJoin();
                            }
                            else if (signal === 'CALL_END') {
                                setCallState('IDLE');
                                handleLeave();
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        init();
        //await client.subscribe(getDirectChannelName(currentUserEmail, RemoteUserEmail))
        return function () {
            if (rtmClient) {
                console.log('rtm logout');
                rtmClient.current.logout();
            }
        };
    }, []);
    var handleJoin = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(appId, channel, rtcToken.current);
                    return [4 /*yield*/, rtcClient.join(appId, channel, rtcToken.current, uid.current)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleLeave = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var payload, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(callState === 'IN_CALL' || callState == 'CALLING' || callState == 'RECEIVING_CALL')) return [3 /*break*/, 2];
                    payload = "CALL_END";
                    options = {
                        customType: "CALL_END",
                        channelType: "USER",
                    };
                    return [4 /*yield*/, rtmClient.current.publish(getUserId(remoteUserEmail), payload, options)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    console.log("CAll state:", callState);
                    return [4 /*yield*/, rtcClient.leave()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [callState]);
    // UI Actions
    var callUser = function (targetEmail) { return __awaiter(_this, void 0, void 0, function () {
        var payload, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCallState('CALLING');
                    payload = 'CALL_INVITE';
                    options = {
                        customType: "CALL_INVITE",
                        channelType: "USER",
                    };
                    return [4 /*yield*/, rtmClient.current.publish(getUserId(targetEmail), payload, options)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var answerCall = function () { return __awaiter(_this, void 0, void 0, function () {
        var payload, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleJoin()];
                case 1:
                    _a.sent();
                    setCallState('IN_CALL');
                    payload = "CALL_ANSWERED";
                    options = {
                        customType: "CALL_ANSWERED",
                        channelType: "USER",
                    };
                    return [4 /*yield*/, rtmClient.current.publish(getUserId(targetUserEmail), payload, options)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var cancelCall = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleLeave()];
                case 1:
                    _a.sent();
                    setCallState('IDLE');
                    return [2 /*return*/];
            }
        });
    }); };
    if (callState === 'IN_CALL' || callState == 'CALLING') {
        console.log("state:" + callState, "users: " + JSON.stringify(remoteUsers));
        return (<div className='call-wrapper'>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={cancelCall}>End Call</button>
                <button onClick={toggleMicMute}>
                    {isMicMuted ? 'Unmute Mic 🔇' : 'Mute Mic 🎤'}
                </button>
                {localMicrophoneTrack && <LocalUser audioTrack={localMicrophoneTrack}/>}
                {remoteUsers.map(function (user) { return (<div key={user.uid}>
                            {/*
                    user._audio_muted_ ? (
                        <span style={{ color: 'red', marginLeft: '10px' }}>🔇Remote is Muted</span>
                    ) : (
                        <span style={{ color: 'green', marginLeft: '10px' }}>🎤Remote is Unmuted</span>
                    )
                */}
                            <RemoteUser user={user}/>
                        </div>); })}
            </div>);
    }
    if (callState === 'RECEIVING_CALL') {
        return (<div className='call-wrapper'>
                <p>Incoming call from: {remoteUserEmail}</p>
                <button onClick={answerCall}>Answer</button>
                <button onClick={cancelCall}>Decline</button>
            </div>);
    }
    // IDLE state (Lobby UI)
    return (<div className='call-wrapper'>
            <button onClick={function () { return callUser(targetUserEmail); }}>
                Call User
            </button>
        </div>);
}
