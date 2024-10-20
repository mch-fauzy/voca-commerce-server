"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = require("../utils/custom-error");
const http_response_1 = require("../utils/http-response");
const winston_1 = require("../configs/winston");
// NextFunction must be included to make error handler middleware to work properly
const errorHandler = (error, req, res, next) => {
    // Handle custom errors
    if (error instanceof custom_error_1.CustomError && error.name === 'CustomError') {
        (0, http_response_1.responseWithMessage)(res, error.code, error.message);
        return;
    }
    // Handle validation errors for Joi validator
    if (error instanceof Error && error.name === 'ValidationError') {
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, error.message);
        return;
    }
    // Handle unexpected errors
    winston_1.logger.error(`[errorHandler] Middleware unexpected error: ${error}`);
    (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    next();
};
exports.errorHandler = errorHandler;
