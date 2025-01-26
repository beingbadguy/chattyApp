import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { Protected } from "../middlewares/Protected.js";
const router = Router();

router.get("/allusers", Protected, getAllUsers);

export default router;
