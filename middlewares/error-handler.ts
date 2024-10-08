import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../utils/custom-errors';
import { CONSTANTS } from '../utils/constants';

// NextFunction must be included to make error handler middleware to work properly
const errorHandler = (error: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
    // Handle custom errors
    if (error instanceof CustomError && error.name === 'CustomError') {
        res.status(error.code).json({ message: error.message });
        return;
    }

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        return;
    }

    // Handle unexpected errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.MESSAGE.UNEXPECTED_ERROR });

};

export { errorHandler };
