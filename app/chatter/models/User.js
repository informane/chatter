import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.Types.ObjectId;
var UserSchema = new mongoose.Schema({
    google_id: {
        type: Number,
        required: true,
    },
    chats: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        }],
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false
    },
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
export default mongoose.models.User || mongoose.model('User', UserSchema);
