import ProfileManageService from "../service/profileManage.service";
import { Request, Response } from 'express';

const profileManageService = new ProfileManageService();

export const updateProfile = async (req: Request, res: Response) => {
    const profileId = req.params.profileId as string;
    const data = req.body;

    try {
        await profileManageService.updateProfile(profileId, data);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};