import mongoose from "mongoose";

const recentActivitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Transaction', 'Member'],
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionType: {
        type: String
    },
    description: {
        type: String
    },
    value: {
        type: Number
    },
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('RecentActivity', recentActivitySchema);
