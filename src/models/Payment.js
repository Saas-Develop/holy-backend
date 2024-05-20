import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('Payment', paymentSchema)