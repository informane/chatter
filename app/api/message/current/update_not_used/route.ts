import dbConnect from "../../../../lib/mongodb";
import Message from "../../../../chatter/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { getUserModelById } from "app/lib/chatter";
//import NextApiRequest from 'next'
import type { NextApiRequest } from 'next'
export const dynamic = 'force-dynamic';
//not used
export async function GET(request: NextRequest) {

  // Connect to MongoDB
  await dbConnect();

  // Set headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache, no-transform',
    //'Content-Encoding': 'none',
    //'X-Accel-Buffering': 'no',
    //'Access-Control-Allow-Origin': 'http://localhost:3000'
  }

  const { searchParams } = request.nextUrl;
  const chat_id = searchParams.get('chat_id');

  const pipeline = [
    {
      $match: {
        chat_id: chat_id,
      },
    },
  ];
  const changeStream = Message.watch(pipeline, { fullDocument: 'updateLookup' });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    start(controller) {
      changeStream.on('change', async (change) => {

        const changeObject = change.fullDocument;
        changeObject.user = await getUserModelById(changeObject.user);
        console.log('Change detected by Mongoose:', changeObject);

        const changedData = "data: " + JSON.stringify(changeObject) + "\n\n";
        controller.enqueue(encoder.encode(changedData));
      })

      changeStream.on('error', (error) => {
        console.error('Change stream error:', error);
        controller.error(error);
        changeStream.close();
      });

    },
    cancel() {
      console.log('Disconnected client. Closing stream.')
      changeStream.close();
    }
  })

  return new NextResponse(readableStream, { headers: headers });
}