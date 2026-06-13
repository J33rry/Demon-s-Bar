import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
    createChat,
    deleteChat,
    getChats,
} from "../controllers/chatController.js";

const router = Router();

router.get("/", verifyAuth, getChats);

router.post("/create", verifyAuth, createChat);

router.delete("/delete/:receiverId", verifyAuth, deleteChat);

export default router;
