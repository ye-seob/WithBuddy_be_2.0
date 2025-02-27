import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY!;
const SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY!;

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, SECRET_ACCESS_KEY, { expiresIn: "3h" });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, SECRET_REFRESH_KEY, { expiresIn: "2d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_ACCESS_KEY);
};
