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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect } from 'react';
import { getConversationUser } from '../lib/chatter';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import VoipCallDynamic from './VoipCallDynamic';
function Messages(_a) {
    var _b;
    var chat_id = _a.chat_id;
    var _c = useState([]), messages = _c[0], setMessages = _c[1];
    var _d = useState(null), convUser = _d[0], setConvUser = _d[1];
    var eventSourceRef = useRef(null);
    var _e = useSession(), session = _e.data, status = _e.status;
    //const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
    useEffect(function () {
        function initialFetch(chat_id) {
            return __awaiter(this, void 0, void 0, function () {
                var msgPromise, msgs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch('/api/message/current?chat_id=' + chat_id)];
                        case 1:
                            msgPromise = _a.sent();
                            return [4 /*yield*/, msgPromise.json()];
                        case 2:
                            msgs = _a.sent();
                            setMessages(msgs.data);
                            return [2 /*return*/];
                    }
                });
            });
        }
        initialFetch(chat_id);
        if (eventSourceRef.current)
            return;
        var eventSource = new EventSource('/api/message/current/update?chat_id=' + chat_id);
        eventSourceRef.current = eventSource;
        eventSourceRef.current.onmessage = function (event) {
            var data = JSON.parse(event.data);
            var addedMessage = data;
            setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], prevMessages, true), [addedMessage], false); });
        };
        eventSourceRef.current.onerror = function (error) {
            console.log(JSON.stringify(error));
            eventSourceRef.current.close();
        };
        return function () {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
                console.log('Closing EventSource connection');
            }
        };
    }, [chat_id]);
    var router = useRouter();
    useEffect(function () {
        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        }
    }, [status, router]);
    useEffect(function () {
        if (status !== 'loading') {
            var messageWindow = document.getElementsByClassName('message-list')[0];
            if (messageWindow) {
                var messageWindowHeight = messageWindow.scrollHeight;
                messageWindow.scrollTop = messageWindowHeight;
                console.log(messageWindowHeight, messageWindow.scrollTop);
            }
        }
    }, [status]);
    useEffect(function () {
        var _a;
        function handleGetConversationUser(chatId, email) {
            return __awaiter(this, void 0, void 0, function () {
                var convUserRes, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, getConversationUser(chatId, email)];
                        case 1:
                            convUserRes = _b.apply(_a, [_c.sent()]);
                            setConvUser(convUserRes);
                            return [2 /*return*/];
                    }
                });
            });
        }
        ;
        handleGetConversationUser(chat_id, (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email);
    }, [chat_id, (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.email]);
    if (status === 'loading' || !convUser) {
        return <p>Loading session...</p>;
    }
    var messageList = messages.map(function (value, index) {
        var _a;
        var msgDate = new Date(messages[index].createdAt);
        return (<div className={((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name) === messages[index].user.name ? 'message message-self' : 'message'} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>);
    });
    //
    return (<div className='messages'>
                <h3 className='message-list-header'>
                    Conversation: {convUser === null || convUser === void 0 ? void 0 : convUser.name}
                    <VoipCallDynamic userEmail={session.user.email} targetUserEmail={convUser.email}/>
                </h3>
                <div className='message-list'>
                    {messageList}
                </div>
            </div>);
}
export default Messages;
