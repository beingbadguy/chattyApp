import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { GenerateTokenAndSetCookie } from "../utilities/GenerateTokenAndSetCookie.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email && !password && !name) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the field carefully",
      });
    }
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "Password length must be greater than or equal to 6 ",
      });
    }

    if (!validateEmail(email)) {
      return res.staus(400).json({
        success: false,
        message: "Please Enter a valid email",
      });
    }

    const UserAlreadyExist = await User.findOne({ email });
    if (UserAlreadyExist) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    // todo- complete this section
    GenerateTokenAndSetCookie(res, newUser._id);
    res.status(200).json({
      success: true,
      message: "User has been created sucsussfully",
      data: newUser,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("chattyApp");
    return res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "Password length must be greater than or equal to 6 ",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please Enter a valid email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    user.password = undefined;
    GenerateTokenAndSetCookie(res, user._id);
    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


