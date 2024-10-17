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
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const user_repository_1 = require("../repositories/user-repository");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const custom_error_1 = require("../utils/custom-error");
class AuthService {
    static register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield user_repository_1.UserRepository.isUserExistsByEmail(req.email);
            if (isUserExist)
                throw custom_error_1.CustomError.conflict('User already exists');
            const userId = (0, uuid_1.v4)();
            const hashedPassword = yield (0, password_1.hashPassword)(req.password);
            yield user_repository_1.UserRepository.createUser(Object.assign(Object.assign({}, req), { id: userId, password: hashedPassword, createdBy: req.email, updatedBy: req.email }));
            return { message: 'Success' };
        });
    }
    static login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.getUserCredentialsByEmail(req.email);
            if (!user)
                throw custom_error_1.CustomError.unauthorized('Invalid credentials');
            const isValidPassword = yield (0, password_1.comparePassword)(req.password, user.password);
            if (!isValidPassword)
                throw custom_error_1.CustomError.unauthorized('Invalid credentials');
            const token = (0, jwt_1.generateToken)({
                email: user.email,
                role: user.role,
            });
            return { data: token };
        });
    }
}
exports.AuthService = AuthService;
;
