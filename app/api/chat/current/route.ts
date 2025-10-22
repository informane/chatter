import dbConnect from '../../../lib/mongodb';
import Chat, { IChat, IChatDocument } from '../../../chatter/models/Chat';
import { Model } from "mongoose";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionEmail, getUserModel } from '../../../lib/chatter';
import User, { IUser, IUserDocument } from 'app/chatter/models/User';
import ChatList from 'app/chatter/ChatList';

export async function GET(request: NextRequest) {

  try {
    await dbConnect();
    var error = false;
    var data = [];
    const email = await getServerSessionEmail();


    if (email) {
      
      const user = await getUserModel(email);

      if (user) {
        var ChatModel: Model<IChatDocument> = Chat;
        if (user.chat_ids.length) {
          let chats = [];
          for (let i = 0; i < user.chat_ids.length; i++) {
            chats = await ChatModel.findById(user.chat_ids[i]);
          }
          //throw new Error(JSON.stringify(chats));
          if (chats) {
            data = chats;
            error = false;
          }
        } else error = false;
      } else error = true;

      return NextResponse.json(
        { success: !error, data: data },
        { status: !error ? 201 : 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {success: false, error: error.message},
      { status: 401 }
    );
  }

}

export async function POST(request: NextRequest) {
  try {
    var error = false;
    var data = {};
    await dbConnect();
    const email = await getServerSessionEmail();
    if (!email) {
      error = true;
    } else {

      const body = await request.json();


      const currentUser = await getUserModel(email);
      if(currentUser) {
        const UserModel: Model<IUserDocument> = User;
        const addingUser = await UserModel.findById(body.user_id);
        
        const ChatModel = new Chat();
        ChatModel.user_ids=[];
        ChatModel.user_ids.push(currentUser._id);
        ChatModel.user_ids.push(addingUser._id);
        ChatModel.name = addingUser.name;
        ChatModel.description = body.description;
        await ChatModel.save();
        data = ChatModel;
      } else error = true;
    }
    return NextResponse.json(
      { success: !error, data: data },
      { status: !error ? 201 : 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {success: false, error: error.message},
      { status: !error ? 201 : 400 }
    )
  }
}