import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
    acceptChat,
    createChat,
    deleteChat,
    getChats,
} from "../controllers/chatController.js";

const router = Router();

router.get("/", verifyAuth, getChats);

router.post("/create", verifyAuth, createChat);

router.put("/accept/:chatId", verifyAuth, acceptChat);

router.delete("/delete/:receiverId", verifyAuth, deleteChat);

export default router;
