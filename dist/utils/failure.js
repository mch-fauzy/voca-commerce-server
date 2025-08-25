"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Failure = void 0;
const http_status_codes_1 = require("http-status-codes");
class Failure extends Error {
    constructor(message, code) {
        super(message); // Call the constructor of its parent class to access the parent's properties and methods
        this.code = code;
        this.name = 'Failure';
        // Showing only the relevant function calls leading to the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Failure);
        }
    }
}
exports.Failure = Failure;
Failure.notFound = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.NOT_FOUND);
};
Failure.unauthorized = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
};
Failure.forbidden = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.FORBIDDEN);
};
Failure.internalServer = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
};
Failure.badRequest = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
};
Failure.conflict = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.CONFLICT);
};
