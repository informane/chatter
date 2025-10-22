import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.Types.ObjectId;
var MessageSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});
export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
