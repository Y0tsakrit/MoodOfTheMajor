import { Request, Response, NextFunction } from "express";
import AuthService from "../service/auth.service";

const authService = new AuthService();

export const verifyToken = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        const decoded = await authService.verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        }

        const payload = decoded as {
            userId: string;
            email: string;
            profileId: string;
            isAdmin: boolean;
        };

        (req as Request & { user?: { id: string; email: string; profileId: string; isAdmin: boolean } }).user = {
        id: payload.userId,
        email: payload.email,
        profileId: payload.profileId,
        isAdmin: payload.isAdmin
        };
        
        next();
    } catch (error) {
        return res.status(401).json({
        message: "Invalid or expired token",
        });
    }
};