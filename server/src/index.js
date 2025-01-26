import dotenv from "dotenv";
import path from "path";
import databaseConnection from "./config/databaseConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, express, server } from "./config/socket.js";
dotenv.config();

const port = process.env.PORT || 8080;
const __dirname = path.resolve();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

server.listen(port, () => {
  databaseConnection();
  console.log(`Server running on port ${port}`);
});
