import departmentManageService from "../service/departmentManage.service";
import ProfileManageService from "../service/profileManage.service";
import { DepartmentCreateDTO } from '../interface/createDepartmentDTO.interface';
import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';

const profileManageService = new ProfileManageService();
const departmentService = new departmentManageService();

export const updateProfile = async (req: Request, res: Response) => {
    const profileId = req.params.profileId as string;
    const data = req.body;
    try {

        if(data.faculty || data.major) {
            const departmentId = await getDepartmentOrCreate({
                faculty: data.faculty,
                major: data.major,
            }, res);

        if (!departmentId) return;
        data.departmentId = departmentId;
        }

        const updateData = { ...data};

        await profileManageService.updateProfile(profileId, updateData);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    let criteria: any = {};

    const hasQueryParams = Object.keys(req.query).length > 0;

    if (hasQueryParams) {
        criteria = req.query;
    } else {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

        const parts = authHeader.split(' ');
        const token = parts[1];
        if (!token) return res.status(401).json({ error: 'Token missing' });

        const decoded = jsonwebtoken.decode(token) as any;

        criteria = { id: decoded?.profileId };
    }

    try {
        const profiles = await profileManageService.getProfile(criteria);
        return res.status(200).json(profiles);
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const getDepartmentOrCreate = async (criteria: DepartmentCreateDTO, res: Response): Promise<string | null> => {
    if (!criteria.faculty || !criteria.major) {
        res.status(400).json({ error: 'Faculty and Major are required' });
        return null;
    }

    try {
        let departments = await departmentService.getDepartment(criteria);
        
        let department = Array.isArray(departments) ? departments[0] : departments;
        
        if (!department) {
            department = await departmentService.createDepartment(criteria);
        }
        
        return department.id; 
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
        return null;
    }
};