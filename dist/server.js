"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const http_1 = require("http");
const config_1 = require("./configs/config");
const connection_check_1 = require("./utils/connection-check");
const winston_1 = require("./configs/winston");
const error_handler_middleware_1 = require("./middlewares/error-handler-middleware");
const routes_1 = require("./routes");
const PORT = config_1.CONFIG.SERVER.PORT;
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use('/', routes_1.router);
// Register the error handling middleware
app.use(error_handler_middleware_1.errorHandler);
// Wait for both database and Redis connection
Promise.all([(0, connection_check_1.initDbConnection)(), (0, connection_check_1.initRedisConnection)()])
    .then(() => {
    // Create an HTTP server instance from the Express app
    const server = (0, http_1.createServer)(app);
    server.listen(PORT, () => {
        winston_1.logger.info(`Server is running on port ${PORT}`);
    });
    // Handle startup errors
    server.on('error', (error) => {
        winston_1.logger.error(`[server] An error occurred while starting the server: ${error}`);
        process.exit(1);
    });
});
