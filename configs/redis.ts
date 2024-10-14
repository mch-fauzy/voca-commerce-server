import Redis from 'ioredis';

import { CONFIG } from './config';
import { logger } from './winston';

const redis = new Redis(CONFIG.REDIS.URL as string, {
    maxRetriesPerRequest: 5
});

redis.on('error', (error) => {
    logger.error(`[redis] An error occurred: ${error}`);
    process.exit(1);
});

// redis.on('connect', () => {
//     logger.info('Connected to Redis');
// });

export { redis };
