import { PrismaClient } from '@prisma/client';
import { DepartmentCreateCriteria } from '../interface/departmentCreateCriteria.interface';

const prisma = new PrismaClient();


const departmentRepository = {
    async CreateDepartment(data: DepartmentCreateCriteria) {
        return await prisma.department.create({
            data: data
        });
    },

    async SearchByCriteria(filter: any) {
        return await prisma.department.findMany({
            where: filter
        });
    },

    async UpdateDepartment(id: string, data: any) {
        return await prisma.department.update({
            where: {
                id: id
            },
            data: data
        });
    },
}