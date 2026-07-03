import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const postRepository = {
    async CreatePost(data: any) {
        return await prisma.post.create({
            data: data
        });
    },

    async SearchByCriteria(filter: any) {
        return await prisma.post.findMany({
            where: filter
        });
    },

    async UpdatePost(id: string, data: any) {
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