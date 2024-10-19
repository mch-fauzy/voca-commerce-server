import { sign } from 'jsonwebtoken';

import { TokenPayload } from '../models/dto/auth-dto';
import { CONFIG } from '../configs/config';
import { CONSTANTS } from './constants';

const generateToken = (req: Pick<TokenPayload, 'email' | 'role'>, type: string = 'Bearer') => {
    const expireTime = CONSTANTS.JWT.EXPIRY;
    const token = sign(
        {
            email: req.email,
            role: req.role
        },
        CONFIG.APP.JWT_ACCESS_KEY!,
        { expiresIn: CONSTANTS.JWT.EXPIRY });

    return {
        token: token,
        tokenType: type,
        expiresIn: expireTime
    };
}

export { generateToken };
