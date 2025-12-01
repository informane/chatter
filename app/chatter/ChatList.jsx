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
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Search from './Search';
import { getUserModelJson } from '../lib/chatter';
import Image from 'next/image';
import UserSearch from './UserSearch';
function ChatList(_a) {
    var _b;
    var newMessageChatId = _a.newMessageChatId, chat_id = _a.chat_id, onChangeChatId = _a.onChangeChatId, shown = _a.shown;
    //if chatlist is shown
    var _c = __read(useState(shown), 2), isShown = _c[0], setIsShown = _c[1];
    var _d = __read(useState(null), 2), NewMessageChatId = _d[0], setNewMessageChatId = _d[1];
    var _e = __read(useState(true), 2), chatListChanged = _e[0], setChatListChanged = _e[1];
    var _f = __read(useState(null), 2), userId = _f[0], setUserId = _f[1];
    var eventSourceRef = useRef(null);
    var _g = useSession(), session = _g.data, status = _g.status;
    var _h = __read(useState([]), 2), Chats = _h[0], setChats = _h[1];
    //const [state, formAction, isPending] = useActionState(addChat, {});
    var searchParams = useSearchParams();
    var _j = __read(useState((_b = searchParams.get('chat-search')) !== null && _b !== void 0 ? _b : ''), 2), term = _j[0], setTerm = _j[1];
    var _k = __read(useState({ message: null }), 2), error = _k[0], setError = _k[1];
    useEffect(function () {
        function initialFetch(term) {
            return __awaiter(this, void 0, void 0, function () {
                var chatsPromise, chats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch('/api/chat/current?query=' + term)];
                        case 1:
                            chatsPromise = _a.sent();
                            return [4 /*yield*/, chatsPromise.json()];
                        case 2:
                            chats = _a.sent();
                            console.log('chats:', chats);
                            if (!chats.success) {
                                setError({ message: chats.error });
                                setChats([]);
                            }
                            else {
                                setChats(chats.data);
                                setError({ message: null });
                            }
                            setError({ message: null });
                            return [2 /*return*/];
                    }
                });
            });
        }
        if (chatListChanged || NewMessageChatId) {
            setNewMessageChatId(null);
            initialFetch(term);
            setChatListChanged(false);
        }
        function setUserIdAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var userJson, user;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email) && !userId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, getUserModelJson((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.email)];
                        case 1:
                            userJson = _c.sent();
                            user = JSON.parse(userJson);
                            setUserId(user._id);
                            _c.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }
        setUserIdAsync();
        /*if (eventSourceRef.current || !userId) return;

        const eventSource = new EventSource('/api/chat/current/update?user_id=' + userId);
        eventSourceRef.current = eventSource;
        console.log('ES:', eventSource);

        eventSourceRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('data:', data);
            //const chats: Model<IChatDocument> = data;

            setChats(prevChats=>[...prevChats, data]);
        }

        eventSourceRef.current.onerror = (error) => {
            console.log(JSON.stringify(error));
            eventSourceRef.current.close()
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
                console.log('Closing EventSource connection');
            }
        };*/
    }, [userId, chatListChanged]);
    function updateChatList(state) {
        setChatListChanged(state);
    }
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    function chooseChat(new_chat_id) {
        setIsShown(false);
        chat_id = new_chat_id;
        onChangeChatId(chat_id);
    }
    function renderChatList() {
        if (!Chats.length)
            return (<>
                    <div className='chat-not-found'>
                        Contacts not found!
                    </div>
                    <UserSearch onUpdateChatList={updateChatList}/>
                </>);
        //<VoipCall userEmail={session.user.email} targetUserEmail={Chats[index].users[0].email} />
        var chatList = Chats.map(function (value, index) {
            return (<div key={Chats[index]._id} className={Chats[index]._id === chat_id ? 'chat chosen' : 'chat'} onClick={function (e) { return chooseChat(Chats[index]._id); }}>
                    <div className='notification'>
                        {Chats[index].unreadCount ? Chats[index].unreadCount : 0}
                    </div>
                    <Image src={Chats[index].users[0].avatar} height={35} width={35} alt={Chats[index].users[0].name}/>
                    <span>{Chats[index].users[0].name}</span>

                </div>);
        });
        return chatList;
    }
    /*const notifyList = Chats.map((value, index) => {
        <div className='notifications'>
            
        </div>

        return notifyList;
    }*/
    return (<div className='chat-aside'>
            <div className={!isShown ? 'aside-show-btn' : 'aside-show-btn hidden'} onClick={function (e) { return (setIsShown(true)); }}>🡂</div>
            <div className={isShown ? 'aside-hide-btn' : 'aside-hide-btn hidden'} onClick={function (e) { return (setIsShown(false)); }}>🡀</div>
            <div className={isShown ? 'chat-aside-inner' : 'chat-aside-inner hidden'}>
                <UserSearch onUpdateChatList={updateChatList}/>
                <div className='chat-search'>
                    <Search queryVar='chat-search' placeholder='search your contacts' onTermChange={setTerm}/>
                </div>
                <div className='chat-list'>
                    {renderChatList()}
                </div>
            </div>
        </div>);
}
export default ChatList;
