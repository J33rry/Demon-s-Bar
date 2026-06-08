import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { logout, syncUser } from "../controllers/authController.js";

const router = Router();

router.post("/sync-user", verifyAuth, syncUser);
router.post("/logout", logout);

export default router;
