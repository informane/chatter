import dbConnect from '../../lib/mongodb';
import Message, { IMessage } from '../../chatter/models/Message';
import { Model } from 'mongoose';
import User from "../../chatter/models/User"

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

  try {

    await dbConnect();
    const { searchParams } = request.nextUrl;
    const chat_id = searchParams.get('chat_id'); 
    const MessageInstance = Message as Model<IMessage>;
    const messages = await MessageInstance.find({chat_id: chat_id});

    return NextResponse.json(
      messages,
      {status: 201}    
    );

  } catch (error) {
    return NextResponse.json(
      error,
      {status: 400}    
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    await dbConnect();
    var body = await request.json();
    //var session = await getServerSession(authOptions);
    //const User = getUserModel(session.user.email);


    var msg = new Message(body);
    await msg.save();
  
    //throw new Error({error: JSON.stringify(Nody)});
    return NextResponse.json(
      msg,
      {status: 201}    
    );
  } catch (error) {
    return NextResponse.json(
      error,
      {status: 400}    
    );
  }
}

