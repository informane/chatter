'use server'
import dbConnect from "./mongodb";
import User, { IUser, IUserDocument } from '../chatter/models/User';
import Chat, { IChatDocument, IChat } from '../chatter/models/Chat';
import { Model } from "mongoose";
import { Document, ObjectId } from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { cookies } from 'next/headers'
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
    const cookieStore = await cookies()
    let sessionTokenCookie = cookieStore.get('__Secure-next-auth.session-token')
    let sessionToken = sessionTokenCookie.value;
    const addedChat = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/chat/current?user_id=' + user_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Cookie": `next-auth.session-token=${sessionToken};path=/;expires=Session`
        },
        cache: 'no-store',
        body: ''
    })
    const res = await addedChat.json()
    return res;
}


export async function sendMessage(message: string, chat_id: string) {
    try {
        const cookieStore = await cookies()
        let sessionTokenCookie = cookieStore.get('__Secure-next-auth.session-token')
        let sessionToken = sessionTokenCookie.value;
        const addedMessage = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/message/current?chat_id=' + chat_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Cookie": `next-auth.session-token=${sessionToken};path=/;expires=Session`
            },
            cache: 'no-store',
            body: JSON.stringify({ message: message })
        });
        const res = await addedMessage.json()
        return res;
    } catch (error) {
        return {'success': false, error: process.env.NEXT_PUBLIC_BASE_URL+'; '+error.message}
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
    return '';
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

