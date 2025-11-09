var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from 'agora-access-token';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, channelName, userId, appId, appCertificate, expirationTimeInSeconds, currentTimestamp, tokenExpire, privilegeExpire, numericUid, rtcToken, rtmToken;
        return __generator(this, function (_a) {
            searchParams = new URL(request.url).searchParams;
            channelName = searchParams.get('channelName');
            userId = searchParams.get('userId');
            if (!userId) {
                return [2 /*return*/, NextResponse.json({ error: 'userId is required' }, { status: 400 })];
            }
            appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
            appCertificate = process.env.AGORA_APP_CERTIFICATE;
            if (!appId || !appCertificate) {
                return [2 /*return*/, NextResponse.json({ error: 'App ID and Certificate not set' }, { status: 500 })];
            }
            expirationTimeInSeconds = 3600;
            currentTimestamp = Math.floor(Date.now() / 1000);
            tokenExpire = currentTimestamp + expirationTimeInSeconds;
            privilegeExpire = currentTimestamp + expirationTimeInSeconds;
            numericUid = userId.length % 65535 || 1;
            rtcToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName || "default", // Channel name is required here
            numericUid, RtcRole.PUBLISHER, tokenExpire);
            rtmToken = RtmTokenBuilder.buildToken(appId, appCertificate, userId, // Must be a legal, non-empty string ID
            RtmRole.Rtm_User, tokenExpire);
            return [2 /*return*/, NextResponse.json({
                    rtcToken: rtcToken,
                    rtmToken: rtmToken,
                    appId: appId,
                    channelName: channelName || "default",
                    numericUid: numericUid,
                    userId: userId // The legal string ID used for RTM
                })];
        });
    });
}
