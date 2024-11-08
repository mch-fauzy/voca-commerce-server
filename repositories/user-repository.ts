import { prisma } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import { CreateUser } from '../models/user-model';
import { CustomError } from '../utils/custom-error';

class UserRepository {
    static createUser = async (data: CreateUser) => {
        try {
            const createdUser = await prisma.voca_user.create({ data: data });

            return createdUser;
        } catch (error) {
            logger.error(`[createUser] Repository error creating user: ${error}`);
            throw CustomError.internalServer('Failed to create user');
        }
    };

    static getUsersByFilter = async (filter: Filter) => {
        try {
            const { selectFields, filterFields, pagination, sorts } = filter;

            // Handle select specific field (output: create a single object from array of array)
            const select = selectFields
                ? Object.fromEntries(
                    selectFields.map((field) => [field, true]) // array of array
                )
                : undefined;

            // Handle filter field (output: create a single object from array of array)
            const where = filterFields
                ? Object.fromEntries(
                    filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]) // array of array
                )
                : undefined;

            // Handle pagination
            const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
            const take = pagination ? pagination.pageSize : undefined;

            // Handle sort (output: array of object)
            const orderBy = sorts?.filter(sort => sort.field) // filter out undefined or empty fields
                .map(({ field, order }) => ({ [field]: order }))

            const [users, totalUsers] = await prisma.$transaction([
                prisma.voca_user.findMany({
                    select,
                    where,
                    skip,
                    take,
                    orderBy
                }),
                prisma.voca_user.count({
                    where
                })
            ]);

            return {
                data: users,
                count: totalUsers
            };
        } catch (error) {
            logger.error(`[getUsersByFilter] Repository error retrieving users by filter: ${error}`);
            throw CustomError.internalServer('Failed to retrieve users by filter');
        }
    };
}

export { UserRepository };
