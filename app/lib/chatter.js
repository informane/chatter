'use server';
import dbConnect from "./mongodb";
import User from '../chatter/models/User';
import Chat from '../chatter/models/Chat';
import Message from '../chatter/models/Message';
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
export async function setMessageRead(id) {
    try {
        await dbConnect();
        const MessageModel = Message;
        const messagesUpdateResult = await MessageModel.updateOne({ _id: id }, { status: 'read' });
    }
    catch (error) {
        console.log('setMessagesRead error:', error.message);
    }
}
export async function getChatUsers(chatId) {
    await dbConnect();
    var ChatModel = Chat;
    const chat = await ChatModel.findById(chatId)
        .populate('users');
    return chat.users;
}
export async function getConversationUser(chatId, myEmail) {
    await dbConnect();
    const chatUsers = await getChatUsers(chatId);
    for (const user of chatUsers) {
        if (user.email !== myEmail)
            return JSON.stringify(user);
    }
}
export async function addToContacts(user_id) {
    // Get sessionToken object
    const env = process.env.NODE_ENV;
    const cookieName = env == 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
    const cookieStore = await cookies();
    let sessionTokenCookie = cookieStore.get(cookieName);
    let sessionToken = sessionTokenCookie.value;
    const addedChat = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/chat/current?user_id=' + user_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Cookie": `${cookieName}=${sessionToken};path=/;expires=Session`
        },
        cache: 'no-store',
        body: ''
    });
    const res = await addedChat.json();
    return res;
}
export async function sendMessage(message, chat_id) {
    try {
        const env = process.env.NODE_ENV;
        const cookieName = env == 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
        const cookieStore = await cookies();
        let sessionTokenCookie = cookieStore.get(cookieName);
        let sessionToken = sessionTokenCookie.value;
        const addedMessage = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/message/current?chat_id=' + chat_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Cookie": `${cookieName}=${sessionToken};path=/;expires=Session`
            },
            cache: 'no-store',
            body: JSON.stringify({ message: message })
        });
        const res = await addedMessage.json();
        return res;
    }
    catch (error) {
        return { 'success': false, error: process.env.NEXT_PUBLIC_BASE_URL + '; ' + error.message };
    }
}
//ця функція поки не використовується і не перевірялась
export async function getMessages(chat_id) {
    const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/message';
    const params = { chat_id: chat_id };
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = URL + '?' + queryString;
    const newChat = await fetch(fullUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const res = await newChat.json();
    return res;
}
export async function getServerSessionEmail() {
    var session = await getServerSession();
    if (session != null) {
        if (session.user != null) {
            if (session.user.email != null) {
                return session.user.email.toString();
            }
        }
    }
    return '';
}
export async function getUserModelJson(email) {
    await dbConnect();
    var UserModel = User;
    const user = await UserModel.findOne({ email: email }).exec();
    return JSON.stringify(user);
}
export async function getUserModel(email) {
    await dbConnect();
    var UserModel = User;
    const user = await UserModel.findOne({ email: email }).exec();
    return user;
}
export async function getUserModelById(id) {
    await dbConnect();
    var UserModel = User;
    const user = await UserModel.findById(id);
    return user;
}
//ця функція поки не використовується і не перевірялась
export async function getCurrentUserModel() {
    await dbConnect();
    var session = await getServerSession(authOptions);
    var userPromise = new Promise((resolve, reject) => {
        if (session != null) {
            if (session.user != null) {
                if (session.user.email != null) {
                    const email = session.user.email;
                    var User;
                    var user = User.findOne({ email: email });
                    resolve(user);
                }
            }
        } //else reject(false);
    });
    return userPromise;
}
