import Joi from "joi";
import { JwtPayload } from "jsonwebtoken";

import { Role } from "../user-model";

interface AuthBody {
    email: string;
    password: string;
}

interface RegisterRequest extends AuthBody {
    role: Role;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    tokenType: string;
    expiresIn: number;
}

interface TokenPayload extends JwtPayload {
    email: string;
    role: Role;
}

class AuthValidator {
    // Register section
    private static registerBodyValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    static validateRegisterBody = async (body: AuthBody): Promise<AuthBody> => {
        return await this.registerBodyValidator.validateAsync(body);
    }

    // Login section
    private static loginBodyValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    static validateLoginBody = async (body: AuthBody): Promise<AuthBody> => {
        return await this.loginBodyValidator.validateAsync(body);
    }
}

export {
    RegisterRequest,
    LoginRequest,
    TokenPayload,
    LoginResponse,
    AuthValidator
};
