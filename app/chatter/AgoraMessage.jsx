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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
import { useEffect, useState, useRef } from "react";
import { getConversationUser, setMessageRead } from "app/lib/chatter";
import { useSession } from "next-auth/react";
import { sendMessage } from 'app/lib/chatter';
/*import agoraToken from 'agora-token';
import AgoraRTM from 'agora-rtm-sdk';*/
/*
// just a mock channel name for /api/token route
const getRTMChannelName = (email1: string, email2: string) => {
    email1 = email1.replaceAll('.', '');
    email2 = email2.replaceAll('.', '');
    const sortedEmails = [email1, email2].sort();

    return `NEW_MESSAGE_${sortedEmails[0]}_${sortedEmails[1]}`;
};

//peer-to-peer connection user_id for signaling about new messages
const getRTMUserId = (email: string) => {
    email = email.replaceAll('.', '');
    return 'message_signaling_'+email;
}*/
export function AgoraMessage(_a) {
    var _this = this;
    var _b;
    var shown = _a.shown, onNewMessage = _a.onNewMessage, chat_id = _a.chat_id, currentUserEmail = _a.currentUserEmail, targetUserEmail = _a.targetUserEmail;
    //agora rtm (signaling)
    /*const { RTM } = AgoraRTM;
    const rtmClient = useRef(null);
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const rtmUserId = getRTMUserId(currentUserEmail);
    const rtmChannel = getRTMChannelName(currentUserEmail, targetUserEmail);
    const [isRtmLoggedIn, setIsRtmLoggedIn] = useState(true);*/
    //agora chat
    var _c = __read(useState(null), 2), messagesWindow = _c[0], setMessagesWindow = _c[1];
    var noMessages = useRef(false);
    var prev_chat_id = useRef(null);
    var appKey = process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY;
    var _d = __read(useState(''), 2), userId = _d[0], setUserId = _d[1]; //user email without dots and @
    var _e = __read(useState(true), 2), isLoggedIn = _e[0], setIsLoggedIn = _e[1];
    var _f = useSession(), session = _f.data, status = _f.status;
    var _g = __read(useState(""), 2), peerId = _g[0], setPeerId = _g[1]; //peer email without dots
    var _h = __read(useState(""), 2), message = _h[0], setMessage = _h[1];
    var _j = __read(useState([]), 2), messages = _j[0], setMessages = _j[1];
    var _k = __read(useState(null), 2), chatClient = _k[0], setChatClient = _k[1];
    var _l = __read(useState({}), 2), peerDbUser = _l[0], setPeerDbUser = _l[1];
    var _m = __read(useState(null), 2), AgoraChat = _m[0], setAgoraChat = _m[1];
    var _o = __read(useState(null), 2), convUser = _o[0], setConvUser = _o[1];
    var _p = __read(useState(''), 2), error = _p[0], setError = _p[1];
    useEffect(function () {
        if (prev_chat_id.current == null)
            prev_chat_id.current = chat_id;
        if (noMessages.current)
            return;
        if (chat_id !== prev_chat_id.current) {
            noMessages.current = false;
            setAgoraChat(null);
            setChatClient(null);
            setUserId('');
            setMessages([]);
            prev_chat_id.current = chat_id;
            return;
        }
        //set userId
        if (!userId || status === 'loading') {
            setUserId(getUserId(session.user.email));
            return;
        }
        // Use a dynamic import inside useEffect 
        // and init Chat
        var initAgoraChat = function () { return __awaiter(_this, void 0, void 0, function () {
            var AgoraChatImport, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, import('agora-chat')];
                    case 1:
                        AgoraChatImport = (_a.sent()).default;
                        setAgoraChat(AgoraChatImport);
                        if (!appKey) {
                            console.error("Agora Chat App Key not found.");
                            return [2 /*return*/];
                        }
                        client = new AgoraChatImport.connection({
                            appKey: appKey,
                        });
                        setChatClient(client);
                        return [2 /*return*/];
                }
            });
        }); };
        if (!chatClient && !AgoraChat) {
            initAgoraChat();
            return;
        }
        var initAgoraLogin = function () { return __awaiter(_this, void 0, void 0, function () {
            var peerUserJson, peerUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getConversationUser(chat_id, session.user.email)];
                    case 1:
                        peerUserJson = _a.sent();
                        return [4 /*yield*/, JSON.parse(peerUserJson)];
                    case 2:
                        peerUser = _a.sent();
                        setPeerDbUser(peerUser);
                        setPeerId(getUserId(peerUser.email));
                        return [4 /*yield*/, handleLogin()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        initAgoraLogin();
        //get messages from db
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
                            if (!msgs.data.length)
                                noMessages.current = true;
                            else
                                noMessages.current = false;
                            return [2 /*return*/];
                    }
                });
            });
        }
        if (!messages.length)
            initialFetch(chat_id);
        //event listeners
        function initEventListeners() {
            // Adds the event handler.
            chatClient.addEventHandler("connection&message", {
                onConnected: function () {
                    handleLogin();
                    console.log("User ".concat(userId, " Connect success !"));
                },
                onDisconnected: function () {
                    handleLogout();
                    console.log("User Logout!");
                },
                onCustomMessage: function (message) {
                    var e_1, _a;
                    console.log('message: ' + message);
                    //if messages (state array loaded from db) contain sent message (because message was sent while target user was offline) 
                    // then we don't add it to messages.
                    var messageAlreadySent = false;
                    try {
                        for (var messages_1 = __values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                            var msg = messages_1_1.value;
                            if (msg._id === message.ext._id) {
                                messageAlreadySent = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (!messageAlreadySent) {
                        setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], __read(prevMessages), false), [message.ext], false); });
                        if (shown) {
                            scrollDown();
                        }
                        else {
                            onNewMessage(chat_id); //tell parent that messages of the chat are read now
                        }
                    }
                    console.log("".concat(message.from, " sent msg"));
                },
                onTokenWillExpire: function () {
                    console.log("Token is about to expire");
                },
                onTokenExpired: function () {
                    console.log("Token has expired");
                },
                onError: function (error) {
                    console.log("on error: ".concat((error.message)));
                },
            });
        }
        var handleScroll = function () {
            var unreadMessage = document.getElementsByClassName('message unread')[0];
            console.log(unreadMessage.scrollTop, messagesWindow.scrollTop);
            if (unreadMessage) {
                //const messageWindowHeight = messagesWindow.scrollHeight;
                if (messagesWindow.scrollTop >= unreadMessage.scrollTop) {
                    var msgId = unreadMessage.id;
                    setMessageRead(msgId);
                }
            }
        };
        if ( /*status !== 'loading' && */convUser && messagesWindow) {
            setMessagesWindow(document.getElementsByClassName('message-list')[0]);
            console.log(document.getElementsByClassName('message-list')[0], messagesWindow);
            messagesWindow.addEventListener('scroll', handleScroll);
        }
        /* return () => {
             if (messagesWindow) messagesWindow.removeEventListener('scroll', handleScroll);
         };*/
        initEventListeners();
        if (shown)
            scrollDown();
        return function () {
            handleLogout();
        };
    }, [appKey, userId, chat_id, prev_chat_id, chatClient, messages, noMessages, convUser, status]);
    //handle if user scrolldown 
    useEffect(function () {
        //if (document.getElementsByClassName('message-list')[0]) {
    }, []);
    //rtm notification
    /*useEffect(() => {

 
        async function initMessageNotifications() {
            console.log('rtm vars:', rtmUserId, rtmChannel, appId)
            const response = await fetch(`/api/token?userId=${encodeURIComponent(rtmUserId)}&channelName=${encodeURIComponent(rtmChannel)}`);
            const data = await response.json();
            if (!data.rtmToken) {
                console.error("Token fetch failed or token is empty.");
                return; // Stop execution if no token
            }
            const client = new RTM(appId, rtmUserId);
            console.log('rtm_token:', data.rtmToken);
            await client.login({ token: data.rtmToken });
            setIsRtmLoggedIn(true);
            rtmClient.current = client;

            rtmClient.current.addEventListener('message', (event) => {
                const signal = event.customType;
                console.log('notify event:', event);
                if(signal == 'NEW_MSG') {
                    console.log(event.message);
                    const fromEmail = event.message;
                    onNewMessage(fromEmail);
                }

            });
        }
        if(!rtmClient.current) initMessageNotifications();

        return () => {
            handleRtmLogout()
        };

    }, [appId, rtmUserId, rtmChannel, rtmClient])

    const notifyUser = async (currentEmail: string, targetEmail: string) => {

        const payload = currentEmail;
        const options = {
            customType: "NEW_MSG",
            channelType: "USER",
        };
        await rtmClient.current.publish(getRTMUserId(targetEmail), payload, options);

    };*/
    // agora RTM Log out
    /*const handleRtmLogout = () => {
        if (rtmClient.current) {
            console.log('rtm logout');
            rtmClient.current.logout();
            setIsRtmLoggedIn(false);
        }
    };*/
    //agora chat send a peer-to-peer message.
    var handleSendMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        var addedMsg, newMsg_1, options, newAgoraMsg, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (message.trim() === '' || !chatClient)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    console.log("msg before db", process.env.NEXT_PUBLIC_BASE_URL);
                    return [4 /*yield*/, sendMessage(message, chat_id)];
                case 2:
                    addedMsg = _a.sent();
                    if (!addedMsg.success)
                        console.log(addedMsg.error);
                    console.log("msg db", addedMsg);
                    newMsg_1 = addedMsg.data;
                    options = {
                        chatType: 'singleChat', // Sets the chat type as a one-to-one chat.
                        type: "custom",
                        event: 'MESSAGE_SENT',
                        ext: newMsg_1,
                        to: peerId,
                    };
                    newAgoraMsg = AgoraChat.message.create(options);
                    return [4 /*yield*/, chatClient.send(newAgoraMsg)];
                case 3:
                    _a.sent();
                    //notifyUser(currentUserEmail, targetUserEmail);
                    setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], __read(prevMessages), false), [newMsg_1], false); });
                    console.log(newMsg_1);
                    console.log("Message send to ".concat(peerId, ": ").concat(message));
                    scrollDown();
                    setMessage("");
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log("Message send failed: ".concat(error_1.message));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    function scrollDown() {
        var messageWindow = document.getElementsByClassName('message-list')[0];
        var firstUnreadMessage = document.getElementsByClassName('message unread')[0];
        if (messageWindow) {
            if (firstUnreadMessage) {
                messageWindow.scrollTop = firstUnreadMessage.scrollTop;
            }
            else {
                messageWindow.scrollTop = messageWindow.scrollHeight;
            }
        }
    }
    //remove dots and @ for compatibility
    var getUserId = function (email) {
        email = email.replaceAll('.', '').replaceAll('@', '');
        return email;
    };
    // Log into Agora Chat
    var handleLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/chat_token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: userId }),
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    token = data.token;
                    if (userId && token) {
                        chatClient.open({
                            user: userId,
                            accessToken: token,
                        });
                        setIsLoggedIn(true);
                    }
                    else {
                        console.log("Please enter userId and token");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // agora Log out
    var handleLogout = function () {
        console.log('Chat logout');
        chatClient.close();
        setIsLoggedIn(false);
    };
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
        var className = messages[index].status;
        return (<div className={((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email) === messages[index].user.email ? 'message message-self ' + className : 'message ' + className} id={messages[index]._id} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>);
    });
    return (<article className='agora'>
            <div className='messages'>
                <h3 className='message-list-header'>
                    Conversation: {convUser === null || convUser === void 0 ? void 0 : convUser.name}
                </h3>
                <div className='message-list'>
                    {messageList}
                </div>
            </div>

            <div className='message-form-wrapper'>
                <form className='message-form' method='POST'>
                    <textarea name='message' id='message' onChange={function (e) { setMessage(e.target.value); }} value={message}>
                    </textarea>
                    <button type='button' onClick={handleSendMessage}>Send</button>
                </form>
                <div className='error'>{error}</div>
            </div>
        </article>);
}
