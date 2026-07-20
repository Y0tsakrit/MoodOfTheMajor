import { PrismaClient } from '../../generated/prisma/client';
import { PostCreateCriteria } from '../interface/postCreateCriteria.interface';
import { PostSearchCriteria } from '../interface/postSearchCriteria.interface';
import { PostUpdateCriteria } from '../interface/postUpdateCriteria.interface';

const prisma = new PrismaClient();


export const postRepository = {
    async CreatePost(data: PostCreateCriteria) {
        return await prisma.post.create({
            data: data
        });
    },

    async SearchByCriteria(filter: PostSearchCriteria) {

        const whereClause: any = {};

        whereClause.isDeleted = false;

        if (filter.id) {
            whereClause.id = filter.id;
        }
        if (filter.title) {
            whereClause.title = { 
                contains: filter.title,
                mode: 'insensitive'
            };
        }
        if (filter.content) {
            whereClause.content = { 
                contains: filter.content,
                mode: 'insensitive'
            };
        }
        if (filter.authorId) {
            whereClause.authorId = filter.authorId;
        }
        if (filter.mood) {
            whereClause.mood = { 
                contains: filter.mood,
                mode: 'insensitive' 
            };
        }
        if (filter.isAnonymous !== undefined) {
            whereClause.isAnonymous = filter.isAnonymous;
        }
        if (filter.fromDate || filter.toDate) {
            whereClause.CreatedAt = {};

            if (filter.fromDate) {
                whereClause.CreatedAt.gte = new Date(filter.fromDate);
            }

            if (filter.toDate) {
                whereClause.CreatedAt.lte = new Date(filter.toDate);
            }
        }

        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;

        return await prisma.post.findMany({
            where: whereClause,
            orderBy: {
                UpdatedAt: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        });
    },

    async UpdatePost(id: string, data: PostUpdateCriteria) {
        return await prisma.post.update({
            where: {
                id: id
            },
            data: data
        });
    },

    async DeletePost(id: string) {
        return await prisma.post.update({
            where: {
                id: id
            },
            data: {
                isDeleted: true,
                DeletedAt: new Date()
            }
        });
    }
}