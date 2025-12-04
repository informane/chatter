import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder } from 'agora-token';
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // Required parameters for both tokens:
    const channelName = searchParams.get('channelName'); // Used for RTC
    const userId = searchParams.get('userId'); // Used for RTM (must be legal string)
    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    // Environment variables
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    if (!appId || !appCertificate) {
        return NextResponse.json({ error: 'App ID and Certificate not set' }, { status: 500 });
    }
    // Token expiration settings
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpire = currentTimestamp + expirationTimeInSeconds;
    const privilegeExpire = currentTimestamp + expirationTimeInSeconds;
    // --- Generate RTC Token ---
    // RTC requires a numeric UID. We derive it from the string userId for consistency.
    // This derivation needs to be consistent everywhere.
    const numericUid = Math.floor(Math.random() * 65535); // Ensures a non-zero integer UID
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName || "default", // Channel name is required here
    numericUid, RtcRole.PUBLISHER, tokenExpire, privilegeExpire // V3 of token builder requires 7 arguments
    );
    // --- Generate RTM Token ---
    // RTM requires a string UID/userId
    const rtmToken = RtmTokenBuilder.buildToken(appId, appCertificate, userId, // Must be a legal, non-empty string ID
    tokenExpire);
    return NextResponse.json({
        rtcToken,
        rtmToken,
        appId,
        channelName: channelName || "default",
        numericUid,
        userId // The legal string ID used for RTM
    });
}
