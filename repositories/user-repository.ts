import { prisma } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import {
    CreateUser,
    User,
    UserPrimaryId
} from '../models/user-model';
import { Failure } from '../utils/failure';

class UserRepository {
    static create = async (data: CreateUser) => {
        try {
            const primaryId: UserPrimaryId = {
                id: data.id
            };

            const isUserAvailable = await this.existsById(primaryId);
            if (isUserAvailable) throw Failure.conflict(`User with this id already exists`);

            await prisma.voca_user.create({ data: data });
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[UserRepository.create] Error creating user: ${error}`);
            throw Failure.internalServer('Failed to create user');
        }
    };

    static findManyAndCountByFilter = async (filter: Filter): Promise<[User[], number]> => {
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

            return [users, totalUsers];
        } catch (error) {
            logger.error(`[UserRepository.findManyAndCountByFilter] Error finding and counting users by filter: ${error}`);
            throw Failure.internalServer('Failed to find and count users by filter');
        }
    };

    static countByFilter = async (filter: Pick<Filter, 'filterFields'>) => {
        try {
            const { filterFields } = filter;

            const where = filterFields
                ? Object.fromEntries(
                    filterFields.map(({ field, operator, value }) => [field, { [operator]: value }])
                )
                : undefined;

            const totalUsers = await prisma.voca_user.count({
                where
            });

            return totalUsers;
        } catch (error) {
            logger.error(`[UserRepository.countByFilter] Error counting users by filter: ${error}`);
            throw Failure.internalServer('Failed to count users by filter');
        }
    }

    // Exists is a verb, if you want to use "is", please use isAvailable or isPresent
    static existsById = async (primaryId: UserPrimaryId) => {
        try {
            const user = await prisma.voca_user.findUnique({
                where: { id: primaryId.id },
                select: { id: true }
            });

            return user ? true : false;
        } catch (error) {
            logger.error('[UserRepository.existsById] Error determining user by id');
            throw Failure.internalServer('Failed to determine user by id');
        }
    };
}

export { UserRepository };
