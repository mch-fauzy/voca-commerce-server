import Redis from 'ioredis';
import { CONFIG } from './config';

const redis = new Redis(CONFIG.REDIS.URL as string);

export { redis };
