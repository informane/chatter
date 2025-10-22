import dbConnect from '../../lib/mongodb';
import User, {IUser, IUserDocument} from '../../chatter/models/User';
import {Model} from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserModel } from '../../lib/chatter';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

  try {

    await dbConnect();
    var error = false;
    var data = [];
    let UserModel: Model<IUserDocument> = User;
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query');

    if(query.length !== 0 && query){
      const regex = new RegExp(query,'i');
      const users = await UserModel.find({$or: [{email: regex}, {name: regex}, {description: regex}]});
      if(!users) {
        error = true;
      } else {
        data = users;
        error = false;
      }
    } 
    else {
      const users = await UserModel.find({});
      if(!users) {
        error = true;
      } else {
        data = users;
        error = false;
      }
    }
      return NextResponse.json(
        {success: !error, data: data},
        {status: !error ? 200 : 400}    
      );
      
  } catch (error) {
    return NextResponse.json(
      {error: JSON.stringify(error)},
      {status: 401}    
    );
  }
}
//checked
export async function POST(request: Request) {
  try {

    await dbConnect();
    var body  = await request.json();

    //var UserInstance: Model<IUserDocument>;
    var user = new User(body);
    var savedUser = await user.save();
  
    //throw new Error(JSON.stringify(savedUser));
    return NextResponse.json(
      savedUser,
      {status: 201}    
    );
  } catch (error) {
    return NextResponse.json(
      {error: JSON.stringify(error)},
      {status: 400}    
    );
  }
}

