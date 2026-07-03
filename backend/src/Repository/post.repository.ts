import { PrismaClient } from '@prisma/client';
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

        whereClause.DeletedAt = null;

        if (filter.id) {
            whereClause.id = filter.id;
        }
        if (filter.title) {
            whereClause.title = filter.title;
        }
        if (filter.content) {
            whereClause.content = filter.content;
        }
        if (filter.authorId) {
            whereClause.authorId = filter.authorId;
        }
        if (filter.mood) {
            whereClause.mood = filter.mood;
        }
        if (filter.isAnonymous !== undefined) {
            whereClause.isAnonymous = filter.isAnonymous;
        }
        
        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;

        return await prisma.post.findMany({
            where: whereClause,
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
                DeletedAt: new Date()
            }
        });
    }
}