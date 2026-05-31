import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, JWT_ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};
