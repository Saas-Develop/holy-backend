import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'], // Define os valores permitidos
    },

    deduction: {
       type: Number,
       default: 0 
    },
    value: {
       type: Number,
       required: true 
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // tasks: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Task'
    //     }
    // ],
    // credentials: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Credential'
    //     }
    // ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('Campaign', campaignSchema)