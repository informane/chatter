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
import { useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { addToContacts } from "app/lib/chatter";
import Search from './Search';
import Modal from './Modal';
export default function UserSearch(_a) {
    var _this = this;
    var _b;
    var onUpdateChatList = _a.onUpdateChatList;
    var _c = __read(useState([]), 2), Users = _c[0], setUsers = _c[1];
    var _d = __read(useState({ message: null }), 2), error = _d[0], setError = _d[1];
    var _e = __read(useState({ message: null }), 2), success = _e[0], setSuccess = _e[1];
    var searchParams = useSearchParams();
    var pathname = usePathname();
    var _f = __read(useState((_b = searchParams.get('contact-search')) !== null && _b !== void 0 ? _b : ''), 2), term = _f[0], setTerm = _f[1];
    var _g = __read(useState(false), 2), modalSearchIsOpen = _g[0], setModalSearchIsOpen = _g[1];
    useEffect(function () {
        var searchUsers = function (term) { return __awaiter(_this, void 0, void 0, function () {
            var promise, Users_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!term.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch('/api/user?query=' + term)];
                    case 1:
                        promise = _a.sent();
                        return [4 /*yield*/, promise.json()];
                    case 2:
                        Users_1 = _a.sent();
                        console.log(Users_1.data);
                        setUsers(Users_1.data);
                        return [3 /*break*/, 4];
                    case 3:
                        setUsers([]);
                        _a.label = 4;
                    case 4:
                        setSuccess({ message: null });
                        setError({ message: null });
                        return [2 /*return*/];
                }
            });
        }); };
        searchUsers(term);
    }, [term]);
    function handleAddContact(user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, addToContacts(user_id)];
                    case 1:
                        res = _a.sent();
                        if (!res.success) {
                            setSuccess({ message: null });
                            setError({ message: res.error });
                        }
                        else {
                            setSuccess({ message: "Successfull added to contacts!" });
                            setError({ message: null });
                            onUpdateChatList(true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function renderUsers() {
        if (!Users.length)
            return <p></p>;
        var users = Users.map(function (value, index) {
            return (<div key={Users[index]._id} className='user'>
                    <Image src={Users[index].avatar} alt={Users[index].name} height={60} width={60}/>
                    <div className="user-details">
                        <div className='user-name'>{Users[index].name}</div>
                        <div className='user-email'>{Users[index].email}</div>
                        <div className='user-description'>{Users[index].description}</div>
                        <div>
                            <button className="user-add-button" onClick={function (e) { return handleAddContact(Users[index]._id); }}>Add to contancts</button>
                        </div>
                    </div>
                </div>);
        });
        return <div className='users-list'>{users}</div>;
    }
    return (<div className='users-add'>
            <button onClick={function () { return setModalSearchIsOpen(true); }}>Add new contact</button>
            <Modal isOpen={modalSearchIsOpen} onClose={function () { return setModalSearchIsOpen(false); }}>
                <Search queryVar='contact-search' placeholder='start typing' onTermChange={setTerm}/>
                <div className="success">{success.message}</div>
                <div className="error">{error.message}</div>
                {renderUsers()}
            </Modal>
        </div>);
}
