import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

export const connectDatabase = async () => {
    await mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.svuhpkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
}