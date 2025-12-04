import mongoose from 'mongoose';
const ChatSchema = new mongoose.Schema({
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
export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
