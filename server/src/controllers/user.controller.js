import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // console.log(req.files);
    const profilePic = req.files.profilePic;
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile Picture is Required",
      });
    }

    // TODO: cloudinary upload function
    let result;
    if (profilePic) {
      result = await cloudinary.v2.uploader.upload(profilePic.tempFilePath, {
        folder: "chatty-profile-pictures",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
