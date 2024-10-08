import { prisma } from "../configs/prisma-client";
import { logger } from "../configs/winston";
import { CreateUser } from "../models/user-model";
import { CustomError } from "../utils/custom-errors";

class UserRepository {
    static async createUser(userData: CreateUser) {
        try {
            const result = await prisma.voca_user.create({ data: userData });

            return result;
        } catch (error) {
            logger.error(`[createUser] Error creating user: ${error}`);
            throw CustomError.internalServer('Failed to create user');
        }
    };

    // If not passing a complex object with multiple fields, there is no need for an interface
    static async getUserCredentialsByEmail(email: string) {
        try {
            const result = await prisma.voca_user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    password: true,
                    role: true
                }
            });
            if (!result) {
                throw CustomError.notFound('User not found');
            }

            return result;
        } catch (error) {
            logger.error(`[getUserCredentialsByEmail] Error retrieving user credentials by email: ${error}`)
            throw CustomError.internalServer('Failed to retrieve user credentials by email');
        }
    };

    static async isUserExistsByEmail(email: string) {
        try {
            const result = await prisma.voca_user.findUnique({
                where: { email: email },
                select: { id: true }
            });

            return result ? true : false;
        } catch (error) {
            logger.error(`[isUserExistsByEmail] Error checking user by email: ${error}`)
            throw CustomError.internalServer('Failed to check user existence');
        }
    }

}

export { UserRepository };
