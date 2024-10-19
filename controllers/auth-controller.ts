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
} from '../utils/http-response';

class AuthController {
    static registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = await AuthValidator.validateRegisterBody(req.body);
            const message = await AuthService.register({
                email: body.email,
                password: body.password,
                role: CONSTANTS.ROLES.USER,
            });

            responseWithMessage(res, StatusCodes.CREATED, message);
        } catch (error) {
            // Pass the error to the error handler
            next(error);
        }
    };

    static registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = await AuthValidator.validateRegisterBody(req.body);
            const message = await AuthService.register({
                email: body.email,
                password: body.password,
                role: CONSTANTS.ROLES.ADMIN,
            });

            responseWithMessage(res, StatusCodes.CREATED, message);
        } catch (error) {
            next(error);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = await AuthValidator.validateLoginBody(req.body);
            const result = await AuthService.login({
                email: body.email,
                password: body.password
            });

            responseWithData(res, StatusCodes.OK, result);
        } catch (error) {
            next(error);
        }
    };

}

export { AuthController };
