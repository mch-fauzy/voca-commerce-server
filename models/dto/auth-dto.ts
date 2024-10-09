import Joi from "joi";
import { JwtPayload } from "jsonwebtoken";

import { Role } from "../user-model";

interface RegisterRequest {
    email: string;
    password: string;
    role: Role;
}

const registerValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

interface LoginRequest {
    email: string;
    password: string;
}

const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

interface TokenPayload extends JwtPayload {
    email: string;
    role: Role;
}

export { RegisterRequest, registerValidate, LoginRequest, loginValidate, TokenPayload };
