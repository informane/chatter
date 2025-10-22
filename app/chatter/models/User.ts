import mongoose from 'mongoose';
import { Document } from 'mongodb';
export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  google_id: mongoose.Schema.Types.ObjectId;
  chat_ids: mongoose.Schema.Types.ObjectId[];
  name: string;
  email: string;
  avatar?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date
}

export interface IUserDocument extends IUser, Document {
}
const ObjectId = mongoose.Schema.Types.ObjectId;
const UserSchema = new mongoose.Schema<IUserDocument>({
  google_id: {
    type: Number,
    required: true,
  },
  chat_ids: [{
    type: ObjectId,
    ref: 'Chat',
    required: true,
  }],
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },

}, {
  timestamps: true
});


export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
