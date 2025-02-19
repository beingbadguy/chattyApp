import dotenv from "dotenv";
import path from "path";
import databaseConnection from "./config/databaseConnection.js";
import cloudinaryConnection from "./config/cloudinaryConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, express, server } from "./config/socket.js";
import fileUpload from "express-fileupload";

dotenv.config();

const port = process.env.PORT || 8080;
const __dirname = path.resolve();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

app.use(
  cors({
    origin: ["http://localhost:5173", "https://chattyapp-gy71.onrender.com/"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

server.listen(port, () => {
  databaseConnection();
  cloudinaryConnection();

  console.log(`Server running on port ${port}`);
});
