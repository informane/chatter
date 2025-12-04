// src/app/api/generate-token/route.js (for App Router)
import { ChatTokenBuilder } from 'agora-token'; // or RtcTokenBuilder, RtmTokenBuilder
import { NextResponse } from 'next/server';
export async function POST(request) {
    const { userId } = await request.json();
    if (!userId) {
        return NextResponse.json({ error: 'UserId parameter is required' }, { status: 400 });
    }
    const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const expirationTimeInSeconds = 3600; // Token valid for 1 hour
    const currentTime = Math.floor(Date.now() / 1000);
    //const privilegeExpireTime = currentTime + expirationTimeInSeconds;
    if (!appID || !appCertificate) {
        return NextResponse.json({ error: 'App ID or App Certificate not set' }, { status: 500 });
    }
    try {
        // Use the appropriate token builder for your use case (Chat, RTC, RTM)
        const token = ChatTokenBuilder.buildUserToken(appID, appCertificate, userId, expirationTimeInSeconds);
        return NextResponse.json({ token, appID });
    }
    catch (error) {
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}
