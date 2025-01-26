import { Router } from "express";
import { Protected } from "../middlewares/Protected.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.get("/messages/:id", Protected, getMessages);
router.post("/send/:id", Protected, sendMessage);

export default router;
