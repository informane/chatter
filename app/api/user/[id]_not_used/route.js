import dbConnect from '../../../lib/mongodb';
import User from '../../../chatter/models/User';
import { NextResponse } from 'next/server';
//not used
export default async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        const UserInstance = User;
        const user = await UserInstance.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ success: false }), { status: 400 });
        }
        else {
            return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
        }
    }
    catch (error) {
        return NextResponse.json(error, { status: 400 });
    }
}
export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        const deletedUser = await User.deleteOne({ _id: id });
        if (!deletedUser) {
            return new Response(JSON.stringify({ success: false }), { status: 400 });
        }
        else {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
    }
    catch (error) {
        return new Response(JSON.stringify({ error }), { status: 400 });
    }
}
export async function PUT(request) {
    try {
        await dbConnect();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        const body = await request.json();
        const UserInstance = User;
        var user = await UserInstance.findByIdAndUpdate(id, Object.assign(Object.assign({}, body), { chat_ids: user.chat_ids }));
        await user.save();
        return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error }), { status: 400 });
    }
}
