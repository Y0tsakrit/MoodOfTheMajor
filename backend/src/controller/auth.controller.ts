import { Request, Response } from 'express';
import AuthService from '../service/auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.registerUser(req.body);
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        return res.json(result);
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshAccessToken(refreshToken);
        return res.json(result);
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};