import dbConnect from '../../../lib/mongodb';
import User, {IUser} from '../../../chatter/models/User';
import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export default async function GET(request: NextRequest) {

  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id'); 

    const UserInstance = User as Model<IUser>;
    const user = await UserInstance.findById(id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false }),
        { status: 400 }
      )
    } else {
      return new Response(
        JSON.stringify({ success: true, data: user }),
        { status: 200 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      error,
      {status: 400}    
    );
  }

}

export async function DELETE(request: NextRequest) {

  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id'); 
    const deletedUser = await User.deleteOne({ _id: id });

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ success: false }),
        { status: 400 }
      )
    } else {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({error}),
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {

    await dbConnect();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id'); 
    const body: IUser = await request.json();

    const UserInstance = User as Model<IUser>;
    var user = await UserInstance.findByIdAndUpdate(id, { ...body, chat_ids: user.chat_ids });

    await user.save();

    return new Response(
      JSON.stringify({ success: true, data: user }),
      { status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({error}),
      { status: 400 }
    );
  }

}
