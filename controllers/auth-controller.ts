import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../services/auth-service';
import { AuthValidator } from '../models/dto/auth-dto';
import { CONSTANTS } from '../utils/constants';
import {
    responseWithData,
    responseWithMessage
} from '../utils/response';

class AuthController {
    static registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = await AuthValidator.validateRegisterBody(req.body);
            const response = await AuthService.register({
                email: body.email,
                password: body.password,
                role: CONSTANTS.ROLES.USER,
            });

            responseWithMessage(res, StatusCodes.CREATED, response);
        } catch (error) {
            // Pass the error to the error handler
            next(error);
        }
    };

    static registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = await AuthValidator.validateRegisterBody(req.body);
            const response = await AuthService.register({
                email: body.email,
                password: body.password,
                role: CONSTANTS.ROLES.ADMIN,
            });

            responseWithMessage(res, StatusCodes.CREATED, response);
        } catch (error) {
            next(error);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = await AuthValidator.validateLoginBody(req.body);
            const response = await AuthService.login({
                email: body.email,
                password: body.password
            });

            responseWithData(res, StatusCodes.OK, response);
        } catch (error) {
            next(error);
        }
    };

}

export { AuthController };
