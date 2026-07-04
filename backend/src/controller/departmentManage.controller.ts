import departmentManageService from '../service/departmentManage.service';

import { Request, Response } from 'express';

const departmentService = new departmentManageService();

export const getDepartment = async (req: Request, res: Response) => {
    const criteria = req.query;
    try {
        const department = await departmentService.getDepartment(criteria);
        res.json(department);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
};
