"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const http_status_codes_1 = require("http-status-codes");
class CustomError extends Error {
    constructor(message, code) {
        super(message); // Call the constructor of its parent class to access the parent's properties and methods
        this.code = code;
        this.name = 'CustomError';
        // Showing only the relevant function calls leading to the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
}
exports.CustomError = CustomError;
CustomError.notFound = (message) => {
    return new CustomError(message, http_status_codes_1.StatusCodes.NOT_FOUND);
};
CustomError.unauthorized = (message) => {
    return new CustomError(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
};
CustomError.forbidden = (message) => {
    return new CustomError(message, http_status_codes_1.StatusCodes.FORBIDDEN);
};
CustomError.internalServer = (message) => {
    return new CustomError(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
};
CustomError.badRequest = (message) => {
    return new CustomError(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
};
CustomError.conflict = (message) => {
    return new CustomError(message, http_status_codes_1.StatusCodes.CONFLICT);
};
