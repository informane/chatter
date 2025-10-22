import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
const MessageSchema = new mongoose.Schema({
  chat_id: {
    type: ObjectId,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
},{
  timestamps: true
});

export interface IMessage {
  chat_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date
}

export interface IMessageDocument extends IMessage, Document {
}


export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);