"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const CONFIG = {
    SERVER: {
        PORT: process.env.SERVER_PORT,
        ENV: process.env.SERVER_ENV,
    },
    APP: {
        URL: process.env.APP_URL,
        DOCS: process.env.APP_DOCS,
        JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
    },
    DB: {
        URL: process.env.DATABASE_URL,
    },
    REDIS: {
        URL: process.env.REDIS_URL
    }
};
exports.CONFIG = CONFIG;
