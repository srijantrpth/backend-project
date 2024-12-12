import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
 const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // this thing returns an object       
 console.log(`\n MongoDB Connected || DB Host: ${connectionInstance.connection.host}`);
//  console.log(connectionInstance);
 
 
    } catch (error) {
        console.log("MONGODB connection Error", error);
        process.exit(1) // access of process is given by nodeJS. whatever process our current application is running on it's reference is given by this.
     // there are various types of exit codes   
    }
}

export default connectDB;