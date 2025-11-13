import dbConnect from '../../../lib/mongodb';
import Chat, { IChat, IChatDocument } from '../../../chatter/models/Chat';
import { Model } from "mongoose";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionEmail, getUserModel } from '../../../lib/chatter';
import User, { IUser, IUserDocument } from 'app/chatter/models/User';

export async function GET(request: NextRequest) {

  try {
    await dbConnect();
    var error = { status: false, message: '' };
    var data = [];
    var UserChatsUsers;
    const email = await getServerSessionEmail();

    if (email) {
      var { searchParams } = request.nextUrl;
      var query = searchParams.get('query');
      const UserModel: Model<IUserDocument> = User;
      if (query && query.length) {

        const regex = new RegExp(query, 'i');
        UserChatsUsers = await UserModel.findOne({ email: email })
          .populate<{ chats: [IChatDocument] }>({
            path: 'chats',
            match: { name: regex },
            populate: {
              path: 'users',
              match: { $and: [{ email: { $ne: email } }, { $or: [{ email: regex }, { name: regex }, { description: regex }] }] }
            }
          })
      } else {
        UserChatsUsers = await UserModel.findOne({ email: email })
          .populate<{ chats: [IChatDocument] }>({
            path: 'chats',
            populate: {
              path: 'users',
              match: { email: { $ne: email } }
            }
          })
      }

      if (UserChatsUsers.chats.length) {
        //if(UserChatsUsers.chats.users) {
        data = UserChatsUsers.chats;
        //} else error = { status: true, message: 'chats for this user not found: ' + email }
      } else error = { status: true, message: 'chats for this user with given criteria not found: ' + email }
    } else error = { status: true, message: 'empty email: ' + email };

    if (error.status)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 }
      )

    return NextResponse.json(
      { success: true, data: data },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

}

export async function POST(request: NextRequest) {
  try {
    var error = { message: '', status: false };
    var data = {};
    await dbConnect();
    const email = await getServerSessionEmail();

    if (!email) {
      error = { message: 'Empty email: ' + email, status: true };
    } else {
      const { searchParams } = request.nextUrl;
      const user_id = searchParams.get('user_id');
      if (user_id) {
        const UserModel: Model<IUserDocument> = User;
        const currentUser = await UserModel.findOne({ email: email }).populate<{ chats: [IChatDocument] }>('chats');

        if (currentUser) {
          const addingUser = await UserModel.findById(user_id).populate<{ chats: [IChatDocument] }>('chats');
          if (addingUser) {
            if (email == addingUser.email) error = { message: 'you cannot add yourself to contacts!', status: true };
            else {
              const ChatModel: Model<IChatDocument> = Chat;
              const existingChat = await ChatModel.find({ users: { $all: [currentUser._id, addingUser._id] } });
              if (existingChat.length) error = { message: 'you have already this user in your contacts!', status: true };

              else {
                const chat = await ChatModel.create({ name: addingUser.name, description: addingUser.email });

                chat.users.push(currentUser._id);
                chat.users.push(addingUser._id);
                chat.name = currentUser.email+"&"+addingUser.email;
                chat.description = '';
                await chat.save();
                currentUser.chats.push(chat);
                await currentUser.save();

                addingUser.chats.push(chat);
                await addingUser.save();
                data = chat;
              }
            }
          } else error = { message: 'empty adding_user: ' + addingUser, status: true };
        } else error = { message: 'empty current_user: ' + currentUser, status: true };
      } else error = { message: 'empty user_id: ' + user_id, status: true };
    }
    if (error.status) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}