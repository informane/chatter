import dbConnect from '../../../lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { sendPushHangUp } from '../../../lib/chatter';
const fs = require('fs');

export async function POST(request: NextRequest) {

    try {
        await dbConnect();
        const body = await request.json();

        sendPushHangUp(body.additionalData.userId, body.additionalData.chatId, 'User hanged up');

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        fs.writeFile('output.json', JSON.stringify(error), 'utf8', (err) => {
            if (err) {
                console.error('An error occurred:', err);
                return;
            }
            console.log('Data successfully saved to output.json');
        });
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }

}