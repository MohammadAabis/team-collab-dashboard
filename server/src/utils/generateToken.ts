import jwt from "jsonwebtoken";


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
