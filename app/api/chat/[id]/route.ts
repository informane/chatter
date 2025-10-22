import dbConnect from '../../../lib/mongodb';
import Chat from '../../../chatter/models/Chat';
import {Model} from 'mongoose';
import { NextRequest } from 'next/server';
import { IChat } from './../../../chatter/models/Chat';

export default async function GET(request: NextRequest) {

  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id'); 

    if (id) {
      var ChatInstance: Model<IChat>
      const chat = await ChatInstance.findById(id);

      if (!chat) {
        return new Response(
          JSON.stringify({ success: false }),
          { status: 400 }
        )
      } else {
        return new Response(
          JSON.stringify({ success: true, data: chat }),
          { status: 201 }
        );
      }
    } else {
      return new Response(
          JSON.stringify({ success: false }),
          { status: 400 }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify(error),
      { status: 400 }
    );
  }

}

export async function DELETE(request: NextRequest) {

  try {
    await dbConnect();


    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id'); 

    if (id) {
          const deletedChat = await Chat.deleteOne({ _id: id });

      if (!deletedChat ) {
        return new Response(
          JSON.stringify({ success: false }),
          { status: 400 }
        )
      } else {
        return new Response(
          JSON.stringify({ success: true }),
          { status: 201 }
        );
      }
    } else {
      return new Response(
          JSON.stringify({ success: false }),
          { status: 400 }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify(error),
      { status: 400 }
    )
  }
}


export async function PUT(request: NextRequest) {
  try {

    await dbConnect();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const body: IChat = await request.json();

    if(body != null && id != null) {
      var ChatInstance: Model<IChat>
      const chat = await ChatInstance.findByIdAndUpdate(
        id,
        { name: body.name, description: body.description }
      );
      return new Response(
        JSON.stringify({ success: true, data: chat }),
        { status: 201 }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false }),
        { status: 400 }
      )
    } 
  } catch (error) {
    return new Response(
      JSON.stringify(error),
      { status: 400 }
    );
  }

}
