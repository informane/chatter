import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema<IMessageDocument>({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
  },
},{
  timestamps: true
});

export interface IMessage {
  chat: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date
}

export interface IMessageDocument extends IMessage, Document {
}


export default mongoose.models.Message || mongoose.model<IMessageDocument>('Message', MessageSchema);