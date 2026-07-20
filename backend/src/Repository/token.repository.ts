import { PrismaClient } from '../../generated/prisma/client';
import { TokenCreateCriteria } from '../interface/tokenCreateCriteria.interface';


const prisma = new PrismaClient();


export const tokenRepository = {

    async CreateToken(data: TokenCreateCriteria) {
        return prisma.token.create({
            data: data
        });
    },

    async SearchByToken(token: string) {
        return prisma.token.findUnique({
            where: { token }
        });
    }
}