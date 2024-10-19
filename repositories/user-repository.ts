import { prisma } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import { CreateUser } from '../models/user-model';
import { CustomError } from '../utils/custom-error';

class UserRepository {
    static createUser = async (data: CreateUser) => {
        try {
            const userData = await prisma.voca_user.create({ data: data });

            return userData;
        } catch (error) {
            logger.error(`[createUser] Repository error creating user: ${error}`);
            throw CustomError.internalServer('Failed to create user');
        }
    };

    // If not passing a complex object with multiple fields, there is no need for an interface
    static getUserByEmail = async (email: string, fields?: Pick<Filter, 'selectFields'>) => {
        try {
            const { selectFields } = fields ?? {};

            // Handle select specific field
            const select = selectFields
                ? Object.fromEntries(
                    selectFields.map((field) => {
                        return [field, true];
                    })
                )
                : undefined;

            const userData = await prisma.voca_user.findUnique({
                where: { email: email },
                select
            });

            return userData;
        } catch (error) {
            logger.error(`[getUserCredentialsByEmail] Repository error retrieving user by email: ${error}`)
            throw CustomError.internalServer('Failed to retrieve user by email');
        }
    };

    static isUserExistByEmail = async (email: string) => {
        try {
            const userData = await prisma.voca_user.findUnique({
                where: { email: email },
                select: { email: true }
            });

            return userData ? true : false;
        } catch (error) {
            logger.error(`[isUserExistByEmail] Repository error checking user by email: ${error}`)
            throw CustomError.internalServer('Failed to check user by email');
        }
    }

}

export { UserRepository };
