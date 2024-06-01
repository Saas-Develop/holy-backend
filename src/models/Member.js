import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
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
    baptized: {
        type: String,
        required: true
    },
    member_since: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    files: [{
        filename: String,
        size: Number,
        url: String,
        uuid: String
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