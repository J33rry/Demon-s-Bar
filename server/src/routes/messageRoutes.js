import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { messages } from "../db/schema.js";
import { db } from "../lib/db.js";
import { eq, asc } from "drizzle-orm";
import { io, getReceiverSocketId } from "../../index.js";

const router = Router();

router.post("/send-message", verifyAuth, async (req, res) => {
    try {
        const {
            chatId,
            senderId,
            text = "",
            image = "",
            receiverId,
        } = req.body; // 2. Expect receiverId
        const message = await db
            .insert(messages)
            .values({
                chatId,
                senderId,
                text,
                image,
                createdAt: new Date(),
            })
            .returning();
        const insertedMessage = message[0];
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", insertedMessage);
        }
        res.status(200).json({ message: insertedMessage });
    } catch (error) {
        res.status(500).json({ message: "Failed to send message" });
    }
});

router.get("/:chatId", verifyAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        const chatMessages = await db
            .select()
            .from(messages)
            .where(eq(messages.chatId, chatId))
            .orderBy(asc(messages.createdAt));

        res.status(200).json({ messages: chatMessages });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

export default router;
