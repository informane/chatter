import dbConnect from '../../lib/mongodb';
import User from '../../chatter/models/User';
import { NextResponse } from 'next/server';
export async function GET(request) {
    try {
        await dbConnect();
        var error = { status: false, message: null };
        var data = [];
        let UserModel = User;
        const { searchParams } = request.nextUrl;
        const query = searchParams.get('query');
        if (query.length !== 0 && query) {
            const regex = new RegExp(query, 'i');
            const users = await UserModel.find({ $or: [{ email: regex }, { name: regex }, { description: regex }] });
            if (!users) {
                error = { status: true, message: 'can\'t find such users!' };
            }
            else {
                data = users;
                error = { status: false, message: null };
            }
        }
        else {
            const users = await UserModel.find({});
            if (!users) {
                error = { status: true, message: 'can\'t find such users!' };
            }
            else {
                data = users;
                error = { status: false, message: null };
            }
        }
        if (error.status)
            throw new Error(error.message);
        return NextResponse.json({ success: true, data: data }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
//checked
export async function POST(request) {
    try {
        await dbConnect();
        var body = await request.json();
        var error;
        if (!body)
            error = { status: true, message: 'User body is empty!' };
        //var UserInstance: Model<IUserDocument>;
        var user = new User(body);
        var savedUser = await user.save();
        if (!savedUser)
            error = { status: true, message: 'User could not be saved!' };
        //throw new Error(JSON.stringify(savedUser));
        return NextResponse.json({ success: true, data: savedUser }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: JSON.stringify(error) }, { status: 400 });
    }
}
