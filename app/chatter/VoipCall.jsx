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
import React, { useState, useEffect, useCallback } from 'react';
import { AgoraRTCProvider, useRTCClient, LocalUser, RemoteUser, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
var clientConfig = { mode: "rtc", codec: "vp8" };
// Helper function to generate a consistent channel name for a 1:1 call
var getDirectChannelName = function (email1, email2) {
    var sortedEmails = [email1, email2].sort();
    return "direct_call_".concat(sortedEmails[0], "_").concat(sortedEmails[1]);
};
function DirectCallControls(_a) {
    var _this = this;
    var currentUserEmail = _a.currentUserEmail, RemoteUserEmail = _a.RemoteUserEmail;
    var _b = useState('IDLE'), callState = _b[0], setCallState = _b[1];
    var _c = useState(''), remoteUserEmail = _c[0], setRemoteUserEmail = _c[1];
    var _d = useState(null), rtmClient = _d[0], setRtmClient = _d[1];
    var rtcClient = useRTCClient();
    var localMicrophoneTrack = useLocalMicrophoneTrack().localMicrophoneTrack;
    usePublish([localMicrophoneTrack]);
    var remoteUsers = useRemoteUsers();
    var sessionId = useState(Math.random().toString(36).substring(2, 9));
    var rtmUid = "user_".concat(currentUserEmail.length % 65535 || 1, "_").concat(sessionId);
    // Initialize RTM Client (Signaling)
    useEffect(function () {
        var initRTM = function () { return __awaiter(_this, void 0, void 0, function () {
            var RTM, appId, client, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        RTM = AgoraRTM.RTM;
                        appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
                        // 1. Check if a client already exists in the local state.
                        if (rtmClient)
                            return [2 /*return*/]; // Prevents re-running initialization if already set
                        client = new RTM(appId, rtmUid);
                        setRtmClient(client);
                        return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(rtmUid)))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!data.rtmToken) {
                            console.error("Token fetch failed or token is empty.");
                            return [2 /*return*/]; // Stop execution if no token
                        }
                        return [4 /*yield*/, client.login({ token: data.rtmToken })];
                    case 3:
                        _a.sent();
                        // V2 uses the 'message' event on the 'messaging' property
                        client.on('user-published', function (message, peerId) {
                            var signal = JSON.parse(message.text);
                            console.log('peerId:', peerId);
                            if (signal.type === 'CALL_INVITE') {
                                setRemoteUserEmail(peerId);
                                setCallState('RECEIVING_CALL');
                            }
                            else if (signal.type === 'CALL_END') {
                                handleLeave();
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        initRTM();
        return function () {
            if (rtmClient) {
                console.log('rtm logout');
                rtmClient.logout();
            }
        };
    }, [currentUserEmail, rtmUid]);
    // RTC Handlers
    var handleJoin = useCallback(function (channelName, uid) { return __awaiter(_this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(currentUserEmail), "&channelName=").concat(encodeURIComponent(channelName)))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    // Use type assertions to fix type conflicts
                    return [4 /*yield*/, rtcClient.join(data.appId, channelName, data.rtcToken, uid)];
                case 3:
                    // Use type assertions to fix type conflicts
                    _a.sent();
                    setCallState('IN_CALL');
                    return [2 /*return*/];
            }
        });
    }); }, [rtcClient, currentUserEmail]);
    var handleLeave = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rtcClient.leave()];
                case 1:
                    _a.sent();
                    if (!(rtmClient && remoteUserEmail)) return [3 /*break*/, 3];
                    // Notify the other user the call ended
                    return [4 /*yield*/, rtmClient.messaging.sendMessageToPeer({ text: JSON.stringify({ type: 'CALL_END' }) }, remoteUserEmail)];
                case 2:
                    // Notify the other user the call ended
                    _a.sent();
                    _a.label = 3;
                case 3:
                    setCallState('IDLE');
                    setRemoteUserEmail('');
                    return [2 /*return*/];
            }
        });
    }); };
    // UI Actions
    var callUser = function (targetEmail) { return __awaiter(_this, void 0, void 0, function () {
        var channelName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channelName = getDirectChannelName(currentUserEmail, targetEmail);
                    setRemoteUserEmail(targetEmail);
                    setCallState('CALLING');
                    if (!(rtmClient && rtmClient.messaging)) return [3 /*break*/, 2];
                    return [4 /*yield*/, rtmClient.sendMessageToPeer({ text: JSON.stringify({ type: 'CALL_INVITE', channel: channelName }) }, targetEmail)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var answerCall = function () { return __awaiter(_this, void 0, void 0, function () {
        var channelName, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channelName = getDirectChannelName(currentUserEmail, remoteUserEmail);
                    return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(currentUserEmail)))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    handleJoin(channelName, data.uid);
                    return [2 /*return*/];
            }
        });
    }); };
    if (callState === 'IN_CALL') {
        return (<div>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={handleLeave}>End Call</button>
                {localMicrophoneTrack && <LocalUser audioTrack={localMicrophoneTrack}/>}
                {remoteUsers.map(function (user) { return (<RemoteUser user={user} key={user.uid}/>); })}
            </div>);
    }
    if (callState === 'RECEIVING_CALL') {
        console.log('recieve', currentUserEmail, RemoteUserEmail);
        return (<div>
                <p>Incoming call from: {remoteUserEmail}</p>
                <button onClick={answerCall}>Answer</button>
                <button onClick={handleLeave}>Decline</button>
            </div>);
    }
    console.log(currentUserEmail, RemoteUserEmail);
    // IDLE state (Lobby UI)
    return (<div>
            <input type="email" onChange={function (e) { return setRemoteUserEmail(e.target.value); }} value={RemoteUserEmail}/>
            <button onClick={function () { return callUser(RemoteUserEmail); }} disabled={RemoteUserEmail === currentUserEmail}>
                Call User
            </button>
        </div>);
}
// Wrapper Component with Providers
export default function (_a) {
    var userEmail = _a.userEmail, remoteUserEmail = _a.remoteUserEmail;
    // Use type assertions to fix type conflicts
    var rtcClient = useRTCClient(AgoraRTC.createClient(clientConfig));
    return (<AgoraRTCProvider client={rtcClient}>
            <DirectCallControls currentUserEmail={userEmail} RemoteUserEmail={remoteUserEmail}/>
        </AgoraRTCProvider>);
}
