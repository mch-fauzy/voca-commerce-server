import express from 'express';
import { CONFIG } from './configs/config';
import { checkDbConnection } from './utils/connection-check';
import { logger } from './configs/winston';
import http from 'http';

// Define a custom error type to include the 'code' property
interface ServerError extends Error {
    code?: string;
}

const PORT = CONFIG.SERVER.PORT;
const app = express();
app.use(express.json());

checkDbConnection()
    .then(() => {
        // Create an HTTP server instance from the Express app
        const server = http.createServer(app);

        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

        // Handle startup errors
        server.on('error', (error: ServerError) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`[server] Port ${PORT} is already in use. Please choose a different port.`);
            } else {
                logger.error(`[server] An error occurred while starting the server: ${error.message}`);
            }
            process.exit(1);
        });
    });
