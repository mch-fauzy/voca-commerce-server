import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { CONFIG } from '../configs/config';
import { CONSTANTS } from '../utils/constants';
import { TokenPayload } from '../models/dto/auth-dto';
import { responseWithMessage } from '../utils/http-response';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
    if (!token) {
        responseWithMessage(res, StatusCodes.UNAUTHORIZED, 'Missing token');
        return;
    }

    verify(token, CONFIG.APP.JWT_ACCESS_KEY!, (error, decodedToken) => {
        if (error || !decodedToken) {
            responseWithMessage(res, StatusCodes.UNAUTHORIZED, 'Invalid token');
            return;
        }

        const decodedTokenPayload = decodedToken as TokenPayload;

        // Check if userId, email, and role are present
        if (!decodedTokenPayload.userId || !decodedTokenPayload.email || !decodedTokenPayload.role) {
            responseWithMessage(res, StatusCodes.UNAUTHORIZED, 'Incomplete token payload');
            return;
        }

        // Set decoded token details to custom headers
        req.headers[CONSTANTS.HEADERS.USERID] = decodedTokenPayload.userId
        req.headers[CONSTANTS.HEADERS.EMAIL] = decodedTokenPayload.email;
        req.headers[CONSTANTS.HEADERS.ROLE] = decodedTokenPayload.role;
        req.headers[CONSTANTS.HEADERS.IAT] = String(decodedTokenPayload.iat);
        req.headers[CONSTANTS.HEADERS.EXP] = String(decodedTokenPayload.exp);

        next();
    });
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers[CONSTANTS.HEADERS.ROLE] !== CONSTANTS.ROLES.ADMIN) {
        responseWithMessage(res, StatusCodes.FORBIDDEN, 'Admin access only');
        return;
    }

    next();
};

export { authenticateToken, authorizeAdmin };
