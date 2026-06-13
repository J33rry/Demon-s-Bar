import { Router } from "express";
import { loginAuth, verifyAuth } from "../middleware/authMiddleware.js";
import { getMe, logout, syncUser } from "../controllers/authController.js";

const router = Router();

router.post("/sync-user", loginAuth, syncUser);
router.get("/me", verifyAuth, getMe);
router.post("/logout", logout);

export default router;
