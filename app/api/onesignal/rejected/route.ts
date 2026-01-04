import dbConnect from '../../../lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { sendPushHangUp } from '../../../lib/chatter';

export async function POST(request: NextRequest) {

    try {
        await dbConnect();
        const body = await request.json();

        sendPushHangUp(body.additionalData.userId, body.additionalData.chatId, 'User hanged up');
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }

}