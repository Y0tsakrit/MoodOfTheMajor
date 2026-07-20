import { PrismaClient } from '../../generated/prisma/client';
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
            whereClause.firstName = {
                contains: filter.firstName,
                mode: 'insensitive'
            };
        }

        if (filter.lastName) {
            whereClause.lastName = {
                contains: filter.lastName,
                mode: 'insensitive'
            };
        }

        if (filter.departmentId) {
            whereClause.departmentId = filter.departmentId;
        }

        if (filter.year) {
            whereClause.year = filter.year;
        }

        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;

        return await prisma.profile.findMany({
            where: whereClause,
            include: {
                Department: true
            },
            orderBy: {
                UpdatedAt: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        });
    },

    async UpdateProfile(id: string, data: ProfileUpdateCriteria) {
        const { departmentId, updatedAt, ...profileData } = data as any;

        const prismaData = {
            ...profileData,
            ...(departmentId ? {
                Department: {
                    connect: {
                        id: departmentId
                    }
                }
            } : {}),
            ...(updatedAt ? {
                UpdatedAt: updatedAt
            } : {}),
        };

        return await prisma.profile.update({
            where: {
                id: id
            },
            data: prismaData
        });
    },
};
