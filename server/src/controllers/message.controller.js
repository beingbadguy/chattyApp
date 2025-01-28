import { getReceiverSocketId, io } from "../config/socket.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";

export const getMessages = async (req, res) => {
  try {
    try {
      const receiverId = req.params.id;
      const senderId = req.user._id;
      const message = await Message.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { receiverId: senderId, senderId: receiverId },
        ],
      });
      res.status(200).json(message);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  const uploadMedia = req.files?.media || null;
  const text = req.body.text;

  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let mediaFile;
    if (uploadMedia) {
      mediaFile = await cloudinary.v2.uploader.upload(
        uploadMedia.tempFilePath,
        {
          folder: "chatty-media-pictures",
        }
      );
    }
    let newMessage;
    if (uploadMedia && !text) {
      newMessage = new Message({
        senderId: senderId,
        receiverId: receiverId,
        media: mediaFile.secure_url,
      });
    }

    if (uploadMedia && text) {
      newMessage = new Message({
        senderId: senderId,
        receiverId: receiverId,
        text: text,
        media: mediaFile.secure_url,
      });
    }

    if (text && !uploadMedia) {
      newMessage = new Message({
        senderId: senderId,
        receiverId: receiverId,
        text: text,
      });
    }

    await newMessage.save();

    // todo: realtime message functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
