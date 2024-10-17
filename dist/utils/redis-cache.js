"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisUtils = void 0;
const redis_1 = require("../configs/redis");
const crypto_1 = require("crypto");
class RedisUtils {
}
exports.RedisUtils = RedisUtils;
_a = RedisUtils;
// Generate a hashed key
RedisUtils.generateHashedCacheKey = (keyIdentifier, data) => {
    return `${keyIdentifier}:${(0, crypto_1.createHash)('md5').update(JSON.stringify(data)).digest('hex')}`;
};
// Retrieve cached data
RedisUtils.getCacheByKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheData = yield redis_1.redis.get(key);
    return cacheData;
});
// Store the cache data
RedisUtils.storeCacheWithExpiry = (key, expiry, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_1.redis.setex(key, expiry, data);
});
// Delete a single cache (used for operations like getProductById)
RedisUtils.deleteCacheByKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_1.redis.del(key);
});
/* Used for operations related for complex key like getAllProducts, getProductsByFilter */
// Add the stored cache in a Redis set for easy invalidation (THIS IS NOT STORE THE CACHE DATA)
RedisUtils.addCacheToSet = (setKey, key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_1.redis.sadd(setKey, key);
});
// Delete all cache related to set
RedisUtils.deleteCacheFromSet = (setKey) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield redis_1.redis.smembers(setKey);
    if (keys && keys.length > 0) {
        return yield Promise.all([
            // Delete all cache related to set
            redis_1.redis.del(...keys),
            // Clear the tracking set/set
            redis_1.redis.del(setKey)
        ]);
    }
});
