import dbConnect from '../../../lib/mongodb';
import Message, { IMessageDocument } from '../../../chatter/models/Message';
import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionEmail, getUserModel } from '../../../lib/chatter';
import User, { IUserDocument } from 'app/chatter/models/User';

export async function GET(request: NextRequest) {

  try {

    await dbConnect();
    const { searchParams } = request.nextUrl;
    const chat_id = searchParams.get('chat_id');
    if(!chat_id) throw new Error('chat_id is empty!');

    const MessageModel: Model<IMessageDocument> = Message;

    const messages = await MessageModel.find({ chat: chat_id })
      .populate('user');
    if(!messages) throw new Error('cant find messages!');
    return NextResponse.json(
      { success: true, data: messages },
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

    await dbConnect();
    var body = await request.json();
    if(!body) throw new Error('msg body is empty!');

    const { searchParams } = request.nextUrl;
    const chat_id = searchParams.get('chat_id');
    if(!chat_id) throw new Error('chat_id is empty!');

    const email = await getServerSessionEmail();
    if(!email) throw new Error('cant find current user\'s email!');

    const UserModel: Model<IUserDocument> = User;

    const currentUser = await getUserModel(email);
    if(!currentUser) throw new Error('cant find current user!');
    const user_id = currentUser._id;
    const MessageModel: Model<IMessageDocument> = Message;

    var message = await MessageModel.create({ ...body, chat: chat_id, user: user_id });

    return NextResponse.json(
      { success: true, data: message },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

