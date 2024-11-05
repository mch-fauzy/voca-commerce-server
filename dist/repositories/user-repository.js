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
const custom_error_1 = require("../utils/custom-error");
class UserRepository {
}
exports.UserRepository = UserRepository;
_a = UserRepository;
UserRepository.createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdUser = yield prisma_client_1.prisma.voca_user.create({ data: data });
        return createdUser;
    }
    catch (error) {
        winston_1.logger.error(`[createUser] Repository error creating user: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create user');
    }
});
UserRepository.getUsersByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific field
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]))
            : undefined;
        // Handle filter field (output: create a single object from array)
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]))
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
        return {
            data: users,
            count: totalUsers
        };
    }
    catch (error) {
        winston_1.logger.error(`[getUsersByFilter] Repository error retrieving users by filter: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to retrieve users by filter');
    }
});
