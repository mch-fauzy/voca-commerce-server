import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../services/auth-service';
import {
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthValidator
} from '../models/dto/auth-dto';
import { CONSTANTS } from '../utils/constants';
import {
    responseWithData,
    responseWithMessage
} from '../utils/response';

class AuthController {
    static registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: AuthRegisterRequest = {
                email: req.body.email,
                password: req.body.password,
                role: CONSTANTS.ROLES.USER
            };
            const validatedRequest = await AuthValidator.validateRegister(request);
            const response = await AuthService.register(validatedRequest);

            responseWithMessage(res, StatusCodes.CREATED, response);
        } catch (error) {
            // Pass the error to the error handler
            next(error);
        }
    };

    static registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: AuthRegisterRequest = {
                email: req.body.email,
                password: req.body.password,
                role: CONSTANTS.ROLES.ADMIN
            };
            const validatedRequest = await AuthValidator.validateRegister(request);
            const response = await AuthService.register(validatedRequest);

            responseWithMessage(res, StatusCodes.CREATED, response);
        } catch (error) {
            next(error);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: AuthLoginRequest = {
                email: req.body.email,
                password: req.body.password,
            };
            const validatedRequest = await AuthValidator.validateLogin(request);
            const response = await AuthService.login(validatedRequest);

            responseWithData(res, StatusCodes.OK, response);
        } catch (error) {
            next(error);
        }
    };

}

export { AuthController };
