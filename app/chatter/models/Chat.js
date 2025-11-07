import mongoose from 'mongoose';
var ChatSchema = new mongoose.Schema({
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
export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
