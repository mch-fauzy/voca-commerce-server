import { logger } from '../configs/winston';
import { prisma } from '../configs/prisma-client';
import { redis } from '../configs/redis';

// Function to ping the database to check the connection
const checkDbConnection = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        logger.info('Connected to database');
    } catch (error) {
        logger.error(`[checkDbConnection] Error connecting to the database: ${error}`);
        process.exit(1); // Exit the application if the database connection fails
    }
};

// Function to check redis connection
const checkRedisConnection = async () => {
    try {
        await redis.ping()
        logger.info('Connected to Redis');
    } catch (error) {
        logger.error(`[checkRedisConnection] Error connecting to Redis: ${error}`);
        process.exit(1);
    }
};

export { checkDbConnection, checkRedisConnection };
