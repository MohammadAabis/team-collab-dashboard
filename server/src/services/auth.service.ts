import bcrypt from "bcryptjs";

import User from "../models/User.model";
import { RegisterUser } from "../models/User.model";
import {
  generateAccessToken,
  generateRefreshToken,
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

  return {
    message: "Login successful",
    user: { id: user._id, email: user.email },
    accessToken,
    refreshToken,
  };
};
