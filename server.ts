import express, { json } from 'express';
import { createServer } from 'http';

import { CONFIG } from './configs/config';
import { initDbConnection, initRedisConnection } from './utils/connection-check';
import { logger } from './configs/winston';
import { errorHandler } from './middlewares/error-handler-middleware';
import { router } from './routes';

const PORT = CONFIG.SERVER.PORT;
const app = express();

app.use(json());
app.use('/', router);
// Register the error handling middleware
app.use(errorHandler);

// Wait for both database and Redis connection
Promise.all([initDbConnection(), initRedisConnection()])
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
