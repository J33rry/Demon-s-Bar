import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { db } from "../lib/db.js";
import { chats } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", verifyAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const userChats = await db
            .select()
            .from(chats)
            .where(eq(chats.senderId, userId));
        res.status(200).json({ chats: userChats });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chats" });
    }
});

router.post("/create", verifyAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(req.user);
        const { receiverId } = req.body;
        console.log(receiverId);
        const chat = await db
            .insert(chats)
            .values({
                senderId: userId,
                receiverId,
                createdAt: new Date(),
            })
            .returning();
        res.status(200).json({ chat: chat[0] });
    } catch (error) {
        res.status(500).json({ message: "Failed to create chat" });
    }
});

export default router;
