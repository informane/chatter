import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
const ChatSchema = new mongoose.Schema<IChatDocument>({
  user_ids: [{
    type: mongoose.Schema.Types.ObjectId,
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


export interface IChat {
  user_ids: mongoose.Schema.Types.ObjectId[];
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date
}

export interface IChatDocument extends IChat, Document {

}

export default mongoose.models.Chat || mongoose.model<IChatDocument>('Chat', ChatSchema);