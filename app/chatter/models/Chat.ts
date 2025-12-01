import mongoose from 'mongoose';

export interface IChat {
  users: [mongoose.Types.ObjectId];
  unreadCount?: Number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IChatDocument extends IChat, Document { }

const ChatSchema = new mongoose.Schema<IChatDocument>({
  users: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  unreadCount: {
    type: Number,
    required: false,
    default: 0,
  },
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