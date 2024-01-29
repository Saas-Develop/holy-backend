import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    cell_number: {
        type: String,
        required: true
    },
    bday: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    files: [{
        originalname: String,
        filename: String,
        url: String,
        size: Number,
    }],
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

export default mongoose.model('Member', memberSchema)