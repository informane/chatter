import dbConnect from '../../../lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSessionEmail } from '../../../lib/chatter';
import { Model } from "mongoose";
import User, { IUser, IUserDocument } from '../../../chatter/models/User';


export async function GET(request: NextRequest) {

    try {
        await dbConnect();
        var body = await request.json();
        if (!body) throw new Error('msg body is empty!');

        var error = { status: false, message: '' };
        var data = [];

        const email = await getServerSessionEmail();

        if (email) {
            const UserModel: Model<IUserDocument> = User;
            const currentUser = await UserModel.findOne({ email: email });
            currentUser.one_signal_user_id = body.user_id;
            currentUser.save();

        } else error = { status: true, message: 'empty email: ' + email };

        if (error.status)
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 200 }
            )

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