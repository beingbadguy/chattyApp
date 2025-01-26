import { Router } from "express";
import { getAllUsers, updateUser } from "../controllers/user.controller.js";
import { Protected } from "../middlewares/Protected.js";
const router = Router();

router.get("/allusers", Protected, getAllUsers);
router.put("/user", Protected, updateUser);

export default router;
