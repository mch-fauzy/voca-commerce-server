import { redis } from '../configs/redis';

import { createHash } from 'crypto';

class RedisUtils {
    // Generate a hashed key
    static generateHashedKey = (keyIdentifier: string, data: string | object): string => {
        return `${keyIdentifier}:${createHash('md5').update(JSON.stringify(data)).digest('hex')}`;
    }

    // Retrieve cached data
    static getCache = async (key: string) => {
        const cacheData = await redis.get(key);
        return cacheData;
    }

    // Set cache
    static setCache = async (key: string, expiry: number, data: string) => {
        await redis.setex(
            key,
            expiry,
            data
        );
    }

    // Delete a single cache (used for operations like getProductById)
    static deleteCache = async (key: string) => {
        await redis.del(key);
    }


    /*  Used for operations related for complex key like getAllProducts, getProductsByFilter */
    // Track the cache in a Redis set for easy invalidation
    static addCacheToList = async (listKey: string, key: string) => {
        await redis.sadd(listKey, key);
    }

    // Delete all cache related to set
    static deleteCacheFromList = async (listKey: string) => {
        const keys = await redis.smembers(listKey);

        if (keys && keys.length > 0) {
            // Delete all cache related to set
            await redis.del(...keys);

            // Clear the tracking set/set
            await redis.del(listKey);
        }
    }
}

export { RedisUtils };
