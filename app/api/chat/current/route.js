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
import dbConnect from '../../../lib/mongodb';
import Chat from '../../../chatter/models/Chat';
import { NextResponse } from 'next/server';
import { getServerSessionEmail } from '../../../lib/chatter';
import User from 'app/chatter/models/User';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var error, data, UserChatsUsers, email, searchParams, query, UserModel, regex, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    error = { status: false, message: '' };
                    data = [];
                    return [4 /*yield*/, getServerSessionEmail()];
                case 2:
                    email = _a.sent();
                    if (!email) return [3 /*break*/, 7];
                    searchParams = request.nextUrl.searchParams;
                    query = searchParams.get('query');
                    UserModel = User;
                    if (!(query.length !== 0 && query)) return [3 /*break*/, 4];
                    regex = new RegExp(query, 'i');
                    return [4 /*yield*/, UserModel.findOne({ email: email })
                            .populate({
                            path: 'chats',
                            match: { name: regex },
                            populate: {
                                path: 'users',
                                match: { $and: [{ email: { $ne: email } }, { $or: [{ email: regex }, { name: regex }, { description: regex }] }] }
                            }
                        })];
                case 3:
                    UserChatsUsers = _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, UserModel.findOne({ email: email })
                        .populate({
                        path: 'chats',
                        populate: {
                            path: 'users',
                            match: { email: { $ne: email } }
                        }
                    })];
                case 5:
                    UserChatsUsers = _a.sent();
                    _a.label = 6;
                case 6:
                    if (UserChatsUsers.chats.length) {
                        //if(UserChatsUsers.chats.users) {
                        data = UserChatsUsers.chats;
                        //} else error = { status: true, message: 'chats for this user not found: ' + email }
                    }
                    else
                        error = { status: true, message: 'chats for this user with given criteria not found: ' + email };
                    return [3 /*break*/, 8];
                case 7:
                    error = { status: true, message: 'empty email: ' + email };
                    _a.label = 8;
                case 8:
                    if (error.status)
                        return [2 /*return*/, NextResponse.json({ success: false, error: error.message }, { status: 200 })];
                    return [2 /*return*/, NextResponse.json({ success: true, data: data }, { status: 200 })];
                case 9:
                    error_1 = _a.sent();
                    return [2 /*return*/, NextResponse.json({ success: false, error: error_1.message }, { status: 400 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var error, data, email, searchParams, user_id, UserModel, currentUser, addingUser, ChatModel, existingChat, chat, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 20, , 21]);
                    error = { message: '', status: false };
                    data = {};
                    return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getServerSessionEmail()];
                case 2:
                    email = _a.sent();
                    if (!!email) return [3 /*break*/, 3];
                    error = { message: 'Empty email: ' + email, status: true };
                    return [3 /*break*/, 19];
                case 3:
                    searchParams = request.nextUrl.searchParams;
                    user_id = searchParams.get('user_id');
                    if (!user_id) return [3 /*break*/, 18];
                    UserModel = User;
                    return [4 /*yield*/, UserModel.findOne({ email: email }).populate('chats')];
                case 4:
                    currentUser = _a.sent();
                    if (!currentUser) return [3 /*break*/, 16];
                    return [4 /*yield*/, UserModel.findById(user_id).populate('chats')];
                case 5:
                    addingUser = _a.sent();
                    if (!addingUser) return [3 /*break*/, 14];
                    if (!(email == addingUser.email)) return [3 /*break*/, 6];
                    error = { message: 'you cannot add yourself to contacts!', status: true };
                    return [3 /*break*/, 13];
                case 6:
                    ChatModel = Chat;
                    return [4 /*yield*/, ChatModel.find({ users: { $all: [currentUser._id, addingUser._id] } })];
                case 7:
                    existingChat = _a.sent();
                    if (!existingChat.length) return [3 /*break*/, 8];
                    error = { message: 'you have already this user in your contacts!', status: true };
                    return [3 /*break*/, 13];
                case 8: return [4 /*yield*/, ChatModel.create({ name: addingUser.name, description: addingUser.email })];
                case 9:
                    chat = _a.sent();
                    chat.users.push(currentUser._id);
                    chat.users.push(addingUser._id);
                    chat.name = addingUser.name;
                    chat.description = '';
                    return [4 /*yield*/, chat.save()];
                case 10:
                    _a.sent();
                    currentUser.chats.push(chat);
                    return [4 /*yield*/, currentUser.save()];
                case 11:
                    _a.sent();
                    addingUser.chats.push(chat);
                    return [4 /*yield*/, addingUser.save()];
                case 12:
                    _a.sent();
                    data = chat;
                    _a.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    error = { message: 'empty adding_user: ' + addingUser, status: true };
                    _a.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    error = { message: 'empty current_user: ' + currentUser, status: true };
                    _a.label = 17;
                case 17: return [3 /*break*/, 19];
                case 18:
                    error = { message: 'empty user_id: ' + user_id, status: true };
                    _a.label = 19;
                case 19:
                    if (error.status)
                        throw new Error(error.message);
                    return [2 /*return*/, NextResponse.json({ success: true, data: data }, { status: 201 })];
                case 20:
                    error_2 = _a.sent();
                    return [2 /*return*/, NextResponse.json({ success: false, error: error_2.message }, { status: 400 })];
                case 21: return [2 /*return*/];
            }
        });
    });
}
