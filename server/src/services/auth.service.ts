import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.model";
import { RegisterUser } from "../models/User.model";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  compareToken,
} from "../utils/generateToken";

export const register = async (data: RegisterUser) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await User.create({
    ...data,
    password: hashedPassword,
  });

  return {
    message: "User registered successfully",
    user: { id: newUser._id, email: newUser.email },
  };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(String(user._id));
  const refreshToken = generateRefreshToken(String(user._id));

  // Store hashed refresh token in DB
  const hashedRefreshToken = await hashToken(refreshToken);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return {
    message: "Login successful",
    user: { id: user._id, email: user.email },
    accessToken,
    refreshToken, // raw token — goes into the httpOnly cookie
  };
};

export const refreshTokenService = async (incomingRefreshToken: string) => {
  // Verify the JWT signature + expiry
  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string };

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshToken) {
    throw new Error("User not found or no stored token");
  }

  // Compare incoming token against stored hash using bcrypt.compare
  const isValid = await compareToken(incomingRefreshToken, user.refreshToken);
  if (!isValid) {
    throw new Error("Invalid refresh token");
  }

  // Rotate: issue new pair
  const newAccessToken = generateAccessToken(String(user._id));
  const newRefreshToken = generateRefreshToken(String(user._id));

  // Store the new hashed refresh token
  user.refreshToken = await hashToken(newRefreshToken);
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: { id: user._id, email: user.email },
  };
};

export const logout = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };

    await User.findByIdAndUpdate(decoded.id, {
      refreshToken: null,
    });

    return true;
  } catch {
    return false;
  }
};
