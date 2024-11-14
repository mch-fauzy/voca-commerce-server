import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Failure } from '../utils/failure';
import { responseWithMessage } from '../utils/response'
import { logger } from '../configs/winston';

// NextFunction must be included to make error handler middleware to work properly
const errorHandler = (error: Failure | Error, req: Request, res: Response, next: NextFunction) => {
    // Handle custom errors
    if (error instanceof Failure && error.name === 'Failure') {
        responseWithMessage(res, error.code, error.message);
        return;
    }

    // Handle validation errors for Joi validator
    if (error instanceof Error && error.name === 'ValidationError') {
        responseWithMessage(res, StatusCodes.BAD_REQUEST, error.message);
        return;
    }

    // Handle unexpected errors
    logger.error(`[errorHandler] Unexpected error: ${error}`);
    responseWithMessage(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    next();
};

export { errorHandler };
