import departmentManageService from "../service/departmentManage.service";
import ProfileManageService from "../service/profileManage.service";
import { DepartmentCreateDTO } from '../interface/createDepartmentDTO.interface';
import { Request, Response } from 'express';

type AuthRequest = Request & { user?: { profileId?: string; isAdmin?: boolean } };
import jsonwebtoken from 'jsonwebtoken';

const profileManageService = new ProfileManageService();
const departmentService = new departmentManageService();

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const profileId = req.user?.profileId;
    
    if (!profileId) {
        return res.status(401).json({ error: "Unauthorized: Missing profile identifier in session token" });
    }
    const data = req.body;
    try {
        let resolvedDepartmentId: string | undefined = undefined;

        if (data.faculty || data.major) {
            let targetFaculty = data.faculty;
            let targetMajor = data.major;

            if (!targetFaculty || !targetMajor) {
                const currentProfile = await profileManageService.getProfile({ id: profileId });
                if (!currentProfile || !currentProfile[0]) {
                    return res.status(404).json({ error: "Profile not found" });
                }

                const deptData = currentProfile[0].department;

                if (!targetFaculty) targetFaculty = deptData?.faculty || "";
                if (!targetMajor) targetMajor = deptData?.major || "";
            }

            const fetchedId = await getDepartmentOrCreate({
                faculty: targetFaculty,
                major: targetMajor,
            }, res);

            if (!fetchedId) return;
            resolvedDepartmentId = fetchedId;
        }

        const updateData = {
            firstName: data.firstName,
            lastName: data.lastName,
            year: data.year,
            password: data.password,
            ...(resolvedDepartmentId && { departmentId: resolvedDepartmentId }) 
        };

        await profileManageService.updateProfile(profileId, updateData);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
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

        criteria = { id: decoded?.profileId, isAdmin: decoded?.isAdmin };
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
        // Safe case normalization to ensure matching across search queries
        const searchCriteria = {
            faculty: criteria.faculty.toLowerCase(),
            major: criteria.major.toLowerCase()
        };

        let departments = await departmentService.getDepartment(searchCriteria);
        let department = Array.isArray(departments) ? departments[0] : departments;
        
        if (!department) {
            department = await departmentService.createDepartment(searchCriteria);
        }
        
        return department.id; 
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
        return null;
    }
};