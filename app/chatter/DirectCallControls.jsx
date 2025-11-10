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
import { useRTCClient, useIsConnected, LocalUser, RemoteUser, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from 'agora-rtc-react';
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
export default function DirectCallControls(_a) {
    var _this = this;
    var currentUserEmail = _a.currentUserEmail, targetUserEmail = _a.targetUserEmail;
    var _b = useState('IDLE'), callState = _b[0], setCallState = _b[1];
    var _c = useState(''), remoteUserEmail = _c[0], setRemoteUserEmail = _c[1];
    var _d = useState(null), rtmClient = _d[0], setRtmClient = _d[1];
    var rtcClient = useRTCClient();
    var _e = useState(null), userId = _e[0], setUserId = _e[1];
    var _f = useState(false), calling = _f[0], setCalling = _f[1];
    var isConnected = useIsConnected(); // Store the user's connection status
    var _g = useState(process.env.NEXT_PUBLIC_AGORA_APP_ID), appId = _g[0], setAppId = _g[1];
    var localMicrophoneTrack = useLocalMicrophoneTrack(true).localMicrophoneTrack;
    usePublish([localMicrophoneTrack]);
    var remoteUsers = useRemoteUsers();
    // Initialize RTM Client (Signaling)
    useEffect(function () {
        var initRTM = function () { return __awaiter(_this, void 0, void 0, function () {
            var RTM, client, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        RTM = AgoraRTM.RTM;
                        // 1. Check if a client already exists in the local state.
                        if (rtmClient)
                            return [2 /*return*/]; // Prevents re-running initialization if already set
                        client = new RTM(appId, getUserId(currentUserEmail));
                        setRtmClient(client);
                        return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(getUserId(currentUserEmail))))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!data.rtmToken) {
                            console.error("Token fetch failed or token is empty.");
                            return [2 /*return*/]; // Stop execution if no token
                        }
                        setUserId(data.userId);
                        return [4 /*yield*/, client.login({ token: data.rtmToken })];
                    case 3:
                        _a.sent();
                        // V2 uses the 'message' event on the 'messaging' property
                        client.addEventListener('message', function (event) {
                            var signal = event.customType;
                            console.log('peerId:', event.publisher, 'signal:', signal);
                            if (signal === 'CALL_INVITE') {
                                setRemoteUserEmail(event.publisher);
                                setCallState('RECEIVING_CALL');
                            }
                            else if (signal === 'CALL_END') {
                                setCallState('IDLE');
                                setRemoteUserEmail('');
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
    }, [appId, rtmClient, handleLeave, currentUserEmail]);
    // RTC Handlers
    var handleJoin = useCallback(function (channelName, uid) { return __awaiter(_this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(getUserId(targetUserEmail)), "&channelName=").concat(encodeURIComponent(getDirectChannelName(currentUserEmail, targetUserEmail))))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Failed to fetch RTC token");
                        setCallState('IDLE');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!data.rtcToken || !data.appId) {
                        console.error("RTC token or App ID missing from API response.");
                        setCallState('IDLE');
                        return [2 /*return*/];
                    }
                    // Use type assertions to fix type conflicts
                    return [4 /*yield*/, rtcClient.join(data.appId, channelName, data.rtcToken, uid)];
                case 3:
                    // Use type assertions to fix type conflicts
                    _a.sent();
                    setCallState('IN_CALL');
                    return [2 /*return*/];
            }
        });
    }); }, [rtcClient, currentUserEmail, targetUserEmail, setCallState]);
    var handleLeave = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var payload, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rtcClient.leave()];
                case 1:
                    _a.sent();
                    if (!(rtmClient && remoteUserEmail)) return [3 /*break*/, 3];
                    // Notify the other user the call ended
                    console.log(remoteUserEmail);
                    payload = "CALL_END";
                    options = {
                        customType: "CALL_END",
                        channelType: "USER",
                    };
                    return [4 /*yield*/, rtmClient.publish(getUserId(remoteUserEmail), payload, options)];
                case 2:
                    _a.sent();
                    setCallState('IDLE');
                    setRemoteUserEmail('');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [rtcClient, rtmClient, remoteUserEmail]);
    // UI Actions
    var callUser = function (targetEmail) { return __awaiter(_this, void 0, void 0, function () {
        var payload, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //const channelName = getDirectChannelName(currentUserEmail, targetEmail);
                    setRemoteUserEmail(targetEmail);
                    setCallState('CALLING');
                    payload = "CALL_INVITE";
                    options = {
                        customType: "CALL_INVITE",
                        channelType: "USER",
                    };
                    return [4 /*yield*/, rtmClient.publish(getUserId(targetEmail), payload, options)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var answerCall = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/token?userId=".concat(encodeURIComponent(getUserId(targetUserEmail))))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    channel = getDirectChannelName(currentUserEmail, targetUserEmail);
                    handleJoin(channel, data.numericUid);
                    return [2 /*return*/];
            }
        });
    }); };
    if (callState === 'IN_CALL' || callState == 'CALLING') {
        return (<div>
                <p>In call with: {remoteUserEmail}</p>
                <button onClick={handleLeave}>End Call</button>
                {localMicrophoneTrack && <LocalUser audioTrack={localMicrophoneTrack}/>}
                {remoteUsers.map(function (user) { return (<RemoteUser user={user} key={user.uid}/>); })}
            </div>);
    }
    if (callState === 'RECEIVING_CALL') {
        return (<div>
                <p>Incoming call from: {remoteUserEmail}</p>
                <button onClick={answerCall}>Answer</button>
                <button onClick={handleLeave}>Decline</button>
            </div>);
    }
    // IDLE state (Lobby UI)
    return (<div>
            <button onClick={function () { return callUser(targetUserEmail); }}>
                Call User
            </button>
        </div>);
}
