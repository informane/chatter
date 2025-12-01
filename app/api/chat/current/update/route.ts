import dbConnect from "../../../../lib/mongodb";
import Chat from "../../../../chatter/models/Chat";
import { NextRequest, NextResponse } from "next/server";
import { getUserModelById } from "app/lib/chatter";

export const dynamic = 'force-dynamic';

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
  const user_id = searchParams.get('user_id');

  const pipeline = [
    {
      $match: {
        users: user_id
      }
    },
  ];
  const changeStream = Chat.watch(pipeline, { fullDocument: 'updateLookup' });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    start(controller) {
      changeStream.on('change', async (change) => {

        const changeObject = change.fullDocument;
        for (const [idx, userId] of changeObject.users) {
          if (userId == user_id) {
            changeObject.users[0] = await getUserModelById(userId);
          }
        }

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