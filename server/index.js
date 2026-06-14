import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./src/lib/db.js";
import { sql } from "drizzle-orm";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./src/routes/authRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    // Broadcast the list of active user IDs to all online clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        // Send the updated online list to clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connected successfully");
});
