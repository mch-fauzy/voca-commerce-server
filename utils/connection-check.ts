import { logger } from '../configs/winston';
import { prisma } from '../configs/prisma-client';
import { CONFIG } from '../configs/config';

// Function to ping the database to check the connection
const checkDbConnection = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        logger.info(`Connected to ${CONFIG.POSTGRES.DB_URL}`);
    } catch (error) {
        logger.error('[checkConnection] Failed connecting to the database:', error);
        process.exit(1); // Exit the application if the database connection fails
    }
};

export { checkDbConnection };
