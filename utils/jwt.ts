import { sign } from 'jsonwebtoken';

import {
    AuthLoginResponse,
    AuthTokenPayload
} from '../models/dto/auth-dto';
import { CONFIG } from '../configs/config';
import { CONSTANTS } from './constants';

const generateToken = (req: Pick<AuthTokenPayload, 'userId' | 'email' | 'role'>): AuthLoginResponse => {
    const expireTime = CONSTANTS.JWT.EXPIRY;
    const token = sign(
        {
            userId: req.userId,
            email: req.email,
            role: req.role
        },
        CONFIG.APP.JWT_ACCESS_KEY!,
        { expiresIn: CONSTANTS.JWT.EXPIRY });

    return {
        token: token,
        createdAt: new Date().toISOString(),
        expiresIn: expireTime
    };
};

export { generateToken };
