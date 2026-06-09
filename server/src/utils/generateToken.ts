import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

/** Hash a token before storing it in the database */
export const hashToken = async (token: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
};

/** Compare a plaintext token against a stored bcrypt hash */
export const compareToken = async (
  plainToken: string,
  hashedToken: string
): Promise<boolean> => {
  return bcrypt.compare(plainToken, hashedToken);
};
