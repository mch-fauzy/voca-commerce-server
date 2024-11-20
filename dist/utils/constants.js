"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
const user_model_1 = require("../models/user-model");
const CONSTANTS = {
    REDIS: {
        CACHE_EXPIRY: 60 * 60, // In seconds
        PRODUCT_KEY: 'product',
        PRODUCT_SET_KEY: 'product_set'
    },
    ROLES: {
        ADMIN: user_model_1.Role.ADMIN,
        USER: user_model_1.Role.USER
    },
    JWT: {
        EXPIRY: 60 * 60
    },
    HEADERS: {
        USERID: 'x-userid',
        EMAIL: 'x-email',
        ROLE: 'x-role',
        IAT: 'x-iat',
        EXP: 'x-exp'
    },
    QUERY: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGESIZE: 10,
        DEFAULT_ORDER: 'desc'
    },
    SERVER: {
        DEFAULT_PORT: 3000
    }
};
exports.CONSTANTS = CONSTANTS;
