import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.Types.ObjectId;
var ChatSchema = new mongoose.Schema({
    user_ids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            //required: true
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
