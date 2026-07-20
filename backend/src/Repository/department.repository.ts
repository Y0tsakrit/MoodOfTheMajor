import { PrismaClient } from '../../generated/prisma/client';
import { DepartmentCreateCriteria } from '../interface/departmentCreateCriteria.interface';
import { DepartmentSearchCriteria } from '../interface/departmentSearchCriteria.interface';
const prisma = new PrismaClient();


export const departmentRepository = {
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
            whereClause.faculty = {
                contains: filter.faculty,
                mode: 'insensitive'
            };
        }

        if (filter.major) {
            whereClause.major = {
                contains: filter.major,
                mode: 'insensitive'
            };
        }

        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;
        
        return await prisma.department.findMany({
            where: whereClause,
            orderBy: {
                UpdatedAt: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        });
    },
}