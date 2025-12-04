import dbConnect from '../../../lib/mongodb';
import Message from '../../../chatter/models/Message';
import { NextResponse } from 'next/server';
export default async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        var MessageInstance = Message;
        const user = await MessageInstance.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ success: false }), { status: 400 });
        }
        else {
            return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
        }
    }
    catch (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}
export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        var MessageInstance = Message;
        const deletedMessage = await MessageInstance.deleteOne({ _id: id });
        if (!deletedMessage) {
            return new Response(JSON.stringify({ success: false }), { status: 400 });
        }
        else {
            return new Response(JSON.stringify({ success: true, data: deletedMessage }), { status: 200 });
        }
    }
    catch (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}
export async function PUT(request) {
    try {
        await dbConnect();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        const body = await request.json();
        var MessageInstance = Message;
        var message = await MessageInstance.findByIdAndUpdate(id, body);
        return NextResponse.json({ success: true, data: message }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
