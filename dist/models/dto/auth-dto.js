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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const user_model_1 = require("../user-model");
class AuthValidator {
}
exports.AuthValidator = AuthValidator;
_a = AuthValidator;
// Register section
AuthValidator.registerRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid(user_model_1.Role).required()
});
AuthValidator.validateRegister = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.registerRequestValidator.validateAsync(req);
});
// Login section
AuthValidator.loginRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
AuthValidator.validateLogin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.loginRequestValidator.validateAsync(req);
});
