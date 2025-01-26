import jwt from "jsonwebtoken";
export const GenerateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("chattyApp", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return token;
};
