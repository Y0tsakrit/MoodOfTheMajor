import { PrismaClient } from '@prisma/client';
import { ProfileCreateCriteria } from '../interface/profileCreateCriteria.interface';
import { ProfileSearchCriteria } from '../interface/profileSearchCriteria.interface';
import { ProfileUpdateCriteria } from '../interface/profileUpdateCriteria.interface';


const prisma = new PrismaClient();


export const profileRepository = {
    async CreateProfile(data: ProfileCreateCriteria) {
        return await prisma.profile.create({
            data: data
        });
    },

    async SearchByCriteria(filter: ProfileSearchCriteria) {

        const whereClause: any = {};

        if (filter.id) {
            whereClause.id = filter.id;
        }

        if (filter.firstName) {
            whereClause.firstName = filter.firstName;
        }

        if (filter.lastName) {
            whereClause.lastName = filter.lastName;
        }

        if (filter.departmentId) {
            whereClause.departmentId = filter.departmentId;
        }

        if (filter.year) {
            whereClause.year = filter.year;
        }

        whereClause.page = filter.page;
        whereClause.limit = filter.limit;

        return await prisma.profile.findMany({
            where: whereClause
        });
    },

    async UpdateProfile(id: string, data: ProfileUpdateCriteria) {

        return await prisma.profile.update({
            where: {
                id: id
            },
            data: data
        });
    },
}