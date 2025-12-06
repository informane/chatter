import dbConnect from '../../../lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSessionEmail } from '../../../lib/chatter';
import { Model } from "mongoose";
import User, { IUser, IUserDocument } from '../../../chatter/models/User';
import axios from 'axios';


export async function POST(request: NextRequest) {

    try {
        await dbConnect();
        const body = await request.json();;
        const oneSignalAppId = process.env.ONESIGNAL_APP_ID;
        const oneSignalApiKey = process.env.ONESIGNAL_REST_API_KEY;

        if (!body) throw new Error('Request body is empty!');

        const { userId, messageContent, chatId } = body;

        await axios.post('https://api.onesignal.com/notifications?c=push', {
            app_id: oneSignalAppId,
            "include_aliases": {
                "onesignal_id": [
                    userId
                ]
            },
            contents: {
                en: messageContent || "You have a new message!",
            },
            // Optionally add data payload to handle clicks in your Agora app
            data: {
                // e.g., link to the specific chat
                chatId: chatId
            }
        }, {
            headers: {
                'Authorization': `Key ${oneSignalApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }

}