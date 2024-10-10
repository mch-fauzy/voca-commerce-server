import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../utils/custom-error';
import { responseWithMessage } from '../utils/http-response';

// NextFunction must be included to make error handler middleware to work properly
const errorHandler = (error: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
    // Handle custom errors
    if (error instanceof CustomError && error.name === 'CustomError') {
        responseWithMessage(res, error.code, error.message);
        return;
    }

    // Handle validation errors for Joi validator
    if (error instanceof Error && error.name === 'ValidationError') {
        responseWithMessage(res, StatusCodes.BAD_REQUEST, error.message);
        return;
    }

    // Handle unexpected errors
    responseWithMessage(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');

};

export { errorHandler };
