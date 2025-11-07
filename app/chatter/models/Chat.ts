import mongoose from 'mongoose';

/*export interface IMessageDocument extends IMessage, Document {}
export interface IMessage {
  user_id: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
const MessageSchema = new mongoose.Schema<IMessageDocument>({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
},{
  timestamps: true
});*/

export interface IChat {
  users: [mongoose.Types.ObjectId];
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IChatDocument extends IChat, Document {}

const ChatSchema = new mongoose.Schema<IChatDocument>({
  users: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});



export default mongoose.models.Chat || mongoose.model<IChatDocument>('Chat', ChatSchema);