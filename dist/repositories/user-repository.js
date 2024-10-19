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
        const userData = yield prisma_client_1.prisma.voca_user.create({ data: data });
        return userData;
    }
    catch (error) {
        winston_1.logger.error(`[createUser] Repository error creating user: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create user');
    }
});
// If not passing a complex object with multiple fields, there is no need for an interface
UserRepository.getUserByEmail = (email, fields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields } = fields !== null && fields !== void 0 ? fields : {};
        // Handle select specific field
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => {
                return [field, true];
            }))
            : undefined;
        const userData = yield prisma_client_1.prisma.voca_user.findUnique({
            where: { email: email },
            select
        });
        return userData;
    }
    catch (error) {
        winston_1.logger.error(`[getUserCredentialsByEmail] Repository error retrieving user by email: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to retrieve user by email');
    }
});
UserRepository.isUserExistByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield prisma_client_1.prisma.voca_user.findUnique({
            where: { email: email },
            select: { email: true }
        });
        return userData ? true : false;
    }
    catch (error) {
        winston_1.logger.error(`[isUserExistByEmail] Repository error checking user by email: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to check user by email');
    }
});
