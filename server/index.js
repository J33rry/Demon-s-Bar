import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./src/lib/db.js";
import { sql } from "drizzle-orm";

import authRoutes from "./src/routes/authRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connected successfully");
});
