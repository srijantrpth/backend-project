import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) // used for middleware and user configurations

app.use(express.json({limit: "16kb"})) // limit of JSON which is to be accepted
app.use(express.urlencoded({extended: true, limit: "16kb"})) // we can continue without giving extended keyword as well. with the use of extended we can give nested objects.
app.use(express.static("public")) // used to store assets such as images or files such as pdf on server in our case folder name is public
app.use(cookieParser()) // used to access cookies of user


export {app} 