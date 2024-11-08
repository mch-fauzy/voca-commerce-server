import { StatusCodes } from 'http-status-codes';

class CustomError extends Error {
    // Custom properties
    code: number;

    constructor(message: string, code: number) {
        super(message); // Call the constructor of its parent class to access the parent's properties and methods
        this.code = code;
        this.name = 'CustomError';

        // Showing only the relevant function calls leading to the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }

    static notFound = (message: string) => {
        return new CustomError(message, StatusCodes.NOT_FOUND)
    };

    static unauthorized = (message: string) => {
        return new CustomError(message, StatusCodes.UNAUTHORIZED)
    };

    static forbidden = (message: string) => {
        return new CustomError(message, StatusCodes.FORBIDDEN)
    };

    static internalServer = (message: string) => {
        return new CustomError(message, StatusCodes.INTERNAL_SERVER_ERROR)
    };

    static badRequest = (message: string) => {
        return new CustomError(message, StatusCodes.BAD_REQUEST)
    };

    static conflict = (message: string) => {
        return new CustomError(message, StatusCodes.CONFLICT)
    };
}

export { CustomError };
