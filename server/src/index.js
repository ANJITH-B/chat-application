import express from "express";
import authRoutes from "./rountes/auth.route.js";
import messageRoutes from "./rountes/message.route.js";
import groupRoutes from "./rountes/group.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors' ;
import passport from "passport";
import "./lib/passport.js";
import { app , server } from "./lib/socket.js";
import { initMediasoup } from "./lib/mediasoup.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

server.listen(process.env.PORT, () => {
    // console.log(`server is running on port ${process.env.PORT}`)
    connectDB();
    initMediasoup().then(() => {
        // console.log('Mediasoup initialized');
    }).catch(err => {
        // console.error('Mediasoup initialization failed:', err);
    });
})