import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import * as AuthService from "../services/auth.service";
import { generateAccessToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.login(req.body.email, req.body.password);

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.json({
      message: user.message,
      user,
      accessToken: user.accessToken,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const refreshToken = async(req: Request, res: Response) =>{
  try {
    const token = req.cookies.refreshToken;
    if(!token) throw new Error("No refresh token privided");

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as {id: string};
    const accessToken =  generateAccessToken(decoded.id);

    return res.json({accessToken})
  } catch (error) {
    return res.status(401).json({message: "invalid refresh token"})
  }
}

export const logout = async(req: Request, res: Response) =>{
  res.clearCookie("refreshToken");
  return res.json({mesage: "Logged out successfully"})
}