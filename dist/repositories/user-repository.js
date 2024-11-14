"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const failure_1 = require("../utils/failure");
class UserRepository {
}
exports.UserRepository = UserRepository;
_a = UserRepository;
UserRepository.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const primaryId = {
            id: data.id
        };
        const isUserAvailable = yield _a.existsById(primaryId);
        if (isUserAvailable)
            throw failure_1.Failure.conflict(`User with this id already exists`);
        yield prisma_client_1.prisma.voca_user.create({ data: data });
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[UserRepository.create] Error creating user: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create user');
    }
});
UserRepository.findManyAndCountByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific field (output: create a single object from array of array)
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]) // array of array
            )
            : undefined;
        // Handle filter field (output: create a single object from array of array)
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]) // array of array
            )
            : undefined;
        // Handle pagination
        const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
        const take = pagination ? pagination.pageSize : undefined;
        // Handle sort (output: array of object)
        const orderBy = sorts === null || sorts === void 0 ? void 0 : sorts.filter(sort => sort.field).map(({ field, order }) => ({ [field]: order }));
        const [users, totalUsers] = yield prisma_client_1.prisma.$transaction([
            prisma_client_1.prisma.voca_user.findMany({
                select,
                where,
                skip,
                take,
                orderBy
            }),
            prisma_client_1.prisma.voca_user.count({
                where
            })
        ]);
        return [users, totalUsers];
    }
    catch (error) {
        winston_1.logger.error(`[UserRepository.findManyAndCountByFilter] Error finding and counting users by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to find and count users by filter');
    }
});
UserRepository.countByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterFields } = filter;
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]))
            : undefined;
        const totalUsers = yield prisma_client_1.prisma.voca_user.count({
            where
        });
        return totalUsers;
    }
    catch (error) {
        winston_1.logger.error(`[UserRepository.countByFilter] Error counting users by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to count users by filter');
    }
});
// Exists is a verb, if you want to use "is", please use isAvailable or isPresent
UserRepository.existsById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_client_1.prisma.voca_user.findUnique({
            where: { id: primaryId.id },
            select: { id: true }
        });
        return user ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[UserRepository.existsById] Error determining user by id');
        throw failure_1.Failure.internalServer('Failed to determine user by id');
    }
});
