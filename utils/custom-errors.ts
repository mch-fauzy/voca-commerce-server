import { StatusCodes } from 'http-status-codes';

class CustomError extends Error {
    // Custom properties
    code: number;
    customError: boolean;

    constructor(message: string, code: number) {
        super(message); // Call the constructor of its parent class to access the parent's properties and methods
        this.code = code;
        this.customError = true;

        // Showing only the relevant function calls leading to the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }

    static notFound(message: string) {
        return new CustomError(message, StatusCodes.NOT_FOUND)
    }

    static unauthorized(message: string) {
        return new CustomError(message, StatusCodes.UNAUTHORIZED)
    }

    static internalServer(message: string) {
        return new CustomError(message, StatusCodes.INTERNAL_SERVER_ERROR)
    }

    static badRequest(message: string) {
        return new CustomError(message, StatusCodes.BAD_REQUEST)
    }

    static conflict(message: string) {
        return new CustomError(message, StatusCodes.CONFLICT)
    }
}

export { CustomError };
