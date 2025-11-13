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
import { useEffect, useState } from "react";
import { getConversationUser } from "app/lib/chatter";
import { useSession } from "next-auth/react";
import { sendMessage } from 'app/lib/chatter';
import agoraToken from 'agora-token';
var ChatTokenBuilder = agoraToken.ChatTokenBuilder;
export function AgoraMessage(_a) {
    var _this = this;
    var chat_id = _a.chat_id, shown = _a.shown;
    var _b = useState(''), error = _b[0], setError = _b[1];
    //agora chat
    var appKey = process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY;
    var _c = useState(''), userId = _c[0], setUserId = _c[1]; //user email without dots and @
    //const [token, setToken] = useState("007eJxTYLicO+0l5ww+23e/7y9LaWo00Jx1OfXBnXOzr8tprdjEdEhFgcHSIiUtLc3IJNU42dLE0DjR0iwtxdQiMTHVPM00ydjY6O0EkcyGQEaG/llfWBgZWBkYgRDEV2FITEw0N04yM9BNSktO1TU0TDPQTUxMTtE1tDQzApqVbGqUnAIAjNQq3Q==");
    var _d = useState(true), isLoggedIn = _d[0], setIsLoggedIn = _d[1];
    var _e = useSession(), session = _e.data, status = _e.status;
    var _f = useState(""), peerId = _f[0], setPeerId = _f[1]; //peer email without dots
    var _g = useState(""), message = _g[0], setMessage = _g[1];
    var _h = useState([]), messages = _h[0], setMessages = _h[1];
    var _j = useState(null), chatClient = _j[0], setChatClient = _j[1];
    var _k = useState({}), peerDbUser = _k[0], setPeerDbUser = _k[1];
    var _l = useState(null), AgoraChat = _l[0], setAgoraChat = _l[1];
    useEffect(function () {
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
                        console.log(client);
                        setChatClient(client);
                        return [2 /*return*/];
                }
            });
        }); };
        if (!chatClient && !AgoraChat) {
            initAgoraChat();
            return;
        }
        //set peer vars
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
                    console.log(message);
                    var messageAlreadySent = false;
                    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                        var msg = messages_1[_i];
                        if (msg._id === message.ext._id) {
                            messageAlreadySent = true;
                        }
                    }
                    if (!messageAlreadySent) {
                        setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], prevMessages, true), [message.ext], false); });
                        scrollDown();
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
        initEventListeners();
        scrollDown();
    }, [appKey, userId, chat_id, chatClient, messages]);
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
                    console.log(AgoraChat);
                    return [4 /*yield*/, sendMessage(message, chat_id)];
                case 2:
                    addedMsg = _a.sent();
                    newMsg_1 = addedMsg.data;
                    options = {
                        chatType: 'singleChat', // Sets the chat type as a one-to-one chat.
                        type: "custom",
                        event: 'MESSAGE_SENT',
                        ext: newMsg_1,
                        to: peerId,
                        //msg: message,
                    };
                    newAgoraMsg = AgoraChat.message.create(options);
                    return [4 /*yield*/, chatClient.send(newAgoraMsg)];
                case 3:
                    _a.sent();
                    //const newMessages = [...messages, newMsg]
                    setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], prevMessages, true), [newMsg_1], false); });
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
        if (messageWindow) {
            var messageWindowHeight = messageWindow.scrollHeight;
            messageWindow.scrollTop = messageWindowHeight;
            console.log(messageWindowHeight, messageWindow.scrollTop);
        }
    }
    //remove dots for compatibility
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
                    console.log(userId, token);
                    if (userId && token) {
                        chatClient.open({
                            user: userId,
                            accessToken: token,
                        });
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
        chatClient.close();
        setIsLoggedIn(false);
    };
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    var messageList = messages.map(function (value, index) {
        var _a;
        var msgDate = new Date(messages[index].createdAt);
        return (<div className={((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email) === messages[index].user.email ? 'message message-self' : 'message'} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>);
    });
    return (<article className={shown ? '' : 'hidden'}>
            <div className='messages'>
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
