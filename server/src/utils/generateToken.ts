import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET as string, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};

export const hashToken = async (token: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(token, salt);
};
