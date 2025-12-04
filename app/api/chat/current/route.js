import dbConnect from '../../../lib/mongodb';
import Chat from '../../../chatter/models/Chat';
import { NextResponse } from 'next/server';
import { getServerSessionEmail } from '../../../lib/chatter';
import User from 'app/chatter/models/User';
import Message from 'app/chatter/models/Message';
export async function GET(request) {
    try {
        await dbConnect();
        var error = { status: false, message: '' };
        var data = [];
        var UserChatsUsers;
        const email = await getServerSessionEmail();
        if (email) {
            var { searchParams } = request.nextUrl;
            var query = searchParams.get('query');
            const UserModel = User;
            if (query && query.length) {
                const regex = new RegExp(query, 'i');
                UserChatsUsers = await UserModel.findOne({ email: email })
                    .populate({
                    path: 'chats',
                    match: { name: regex },
                    populate: {
                        path: 'users',
                        match: { $and: [{ email: { $ne: email } }, { $or: [{ email: regex }, { name: regex }, { description: regex }] }] }
                    }
                });
            }
            else {
                UserChatsUsers = await UserModel.findOne({ email: email })
                    .populate({
                    path: 'chats',
                    populate: {
                        path: 'users',
                        match: { email: { $ne: email } }
                    }
                });
            }
            if (UserChatsUsers.chats.length) {
                //if(UserChatsUsers.chats.users) {
                data = await getMessageCountByChatsArray(UserChatsUsers.chats);
                //throw new Error(JSON.stringify(data)); 
                //data = UserChatsUsers.chats
                //} else error = { status: true, message: 'chats for this user not found: ' + email }
            }
            else
                error = { status: true, message: 'chats for this user with given criteria not found: ' + email };
        }
        else
            error = { status: true, message: 'empty email: ' + email };
        if (error.status)
            return NextResponse.json({ success: false, error: error.message }, { status: 200 });
        return NextResponse.json({ success: true, data: data }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
async function getMessageCountByChatsArray(chats) {
    const MessageModel = Message;
    let groupedMessages = await MessageModel.aggregate([
        {
            $match: {
                status: 'unread',
            }
        },
        {
            $group: {
                _id: '$chat',
                count: { $sum: 1 }
            }
        }
    ]);
    //throw new Error(JSON.stringify(groupedMessages));
    for (let [i, chat] of chats.entries()) {
        //throw new Error(JSON.stringify(chat));  
        for (let msg of groupedMessages) {
            if (chat._id == msg._id) {
                //throw new Error(JSON.stringify(msg)+':'+JSON.stringify(chat));  
                chats[i].unreadCount = msg.count;
            }
            ;
        }
    }
    //throw new Error(JSON.stringify(groupedMessages)+':'+JSON.stringify(chats));  
    return chats;
}
export async function POST(request) {
    try {
        var error = { message: '', status: false };
        var data = {};
        await dbConnect();
        const email = await getServerSessionEmail();
        if (!email) {
            error = { message: 'Empty email: ' + email, status: true };
        }
        else {
            const { searchParams } = request.nextUrl;
            const user_id = searchParams.get('user_id');
            if (user_id) {
                const UserModel = User;
                const currentUser = await UserModel.findOne({ email: email }).populate('chats');
                if (currentUser) {
                    const addingUser = await UserModel.findById(user_id).populate('chats');
                    if (addingUser) {
                        if (email == addingUser.email)
                            error = { message: 'you cannot add yourself to contacts!', status: true };
                        else {
                            const ChatModel = Chat;
                            const existingChat = await ChatModel.find({ users: { $all: [currentUser._id, addingUser._id] } });
                            if (existingChat.length)
                                error = { message: 'you have already this user in your contacts!', status: true };
                            else {
                                const chat = await ChatModel.create({ name: addingUser.name, description: addingUser.email });
                                chat.users.push(currentUser._id);
                                chat.users.push(addingUser._id);
                                chat.name = currentUser.email + "&" + addingUser.email;
                                chat.description = '';
                                await chat.save();
                                currentUser.chats.push(chat);
                                await currentUser.save();
                                addingUser.chats.push(chat);
                                await addingUser.save();
                                data = chat;
                            }
                        }
                    }
                    else
                        error = { message: 'empty adding_user: ' + addingUser, status: true };
                }
                else
                    error = { message: 'empty current_user: ' + currentUser, status: true };
            }
            else
                error = { message: 'empty user_id: ' + user_id, status: true };
        }
        if (error.status)
            throw new Error(error.message);
        return NextResponse.json({ success: true, data: data }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
