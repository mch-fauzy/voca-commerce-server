import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { CONFIG } from '../configs/config';
import { CONSTANTS } from '../utils/constants';
import { TokenPayload } from '../models/dto/auth-dto';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Check if authHeader is exist and get the token only (Bearer <Token>)
    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing token' });
        return;
    }

    verify(token, String(CONFIG.APP.JWT_ACCESS_KEY), (error, decodedToken) => {
        if (error) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
            return;
        }

        // Set decoded token details to custom headers
        const decodedTokenPayload = decodedToken as TokenPayload;
        req.headers[CONSTANTS.HEADERS.EMAIL] = decodedTokenPayload.email;
        req.headers[CONSTANTS.HEADERS.ROLE] = decodedTokenPayload.role;
        req.headers[CONSTANTS.HEADERS.IAT] = String(decodedTokenPayload.iat);
        req.headers[CONSTANTS.HEADERS.EXP] = String(decodedTokenPayload.exp);

        next();
    });
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers[CONSTANTS.HEADERS.ROLE] !== CONSTANTS.ROLES.ADMIN) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Admin access only' });
        return;
    }

    next();
};

export { authenticateToken, authorizeAdmin };
