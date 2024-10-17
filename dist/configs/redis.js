"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const winston_1 = require("./winston");
// ! is Non-null assertion operator
const redis = new ioredis_1.default(config_1.CONFIG.REDIS.URL, {
    maxRetriesPerRequest: 5
});
exports.redis = redis;
redis.on('error', (error) => {
    winston_1.logger.error(`[redis] An error occurred: ${error}`);
    process.exit(1);
});
