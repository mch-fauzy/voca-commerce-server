import Joi from "joi";
import { Request } from 'express';
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
    id: number;
}

interface SessionRequest extends Request {
    session?: TokenPayload
}

export { RegisterRequest, registerValidate, LoginRequest, loginValidate, TokenPayload, SessionRequest };
