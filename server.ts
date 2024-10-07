import express, { json } from 'express';
import { createServer } from 'http';

import { CONFIG } from './configs/config';
import { checkDbConnection, checkRedisConnection } from './utils/connection-check';
import { logger } from './configs/winston';

const PORT = CONFIG.SERVER.PORT;
const app = express();
app.use(json());

// Wait for both database and Redis connection
Promise.all([checkDbConnection(), checkRedisConnection()])
    .then(() => {
        // Create an HTTP server instance from the Express app
        const server = createServer(app);

        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

        // Handle startup errors
        server.on('error', (error) => {
            logger.error(`[server] An error occurred while starting the server: ${error}`);
            process.exit(1);
        });
    });
