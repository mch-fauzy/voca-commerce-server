import { sign } from 'jsonwebtoken';

import { TokenPayload } from '../models/dto/auth-dto';
import { CONFIG } from '../configs/config';
import { CONSTANTS } from './constants';

const generateToken = (payload: Pick<TokenPayload, 'email' | 'role'>) => {
    const token = sign(
        {
            email: payload.email,
            role: payload.role
        },
        String(CONFIG.APP.JWT_ACCESS_KEY),
        { expiresIn: CONSTANTS.JWT.EXPIRY });

    return token;
}

export { generateToken };
