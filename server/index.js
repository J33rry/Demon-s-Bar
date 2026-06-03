import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./src/lib/db.js";
import { sql } from "drizzle-orm";

import authRoutes from "./src/routes/authRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));

app.get("/health", (req, res) => {
    res.send("Hello World");
})

const PORT = process.env.PORT || 3000;

app.use( "/api/auth",authRoutes)

app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT}`);
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connected successfully");
});