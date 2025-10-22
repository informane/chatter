'use server'
import dbConnect from "./mongodb";
import User, {IUser, IUserDocument} from '../chatter/models/User';
import {Model} from "mongoose";
import { Document, ObjectId } from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export async function addChatAction(queryData: FormData) {

    const newChat = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/chat/current', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryData),
    })
    const res = await newChat.json()
    return res;
}

export async function getMessages(chat_id: string) {

    const URL = process.env.NEXT_PUBLIC_BASE_URL+'/api/message';
    const params: {chat_id: string} = {chat_id: chat_id};
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = URL+'?'+queryString;
    
    const newChat = await fetch(fullUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const res = await newChat.json()
    return res;
}


export async function getServerSessionEmail(){

  var session = await getServerSession(authOptions);
  if (session != null) {
    if (session.user != null) {
      if (session.user.email != null) {
        return session.user.email.toString();
      }
    }
  } 
  return '';
}

export async function getUserModelById(id: Promise<ObjectId>): Promise<Document> {

    await dbConnect();
    var User: Model<IUser>;
    const user = await User.findById(id);
    return user;

}


export async function getCurrentUserModel(): Promise<Document>{

    await dbConnect();

    var session = await getServerSession(authOptions);
    var userPromise: Promise<Document> = new Promise((resolve,reject)=> {
        if (session != null) {
            if (session.user != null) {
                if (session.user.email != null) {
                    const email = session.user.email;
                    var User: Model<IUser>;
                    var user = User.findOne({email: email});
                    resolve(user);
                }
            }
        } //else reject(false);
    }) 
    return userPromise;
}

export async function getUserModel(email: string): Promise<IUserDocument> {

    await dbConnect();
    var UserModel: Model<IUserDocument> = User;
    const user = await UserModel.findOne({email: email})
    return user;

}