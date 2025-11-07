'use server';
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
import dbConnect from "./mongodb";
import User from '../chatter/models/User';
import Chat from '../chatter/models/Chat';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { cookies } from 'next/headers';
/*
export async function addChatAction(queryData: FormData) {

    const newChat = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/chat/current', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryData),
    })
    const res = await newChat.json()
    return res;
}*/
export function getChatUsers(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var ChatModel, chat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    ChatModel = Chat;
                    return [4 /*yield*/, ChatModel.findById(chatId)
                            .populate('users')];
                case 2:
                    chat = _a.sent();
                    return [2 /*return*/, chat.users];
            }
        });
    });
}
export function getConversationUser(chatId, myEmail) {
    return __awaiter(this, void 0, void 0, function () {
        var chatUsers, _i, chatUsers_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getChatUsers(chatId)];
                case 2:
                    chatUsers = _a.sent();
                    for (_i = 0, chatUsers_1 = chatUsers; _i < chatUsers_1.length; _i++) {
                        user = chatUsers_1[_i];
                        if (user.email !== myEmail)
                            return [2 /*return*/, JSON.stringify(user)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
export function addToContacts(user_id) {
    return __awaiter(this, void 0, void 0, function () {
        var cookieStore, sessionTokenCookie, sessionToken, addedChat, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cookies()];
                case 1:
                    cookieStore = _a.sent();
                    sessionTokenCookie = cookieStore.get('next-auth.session-token');
                    sessionToken = sessionTokenCookie.value;
                    return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/chat/current?user_id=' + user_id, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                "Cookie": "next-auth.session-token=".concat(sessionToken, ";path=/;expires=Session")
                            },
                            cache: 'no-store',
                            body: ''
                        })];
                case 2:
                    addedChat = _a.sent();
                    return [4 /*yield*/, addedChat.json()];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
export function sendMessage(message, chat_id) {
    return __awaiter(this, void 0, void 0, function () {
        var cookieStore, sessionTokenCookie, sessionToken, addedMessage, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cookies()];
                case 1:
                    cookieStore = _a.sent();
                    sessionTokenCookie = cookieStore.get('next-auth.session-token');
                    sessionToken = sessionTokenCookie.value;
                    return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/message/current?chat_id=' + chat_id, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                "Cookie": "next-auth.session-token=".concat(sessionToken, ";path=/;expires=Session")
                            },
                            cache: 'no-store',
                            body: JSON.stringify({ message: message })
                        })];
                case 2:
                    addedMessage = _a.sent();
                    return [4 /*yield*/, addedMessage.json()];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
//ця функція поки не використовується і не перевірялась
export function getMessages(chat_id) {
    return __awaiter(this, void 0, void 0, function () {
        var URL, params, queryString, fullUrl, newChat, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/message';
                    params = { chat_id: chat_id };
                    queryString = new URLSearchParams(params).toString();
                    fullUrl = URL + '?' + queryString;
                    return [4 /*yield*/, fetch(fullUrl, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    newChat = _a.sent();
                    return [4 /*yield*/, newChat.json()];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
export function getServerSessionEmail() {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getServerSession()];
                case 1:
                    session = _a.sent();
                    if (session != null) {
                        if (session.user != null) {
                            if (session.user.email != null) {
                                return [2 /*return*/, session.user.email.toString()];
                            }
                        }
                    }
                    return [2 /*return*/, ''];
            }
        });
    });
}
export function getUserModel(email) {
    return __awaiter(this, void 0, void 0, function () {
        var UserModel, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    UserModel = User;
                    return [4 /*yield*/, UserModel.findOne({ email: email }).exec()];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
export function getUserModelById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var UserModel, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    UserModel = User;
                    return [4 /*yield*/, UserModel.findById(id)];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
//ця функція поки не використовується і не перевірялась
export function getCurrentUserModel() {
    return __awaiter(this, void 0, void 0, function () {
        var session, userPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getServerSession(authOptions)];
                case 2:
                    session = _a.sent();
                    userPromise = new Promise(function (resolve, reject) {
                        if (session != null) {
                            if (session.user != null) {
                                if (session.user.email != null) {
                                    var email = session.user.email;
                                    var User;
                                    var user = User.findOne({ email: email });
                                    resolve(user);
                                }
                            }
                        } //else reject(false);
                    });
                    return [2 /*return*/, userPromise];
            }
        });
    });
}
