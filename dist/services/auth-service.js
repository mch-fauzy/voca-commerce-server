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
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const user_repository_1 = require("../repositories/user-repository");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const custom_error_1 = require("../utils/custom-error");
const winston_1 = require("../configs/winston");
const user_model_1 = require("../models/user-model");
class AuthService {
}
exports.AuthService = AuthService;
_a = AuthService;
AuthService.register = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_repository_1.UserRepository.getUsersByFilter({
            selectFields: [
                user_model_1.USER_DB_FIELD.email
            ],
            filterFields: [
                {
                    field: user_model_1.USER_DB_FIELD.email,
                    operator: 'equals',
                    value: req.email
                }
            ]
        });
        if (users.count !== 0)
            throw custom_error_1.CustomError.conflict('Account with this email already exists');
        const userId = (0, uuid_1.v4)();
        const hashedPassword = yield (0, password_1.hashPassword)(req.password);
        yield user_repository_1.UserRepository.createUser({
            email: req.email,
            role: req.role,
            id: userId,
            password: hashedPassword,
            createdBy: req.email,
            updatedBy: req.email
        });
        return 'Success';
    }
    catch (error) {
        if (error instanceof custom_error_1.CustomError)
            throw error;
        winston_1.logger.error(`[register] Service error registering user: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to register user');
    }
});
AuthService.login = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_repository_1.UserRepository.getUsersByFilter({
            selectFields: [
                user_model_1.USER_DB_FIELD.email,
                user_model_1.USER_DB_FIELD.password,
                user_model_1.USER_DB_FIELD.role
            ],
            filterFields: [
                {
                    field: user_model_1.USER_DB_FIELD.email,
                    operator: 'equals',
                    value: req.email
                }
            ]
        });
        if (users.count === 0)
            throw custom_error_1.CustomError.unauthorized('Invalid credentials');
        const user = users.data[0];
        const isValidPassword = yield (0, password_1.comparePassword)(req.password, user.password);
        if (!isValidPassword)
            throw custom_error_1.CustomError.unauthorized('Invalid credentials');
        const response = (0, jwt_1.generateToken)({
            email: user.email,
            role: user.role
        });
        return response;
    }
    catch (error) {
        if (error instanceof custom_error_1.CustomError)
            throw error;
        winston_1.logger.error(`[login] Service error login user: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to login user');
    }
});
