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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../services/auth-service");
const auth_dto_1 = require("../models/dto/auth-dto");
const constants_1 = require("../utils/constants");
const http_response_1 = require("../utils/http-response");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield auth_dto_1.AuthValidator.validateRegisterBody(req.body);
        const message = yield auth_service_1.AuthService.register({
            email: body.email,
            password: body.password,
            role: constants_1.CONSTANTS.ROLES.USER,
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, message);
    }
    catch (error) {
        // Pass the error to the error handler
        next(error);
    }
});
AuthController.registerAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield auth_dto_1.AuthValidator.validateRegisterBody(req.body);
        const message = yield auth_service_1.AuthService.register({
            email: body.email,
            password: body.password,
            role: constants_1.CONSTANTS.ROLES.ADMIN,
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, message);
    }
    catch (error) {
        next(error);
    }
});
AuthController.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield auth_dto_1.AuthValidator.validateLoginBody(req.body);
        const result = yield auth_service_1.AuthService.login({
            email: body.email,
            password: body.password
        });
        (0, http_response_1.responseWithData)(res, http_status_codes_1.StatusCodes.OK, result);
    }
    catch (error) {
        next(error);
    }
});
