'use server'
import dbConnect from "./mongodb";
import User, { IUser, IUserDocument } from '../chatter/models/User';
import Chat, { IChatDocument } from '../chatter/models/Chat';
import Message, { IMessageDocument } from '../chatter/models/Message';
import { Model } from "mongoose";
import { Document, ObjectId } from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { cookies } from 'next/headers'
import axios from 'axios';
import strict from "assert/strict";
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

export async function setMessageRead(id: string) {
    try {

        await dbConnect();

        const MessageModel: Model<IMessageDocument> = Message;
        const messagesUpdateResult = await MessageModel.updateOne({ _id: id }, { status: 'read' });

    } catch (error) {
        console.log('setMessagesRead error:', error.message);
    }
}

export async function getChatUsers(chatId: string) {

    await dbConnect();
    var ChatModel: Model<IChatDocument> = Chat;
    const chat = await ChatModel.findById(chatId)
        .populate<{ users: [IUserDocument] }>('users');

    return chat.users;
}

export async function getConversationUser(chatId: string, myEmail: string) {

    await dbConnect();

    const chatUsers = await getChatUsers(chatId);
    for (const user of chatUsers) {
        if (user.email !== myEmail) return JSON.stringify(user);
    }
}

export async function addToContacts(user_id) {
    // Get sessionToken object
    const env = process.env.NODE_ENV;
    const cookieName = env == 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
    const cookieStore = await cookies()
    let sessionTokenCookie = cookieStore.get(cookieName)
    let sessionToken = sessionTokenCookie.value;
    const addedChat = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/chat/current?user_id=' + user_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Cookie": `${cookieName}=${sessionToken};path=/;expires=Session`
        },
        cache: 'no-store',
        body: ''
    })
    const res = await addedChat.json()
    return res;
}

export async function linkOneSignalUserToDb(userId: string) {
    try {
        const env = process.env.NODE_ENV;
        const cookieName = env == 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
        const cookieStore = await cookies()
        let sessionTokenCookie = cookieStore.get(cookieName)
        let sessionToken = sessionTokenCookie.value;
        const linkedRes = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/onesignal/link_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Cookie": `${cookieName}=${sessionToken};path=/;expires=Session`
            },
            cache: 'no-store',
            body: JSON.stringify({ user_id: userId })
        });
        const res = await linkedRes.json()
        return res;
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function sendPushCall(userId: string, chatId: string, state: string, message: string) {
    try {
        await dbConnect();
        var oneSignalAppId = process.env.ONESIGNAL_APP_ID;
        var oneSignalApiKey = process.env.ONESIGNAL_REST_API_KEY;

        await axios.post('https://api.onesignal.com/notifications?c=push', {
            app_id: oneSignalAppId,
            target_channel: "push",
            web_buttons: [
                {
                    "id": "accept",
                    "text": "Answer",
                    "url": "https://chatter-psi-six.vercel.app/?chat_id=" + chatId + "&state=" + state
                },
                {
                    "id": "cancel",
                    "text": "Cancel",
                    "url": "https://chatter-psi-six.vercel.app/_osp=do_not_open"
                }
            ],
            include_aliases: {
                onesignal_id: [
                    userId
                ]
            },
            data: {
                onesignal_id: userId,
                chatId: chatId
            },
            contents: {
                en: message,
            },
            url: "https://chatter-psi-six.vercel.app/?chat_id=" + chatId + "&state=" + state
        }, {
            headers: {
                'Authorization': `Key ${oneSignalApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return { success: true, message: 'Call Notification sent' };

    } catch (error) {
        console.error("Error sending notification:", error.response?.data || error.message);
        return { success: false, message: error.response?.data };
    }
}

export async function sendPushHangUp(userId: string, chatId: string, message: string) {
    try {
        await dbConnect();
        var oneSignalAppId = process.env.ONESIGNAL_APP_ID;
        var oneSignalApiKey = process.env.ONESIGNAL_REST_API_KEY;

        await axios.post('https://api.onesignal.com/notifications?c=push', {
            app_id: oneSignalAppId,
            target_channel: "push",
            include_aliases: {
                onesignal_id: [
                    userId
                ]
            },
            contents: {
                en: message,
            },
            data: {
                type: 'hang_up',
                onesignal_id: userId,
                chatId: chatId
            },
            url: "https://chatter-psi-six.vercel.app/?chat_id=" + chatId
        }, {
            headers: {
                'Authorization': `Key ${oneSignalApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return { success: true, message: 'Hanp Up Notification sent' };

    } catch (error) {
        console.error("Error sending notification:", error.response?.data || error.message);
        return { success: false, message: error.response?.data };
    }
}

export async function sendMessage(message: string, chat_id: string) {
    try {
        const env = process.env.NODE_ENV;
        const cookieName = env == 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
        const cookieStore = await cookies()
        let sessionTokenCookie = cookieStore.get(cookieName)
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
        const res = await addedMessage.json()
        return res;
    } catch (error) {
        return { 'success': false, error: process.env.NEXT_PUBLIC_BASE_URL + '; ' + error.message }
    }
}

//ця функція поки не використовується і не перевірялась
export async function getMessages(chat_id: string) {

    const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/message';
    const params: { chat_id: string } = { chat_id: chat_id };
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = URL + '?' + queryString;

    const newChat = await fetch(fullUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const res = await newChat.json()
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
    return null;
}

export async function getUserModelJson(email: string) {

    await dbConnect();
    var UserModel: Model<IUserDocument> = User;
    const user = await UserModel.findOne({ email: email }).exec();
    return JSON.stringify(user);

}

export async function getUserModel(email: string): Promise<IUserDocument> {

    await dbConnect();
    var UserModel: Model<IUserDocument> = User;
    const user = await UserModel.findOne({ email: email }).exec();
    return user;

}

export async function getUserModelById(id: Promise<ObjectId>): Promise<Document> {

    await dbConnect();
    var UserModel: Model<IUserDocument> = User;
    const user = await UserModel.findById(id);
    return user;

}

//ця функція поки не використовується і не перевірялась
export async function getCurrentUserModel(): Promise<Document> {

    await dbConnect();

    var session = await getServerSession(authOptions);
    var userPromise: Promise<Document> = new Promise((resolve, reject) => {
        if (session != null) {
            if (session.user != null) {
                if (session.user.email != null) {
                    const email = session.user.email;
                    var User: Model<IUser>;
                    var user = User.findOne({ email: email });
                    resolve(user);
                }
            }
        } //else reject(false);
    })
    return userPromise;
}

