import Redis from 'ioredis';

import { CONFIG } from './config';
import { logger } from './winston';

// ! is Non-null assertion operator
const redis = new Redis(CONFIG.REDIS.URL!, {
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
