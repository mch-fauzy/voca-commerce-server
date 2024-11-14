"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../configs/config");
const constants_1 = require("../utils/constants");
const response_1 = require("../utils/response");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
    if (!token) {
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Missing token');
        return;
    }
    (0, jsonwebtoken_1.verify)(token, config_1.CONFIG.APP.JWT_ACCESS_KEY, (error, decodedToken) => {
        if (error || !decodedToken) {
            (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid token');
            return;
        }
        const decodedTokenPayload = decodedToken;
        // Check if userId, email, and role are present
        if (!decodedTokenPayload.userId || !decodedTokenPayload.email || !decodedTokenPayload.role) {
            (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Incomplete token payload');
            return;
        }
        // Set decoded token details to custom headers
        req.headers[constants_1.CONSTANTS.HEADERS.USERID] = decodedTokenPayload.userId;
        req.headers[constants_1.CONSTANTS.HEADERS.EMAIL] = decodedTokenPayload.email;
        req.headers[constants_1.CONSTANTS.HEADERS.ROLE] = decodedTokenPayload.role;
        req.headers[constants_1.CONSTANTS.HEADERS.IAT] = String(decodedTokenPayload.iat);
        req.headers[constants_1.CONSTANTS.HEADERS.EXP] = String(decodedTokenPayload.exp);
        next();
    });
};
exports.authenticateToken = authenticateToken;
const authorizeAdmin = (req, res, next) => {
    if (req.headers[constants_1.CONSTANTS.HEADERS.ROLE] !== constants_1.CONSTANTS.ROLES.ADMIN) {
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.FORBIDDEN, 'Admin access only');
        return;
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
