import dbConnect from '../../../lib/mongodb';
import Message, { IMessage } from '../../../chatter/models/Message';
import { Model } from 'mongoose';
import { NextRequest } from 'next/server';
import { getCurrentUserModel } from '../../../lib/chatter';
import type { Document } from 'mongoose';

export default async function GET(request: NextRequest) {

  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const chat_id = searchParams.get('chat_id'); 
    const current_user = await getCurrentUserModel()
    var msgs: Promise<Document>[];
    if(current_user){
      var MessageInstance = Message as Model<IMessage>;
      msgs = await MessageInstance.find({user_id: current_user._id,chat_id:chat_id});

    } else {
      return new Response(          
        JSON.stringify({ success: false }),
        { status: 400 }
      )
    }

    if (!msgs) {
      return new Response(
          JSON.stringify({ success: false }),
          { status: 400 }
        )
    } else {
      return new Response(
        JSON.stringify({ success: true, data: msgs }),
        { status: 200 }
      );
    }

  } catch (error) {
      return new Response(
          JSON.stringify(error),
          { status: 400 }
      )
  }

}
