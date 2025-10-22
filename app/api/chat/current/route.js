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
import { getServerSessionEmail, getUserModel } from '../../../lib/chatter';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var error, data, email, user, ChatModel, chats, i, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 14]);
                    return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    error = false;
                    data = [];
                    return [4 /*yield*/, getServerSessionEmail()];
                case 2:
                    email = _a.sent();
                    if (!email) return [3 /*break*/, 12];
                    return [4 /*yield*/, getUserModel(email)];
                case 3:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 10];
                    ChatModel = Chat;
                    if (!user.chat_ids.length) return [3 /*break*/, 8];
                    chats = [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < user.chat_ids.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, ChatModel.findById(user.chat_ids[i])];
                case 5:
                    chats = _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    //throw new Error(JSON.stringify(chats));
                    if (chats) {
                        data = chats;
                        error = false;
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error = false;
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error = true;
                    _a.label = 11;
                case 11: return [2 /*return*/, NextResponse.json({ success: !error, data: data }, { status: !error ? 201 : 400 })];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_1 = _a.sent();
                    return [2 /*return*/, NextResponse.json({ success: false, error: error_1.message }, { status: 401 })];
                case 14: return [2 /*return*/];
            }
        });
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var error, data, email, body, User_1, ChatModel, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    error = false;
                    data = {};
                    return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getServerSessionEmail()];
                case 2:
                    email = _a.sent();
                    if (!email) {
                        error = true;
                    }
                    return [4 /*yield*/, request.json()];
                case 3:
                    body = _a.sent();
                    return [4 /*yield*/, getUserModel(email)];
                case 4:
                    User_1 = _a.sent();
                    if (!User_1) return [3 /*break*/, 6];
                    ChatModel = new Chat();
                    ChatModel.user_ids = [];
                    ChatModel.user_ids.push(User_1._id);
                    ChatModel.name = body.name;
                    ChatModel.description = body.description;
                    return [4 /*yield*/, ChatModel.save()];
                case 5:
                    _a.sent();
                    data = ChatModel;
                    return [3 /*break*/, 7];
                case 6:
                    error = true;
                    _a.label = 7;
                case 7: return [2 /*return*/, NextResponse.json({ success: !error, data: data }, { status: !error ? 201 : 400 })];
                case 8:
                    error_2 = _a.sent();
                    return [2 /*return*/, NextResponse.json({ success: false, error: error_2.message }, { status: !error_2 ? 201 : 400 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
