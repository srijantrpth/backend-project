import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
 const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // this thing returns an object       
 console.log(`\n MongoDB Connected || DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection Error \n", error);
        throw error
  
    }
}

export default connectDB;