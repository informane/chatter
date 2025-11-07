import dbConnect from "../../../../lib/mongodb";
import Chat from "../../../../chatter/models/Chat";
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

export async function GET(request: NextRequest) {

  // Connect to MongoDB
  await dbConnect();

  // Set headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  }

 //const nativeRequest = request.request;
  try {
    const changeStream = Chat.watch();

    changeStream.on('change', (change) => {
      console.log('Change detected by Mongoose:', change);
      
      NextResponse.json({chats: change}, {status: 201, headers: headers});
    })

   /*request.on('close', async () => {
      console.log('Disconnected client. Closing stream.')
      await changeStream.close();
    })*/

  } catch (error) {
    console.error('SSE connection error:', error);
    NextResponse.json(error, {status: 400});
  }
}