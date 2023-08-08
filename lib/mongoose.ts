import mongoose from "mongoose";

let isConnected = false;

export const connectToDB =async () => {
    mongoose.set("strictQuery", true)
    
    if(!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
    if(isConnected) return console.log("MongoDB already connected");
    
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected=true

        console.log("mongodb is connected");
        
    } catch (error) {
        console.log(`connect to mongodb ${process.env.MONGODB_URL} failed, error is: ${error} `);
        
    }
}