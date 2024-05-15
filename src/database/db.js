import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

export const connectDatabase = async () => {
    await mongoose.connect(`mongodb+srv://alekplaysholy:SVswufPC9Ruc2x10@holy.aylm8rn.mongodb.net/?retryWrites=true&w=majority&appName=Holy`)
}