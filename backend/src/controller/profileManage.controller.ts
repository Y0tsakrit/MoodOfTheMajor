import departmentManageService from "../service/departmentManage.service";
import ProfileManageService from "../service/profileManage.service";
import { DepartmentCreateDTO } from '../interface/createDepartmentDTO.interface';
import { Request, Response } from 'express';

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