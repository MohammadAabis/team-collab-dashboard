import { Request, Response } from "express";

import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json(user)
    } catch (error: any) {
        res.status(400).json({message: error.message})        
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.login(req.body.email, req.body.password);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({message: error.message })
    }
}

// export const getProfile = async (req: Request, res: Response) => {
//   return res.json(req.user);
// };