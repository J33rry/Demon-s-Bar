import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { db } from "../lib/db.js";
import { chats } from "../db/schema.js";
import { and, eq, or } from "drizzle-orm";

const router = Router();

router.get("/", verifyAuth, async (req, res) => {
    try {
        // console.log("getting chats");
        const userId = req.user.uid;
        // console.log(userId);
        const userChats = await db
            .select()
            .from(chats)
            .where(
                or(eq(chats.receiverId, userId), eq(chats.senderId, userId)),
            );
        res.status(200).json({ chats: userChats });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chats" });
    }
});

router.post("/create", verifyAuth, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { receiverId } = req.body;
        const existingChat = await db
            .select()
            .from(chats)
            .where(
                or(
                    and(
                        eq(chats.senderId, userId),
                        eq(chats.receiverId, receiverId),
                    ),
                    and(
                        eq(chats.senderId, receiverId),
                        eq(chats.receiverId, userId),
                    ),
                ),
            );
        if (existingChat.length != 0) {
            res.status(200).json({
                message: "chat already existed",
                chat: existingChat[0],
            });
        } else {
            const chat = await db
                .insert(chats)
                .values({
                    senderId: userId,
                    receiverId,
                })
                .returning();
            res.status(200).json({ chat: chat[0] });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to create chat" });
    }
});

router.delete("/delete/:receiverId", verifyAuth, async (req, res) => {
    try {
        const userId = req.user.uid; // Firebase UID
        const { receiverId } = req.params; // Firebase UID

        // Cascade delete on the database automatically deletes associated messages
        await db
            .delete(chats)
            .where(
                or(
                    and(
                        eq(chats.senderId, userId),
                        eq(chats.receiverId, receiverId),
                    ),
                    and(
                        eq(chats.senderId, receiverId),
                        eq(chats.receiverId, userId),
                    ),
                ),
            );

        res.status(200).json({
            message: "Chat and associated messages deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting chat:", err);
        res.status(500).json({ message: "Failed to delete chat" });
    }
});

export default router;
