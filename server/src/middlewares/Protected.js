import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const Protected = async (req, res, next) => {
  try {
    const token = req.cookies.chattyApp;
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Token - Not Available",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
      });
    }
    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unauthorised Access",
    });
  }
};
