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
import Header from './Header';
import ChatList from './ChatList';
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from 'react';
import './styles.scss';
import AgoraMessasgeWrapper from './AgoraMessageDynamic';
import VoipCallWrapper from './VoipCallDynamic';
import { redirect } from 'next/navigation';
export default function Chatter() {
    var _a = useSession(), session = _a.data, status = _a.status;
    var _b = __read(useState(null), 2), chatId = _b[0], setChatId = _b[1];
    var _c = __read(useState(null), 2), newMessageChatId = _c[0], setNewMessageChatId = _c[1];
    var _d = __read(useState(false), 2), shown = _d[0], setShown = _d[1];
    // const [chatListChanged, setChatListChanged] = useState(true);
    var _e = __read(useState([]), 2), chatList = _e[0], setChatList = _e[1];
    //              <Messages chat_id={chatId} onChangeChatId={setChatId} />
    //              <InputMessage chat_id={chatId} onChangeChatId={setChatId} />
    useEffect(function () {
        function initialFetch() {
            return __awaiter(this, void 0, void 0, function () {
                var chatsPromise, chats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch('/api/chat/current')];
                        case 1:
                            chatsPromise = _a.sent();
                            return [4 /*yield*/, chatsPromise.json()];
                        case 2:
                            chats = _a.sent();
                            if (chats.data)
                                if (chats.data.length) {
                                    setChatList(chats.data);
                                    //console.log('page.tsx chatList:', chats.data);
                                }
                            return [2 /*return*/];
                    }
                });
            });
        }
        if (!chatList.length)
            initialFetch();
    }, [chatList]);
    function showNotification(chat_id) {
        setNewMessageChatId(chat_id);
    }
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    if (!session)
        redirect("/api/auth/signin");
    //console.log(chatList)
    var chatWindowsMap = chatList.map(function (value, index) {
        return (<div className={chatId == chatList[index]._id ? 'right-side' : 'right-side hidden'} key={chatList[index]._id}>
        <VoipCallWrapper userEmail={session.user.email} targetUserEmail={chatList[index].users[0].email}/>
        {session.user.email && <AgoraMessasgeWrapper shown={chatId == chatList[index]._id} onNewMessage={showNotification} chat_id={chatList[index]._id} onChangeChatId={setChatId} currentUserEmail={session.user.email} targetUserEmail={chatList[index].users[0].email}/>}
      </div>);
    });
    return (<Suspense fallback={<div>Loading...</div>}>
      <div className='main'>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <ChatList chat_id={chatId} onChangeChatId={setChatId} newMessageChatId={newMessageChatId} shown={false}/>
          </aside>
          {chatWindowsMap}
          {/*chatId && <AgoraMessasgeWrapper shown={true} chat_id={chatId} onChangeChatId={setChatId} />*/}
        </section>
      </div>
    </Suspense>);
}
