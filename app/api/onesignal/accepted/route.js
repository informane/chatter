import dbConnect from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const destinationUrl = new URL('/', request.url + '?chat_id=' + body.additionalData.chatId);
        return NextResponse.redirect(destinationUrl, 307); // Use 307 for a temporary redirect
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
