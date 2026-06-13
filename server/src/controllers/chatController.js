import { db } from "../lib/db.js";
import { chats } from "../db/schema.js";
import { and, eq, or } from "drizzle-orm";
import { io, getReceiverSocketId } from "../../index.js";

export const getChats = async (req, res) => {
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
};

export const createChat = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { receiverId } = req.body;

        // Check if there is already an existing chat or request
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
            const currentChat = existingChat[0];

            // Mutual acceptance: If they sent a request to us and we send back to them, auto-accept it!
            if (currentChat.status === "pending" && currentChat.senderId === receiverId) {
                const updatedChat = await db
                    .update(chats)
                    .set({ status: "accepted" })
                    .where(eq(chats.id, currentChat.id))
                    .returning();

                // Notify other user of mutual acceptance
                const receiverSocketId = getReceiverSocketId(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("chatUpdated", updatedChat[0]);
                }

                return res.status(200).json({
                    message: "Mutual link established",
                    chat: updatedChat[0],
                });
            }

            return res.status(200).json({
                message: "Link request already exists",
                chat: currentChat,
            });
        }

        // Create new pending connection request
        const chat = await db
            .insert(chats)
            .values({
                senderId: userId,
                receiverId,
                status: "pending",
            })
            .returning();

        // Notify receiver of new link request
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("chatCreated", chat[0]);
        }

        res.status(200).json({ chat: chat[0] });
    } catch (error) {
        res.status(500).json({ message: "Failed to create connection request" });
    }
};

export const acceptChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.uid;

        const updatedChat = await db
            .update(chats)
            .set({ status: "accepted" })
            .where(
                and(
                    eq(chats.id, chatId),
                    eq(chats.receiverId, userId),
                ),
            )
            .returning();

        if (updatedChat.length === 0) {
            return res.status(404).json({ message: "Request not found or unauthorized" });
        }

        // Notify sender that request was accepted
        const senderSocketId = getReceiverSocketId(updatedChat[0].senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("chatUpdated", updatedChat[0]);
        }

        res.status(200).json({ message: "Connection accepted successfully", chat: updatedChat[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to accept connection" });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const userId = req.user.uid; // Firebase UID
        const { receiverId } = req.params; // Firebase UID
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

        // Notify other user that connection was severed
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("chatDeleted", { otherUserId: userId });
        }

        res.status(200).json({
            message: "Connection severed and associated history deleted",
        });
    } catch (err) {
        console.error("Error severing connection:", err);
        res.status(500).json({ message: "Failed to sever connection" });
    }
};
