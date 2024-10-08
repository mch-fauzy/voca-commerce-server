import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../services/auth-service';
import { LoginRequest, loginValidate, RegisterRequest, registerValidate } from '../models/dto/auth-dto';
import { CONSTANTS } from '../utils/constants';

class AuthController {
    static async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const body: RegisterRequest = await registerValidate.validateAsync(req.body);
            const result = await AuthService.register({
                ...body,
                role: CONSTANTS.ROLE.USER,
            });

            res.status(StatusCodes.CREATED).json(result);
        } catch (error) {
            // Pass the error to the error handler
            next(error);
        }
    };

    static async registerAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const body: RegisterRequest = await registerValidate.validateAsync(req.body);
            const result = await AuthService.register({
                ...body,
                role: CONSTANTS.ROLE.ADMIN,
            });

            res.status(StatusCodes.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    };

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const body: LoginRequest = await loginValidate.validateAsync(req.body);
            const result = await AuthService.login(body);

            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    };

}

export { AuthController };
