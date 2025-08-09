import mongoose from 'mongoose';

export const testConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/sarahaApp" )
        console.log("mongoose connected successfully 👌")
    } catch (error) {
        console.log(`Failed to connect : ${error}`)
    }
}
