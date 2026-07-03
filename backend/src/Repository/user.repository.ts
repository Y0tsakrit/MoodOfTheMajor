import { PrismaClient } from '../../generated/prisma/client';
import { UserSearchCriteria } from '../interface/userSearchCriteria.interface';
import { UserCreateCriteria } from '../interface/userCreateCriteria.interface';

const prisma = new PrismaClient();


export const userRepository = {

    async CreateUser(data: UserCreateCriteria) {
        return await prisma.user.create({
            data: data
        });
    },

    async SearchByCriteria(filter: UserSearchCriteria) {

        const whereClause: any = {};

        if (filter.id) {
            whereClause.id = filter.id;
        }

        if (filter.email) {
            whereClause.email = filter.email;
        }

        if (filter.isAdmin !== undefined) {
            whereClause.isAdmin = filter.isAdmin;
        }

        if (filter.profileId) {
            whereClause.profileId = filter.profileId;
        }

        return await prisma.user.findMany({
            where: whereClause
        });
    },

};