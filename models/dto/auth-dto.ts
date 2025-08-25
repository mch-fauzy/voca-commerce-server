import Joi from "joi";
import { JwtPayload } from "jsonwebtoken";

import { Role } from "../user-model";

interface AuthRequestBody {
    email: string;
    password: string;
}

interface AuthRegisterRequest extends AuthRequestBody {
    role: Role;
}

interface AuthLoginRequest extends AuthRequestBody { }

interface AuthLoginResponse {
    token: string;
    createdAt: string;
    expiresIn: number;
}

interface AuthTokenPayload extends JwtPayload {
    userId: string;
    email: string;
    role: Role;
}

class AuthValidator {
    // Register section
    private static registerRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid(Role).required()
    });

    static validateRegister = async (req: AuthRegisterRequest): Promise<AuthRegisterRequest> => {
        return await this.registerRequestValidator.validateAsync(req);
    };

    // Login section
    private static loginRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    static validateLogin = async (req: AuthLoginRequest): Promise<AuthLoginRequest> => {
        return await this.loginRequestValidator.validateAsync(req);
    };
}

export {
    AuthRegisterRequest,
    AuthLoginRequest,
    AuthTokenPayload,
    AuthLoginResponse,
    AuthValidator
};
