import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.Types.ObjectId;
var UserSchema = new mongoose.Schema({
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
export default mongoose.models.User || mongoose.model('User', UserSchema);
