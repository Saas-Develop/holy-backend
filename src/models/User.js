import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    church_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    subscription: {
        type: String,
        enum: ['active', 'inactive'], // Adapte conforme necessário
        default: 'inactive'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    campaigns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    }],
    customerId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    refreshToken: {
        type: String
    }
})

export default mongoose.model('User', userSchema)