import dbConnect from "../../../../lib/mongodb";
import Message from "../../../../chatter/models/Message";
import { NextRequest, NextResponse } from "next/server";
//import NextApiRequest from 'next'
import type {NextApiRequest} from 'next'
import { getUserModel, getUserModelById } from "../../../../lib/chatter";
// Required for SSE to prevent Next.js from closing the connection
export const config = {
  api: {
    responseLimit: false,
  },
};

export async function GET(request: NextApiRequest) {

  // Connect to MongoDB
  await dbConnect();

  // Set headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  }

 //const nativeRequest = request.request;
  try {
    const changeStream = Message.watch();

    changeStream.on('change', (change) => {
      console.log('Change detected by Mongoose:', change);
      let users = [];
      for(let [index,message] of change.entries()) {
        users[index] = getUserModelById(message.user_id)
      }
      NextResponse.json({msgs: change, users: users}, {status: 201, headers: headers});
    })

    request.on('close', async () => {
      console.log('Disconnected client. Closing stream.')
      await changeStream.close();
    })

  } catch (error) {
    console.error('SSE connection error:', error);
    NextResponse.json(error, {status: 400});
  }
}