// require('dotenv').config({path: './env'})  breaks the consistency of the code
import dotenv from "dotenv"; // wont work without dotenv config and some changes in package.json like experimental feature
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
  path: "./env",
});

// const app = express()
// ;(async ()=>{ 
// try {
//     await mongoose.connect(`${process.env.MONGODB_URI/DB_NAME}`)
// app.on("error", (error) => {
//     console.log(`ERROR`); // to handle errors when app is not able to talk to DB. "error" is the event of express which we are listening on
//     throw(error)

//     })
//     app.listen(process.env.PORT, ()=>{
//         console.log(`App is listening on port ${process.env.PORT}`);

// })
// }

// catch (error) {
//     console.error("ERROR: ", error);
//     throw error

// }

// })() // IIFE

// Due to Above Approach the index file gets polluted gets overwhelmed

connectDB()
.then(()=>{


  app.listen(process.env.PORT || 9000, () => {
    
    
    console.log(`Server is Running at port: ${process.env.PORT}`);
  
});
}).catch((err) => {
  
    console.log(`MongoDB Connection Failed!! ${err}`);
       process.exit(1) // access of process is given by nodeJS. whatever process our current application is running on it's reference is given by this.
     // there are various types of exit codes 
  });
