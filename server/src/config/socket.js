import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", ["https://chattyapp-gy71.onrender.com/"]],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // get online users
  const onlineUsers = Object.keys(userSocketMap);
  io.emit("getOnlineUsers", onlineUsers);

  // Handle 'typing' event
  socket.on("typing", (data) => {
    const { senderId, receiverId } = data;
    const receiverSocketId = userSocketMap[receiverId];
    console.log("Receiver socket id: " + receiverSocketId);
    io.to(receiverSocketId).emit("typing", senderId); // Notify the receiver that the sender is typing
  });

  // Handle 'stopTyping' event
  socket.on("stopTyping", (data) => {
    const { senderId, receiverId } = data;
    const receiverSocketId = userSocketMap[receiverId];
    io.to(receiverSocketId).emit("stopTyping", senderId); // Notify the receiver that the sender has stopped typing
  });

  // when user disconnects from server
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    const onlineUsers = Object.keys(userSocketMap);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

export { io, app, server, express };
