import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";

import { getMessages, sendMessage } from "../controllers/messagecontroller.js";

const router = Router();

router.post("/send-message", verifyAuth, sendMessage);

router.get("/:chatId", verifyAuth, getMessages);

export default router;
