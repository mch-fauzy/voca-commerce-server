import { logger } from '../configs/winston';
import { prisma } from '../configs/prisma-client';
import { redis } from '../configs/redis';

// Function to ping the database to init the connection
const initDbConnection = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        logger.info('Connected to database');
    } catch (error) {
        logger.error(`[initDbConnection] Error connecting to the database: ${error}`);
        process.exit(1); // Exit the application if the database connection fails
    }
};

// Function to init redis connection
const initRedisConnection = async () => {
    await redis.ping()
    logger.info('Connected to Redis');
};

export { initDbConnection, initRedisConnection };
