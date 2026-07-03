import { PrismaClient } from '@prisma/client';
import { DepartmentCreateCriteria } from '../interface/departmentCreateCriteria.interface';
import { DepartmentSearchCriteria } from '../interface/departmentSearchCriteria.interface';
const prisma = new PrismaClient();


const departmentRepository = {
    async CreateDepartment(data: DepartmentCreateCriteria) {
        return await prisma.department.create({
            data: data
        });
    },

    async SearchByCriteria(filter: DepartmentSearchCriteria) {
        const whereClause: any = {};

        if (filter.id) {
            whereClause.id = filter.id;
        }

        if (filter.faculty) {
            whereClause.faculty = filter.faculty;
        }

        if (filter.major) {
            whereClause.major = filter.major;
        }
        
        return await prisma.department.findMany({
            where: whereClause
        });
    },
}