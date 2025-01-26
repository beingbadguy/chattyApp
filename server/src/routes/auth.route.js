import { Router } from "express";
const router = Router();
import { logout, signup, login } from "../controllers/auth.controller.js";
import { Protected } from "../middlewares/Protected.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", Protected, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "You Are Authorised",
    data: req.user,
  });
});

export default router;
