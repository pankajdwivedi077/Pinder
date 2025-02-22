import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { sendMessage, getConversion } from "../controller/messageController.js"

const router = express.Router();

router.post("/send", protectRoute, sendMessage)
router.get("/conversation/:userId", protectRoute, getConversion)

export default router;