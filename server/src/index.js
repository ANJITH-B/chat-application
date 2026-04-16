import express from "express";
import authRoutes from "./rountes/auth.route.js";
import messageRoutes from "./rountes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors' ;
import passport from "passport";
import "./lib/passport.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
    connectDB();
})