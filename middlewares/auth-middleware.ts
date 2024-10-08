import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { CONFIG } from '../configs/config';
import { CONSTANTS } from '../utils/constants';
import { SessionRequest, TokenPayload } from '../models/dto/auth-dto';

const authenticateToken = (req: SessionRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Check if authHeader is exist and get the token only (Bearer <Token>)
    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: CONSTANTS.MESSAGE.MISSING_TOKEN });
        return;
    }

    verify(token, String(CONFIG.APP.JWT_ACCESS_KEY), (error, decodedToken) => {
        if (error) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: CONSTANTS.MESSAGE.INVALID_TOKEN });
            return;
        }

        // Add decodedToken into http request
        req.session = decodedToken as TokenPayload
        next();
    });
};

const authorizeAdmin = (req: SessionRequest, res: Response, next: NextFunction) => {
    if (req.session?.role !== CONSTANTS.ROLE.ADMIN) {
        res.status(StatusCodes.FORBIDDEN).json({ message: CONSTANTS.MESSAGE.ADMIN_ONLY });
        return
    }
    next();
};

export { authenticateToken, authorizeAdmin };
