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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const custom_error_1 = require("../utils/custom-error");
class UserRepository {
    static createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_client_1.prisma.voca_user.create({ data: userData });
                return result;
            }
            catch (error) {
                winston_1.logger.error(`[createUser] Error creating user: ${error}`);
                throw custom_error_1.CustomError.internalServer('Failed to create user');
            }
        });
    }
    ;
    // If not passing a complex object with multiple fields, there is no need for an interface
    static getUserCredentialsByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_client_1.prisma.voca_user.findUnique({
                    where: { email: email },
                    select: {
                        email: true,
                        password: true,
                        role: true
                    }
                });
                if (!result) {
                    throw custom_error_1.CustomError.notFound('User not found');
                }
                return result;
            }
            catch (error) {
                winston_1.logger.error(`[getUserCredentialsByEmail] Error retrieving user credentials by email: ${error}`);
                throw custom_error_1.CustomError.internalServer('Failed to retrieve user credentials by email');
            }
        });
    }
    ;
    static isUserExistsByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_client_1.prisma.voca_user.findUnique({
                    where: { email: email },
                    select: { id: true }
                });
                return result ? true : false;
            }
            catch (error) {
                winston_1.logger.error(`[isUserExistsByEmail] Error checking user by email: ${error}`);
                throw custom_error_1.CustomError.internalServer('Failed to check user by email');
            }
        });
    }
}
exports.UserRepository = UserRepository;
