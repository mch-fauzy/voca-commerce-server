"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../configs/config");
const constants_1 = require("./constants");
const generateToken = (payload) => {
    const token = (0, jsonwebtoken_1.sign)({
        email: payload.email,
        role: payload.role
    }, String(config_1.CONFIG.APP.JWT_ACCESS_KEY), { expiresIn: constants_1.CONSTANTS.JWT.EXPIRY });
    return token;
};
exports.generateToken = generateToken;
