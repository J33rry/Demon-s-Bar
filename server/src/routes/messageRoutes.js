import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { messages } from "../db/schema.js";
import { db } from "../lib/db.js";
// import { sendMessage } from "../controllers/messageController.js";

const router = Router();

router.post("/send-message", verifyAuth, async (req, res) => {
    try {
        const { chatId, senderId, text, image } = req.body;

        const message = await db.insert(messages).values({
            chatId,
            senderId,
            text,
            image,
            createdAt: new Date(),
        });

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: "Failed to send message" });
    }
});

export default router;
