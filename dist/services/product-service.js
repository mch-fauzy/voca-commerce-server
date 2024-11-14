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
exports.ProductService = void 0;
const product_repository_1 = require("../repositories/product-repository");
const failure_1 = require("../utils/failure");
const constants_1 = require("../utils/constants");
const product_model_1 = require("../models/product-model");
const redis_cache_1 = require("../utils/redis-cache");
const winston_1 = require("../configs/winston");
const calculate_pagination_1 = require("../utils/calculate-pagination");
// import { CreateProduct } from '../models/product-model';
class ProductService {
}
exports.ProductService = ProductService;
_a = ProductService;
ProductService.createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all([
            product_repository_1.ProductRepository.insertProduct({
                name: req.name,
                description: req.description,
                price: req.price,
                available: req.available,
                createdBy: req.email,
                updatedBy: req.email
            }),
            // Delete all cache related to set if new data created
            redis_cache_1.RedisUtils.deleteCacheFromSet(constants_1.CONSTANTS.REDIS.PRODUCT_SET_KEY)
        ]);
        return 'Success';
    }
    catch (error) {
        winston_1.logger.error(`[createProduct] Service error creating product: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create product');
    }
});
ProductService.updateProductById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_repository_1.ProductRepository.findProductById(req.id);
        if (!product)
            throw failure_1.Failure.notFound('Product not found');
        // Prevent updating if product is marked as deleted, unless it's being restored
        const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
        if (isProductMarkedAsDeleted)
            throw failure_1.Failure.forbidden('Product marked as deleted and cannot be updated');
        /*
        // Below will not trigger type error because Excess Property Checks not triggered when CreateProduct object assigned to a variable
        const request: CreateProduct = {
            name: req.name,
            description: req.description,
            price: req.price,
            available: req.available,
            createdBy: "def", // extra property not desired for update
            updatedBy: req.email
        }

        await ProductRepository.updateProductById(req.id, request);
        */
        yield Promise.all([
            // Assign object explicitly to enforce strict type (Excess Property Checks), because excess property will updated in db
            product_repository_1.ProductRepository.updateProductById(req.id, {
                name: req.name,
                description: req.description,
                price: req.price,
                available: req.available,
                updatedBy: req.email
            }),
            redis_cache_1.RedisUtils.deleteCacheByKey(`${constants_1.CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
            redis_cache_1.RedisUtils.deleteCacheFromSet(constants_1.CONSTANTS.REDIS.PRODUCT_SET_KEY),
        ]);
        return 'Success';
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[updateProductById] Service error updating product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update product by id');
    }
});
ProductService.softDeleteProductById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_repository_1.ProductRepository.findProductById(req.id);
        if (!product)
            throw failure_1.Failure.notFound('Product not found');
        const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
        if (isProductMarkedAsDeleted)
            throw failure_1.Failure.conflict('Product already marked as deleted');
        yield Promise.all([
            product_repository_1.ProductRepository.updateProductById(req.id, {
                deletedAt: new Date(),
                deletedBy: req.email
            }),
            redis_cache_1.RedisUtils.deleteCacheByKey(`${constants_1.CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
            redis_cache_1.RedisUtils.deleteCacheFromSet(constants_1.CONSTANTS.REDIS.PRODUCT_SET_KEY),
        ]);
        return 'Success';
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[softDeleteProductById] Service error soft deleting product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to soft delete product by id');
    }
});
ProductService.restoreProductById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_repository_1.ProductRepository.findProductById(req.id);
        if (!product)
            throw failure_1.Failure.notFound('Product not found');
        // Prevent restore if product not marked as deleted
        const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
        if (!isProductMarkedAsDeleted)
            throw failure_1.Failure.conflict('Product not marked as deleted and cannot be restored');
        yield Promise.all([
            product_repository_1.ProductRepository.updateProductById(req.id, {
                deletedAt: null,
                deletedBy: null
            }),
            redis_cache_1.RedisUtils.deleteCacheByKey(`${constants_1.CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
            redis_cache_1.RedisUtils.deleteCacheFromSet(constants_1.CONSTANTS.REDIS.PRODUCT_SET_KEY)
        ]);
        return 'Success';
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[restoreProductById] Service error restoring product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to restore product by id');
    }
});
ProductService.deleteProductById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_repository_1.ProductRepository.findProductById(req.id);
        if (!product)
            throw failure_1.Failure.notFound('Product not found');
        // Additional security to reduce accident caused by deletion
        const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
        if (!isProductMarkedAsDeleted)
            throw failure_1.Failure.forbidden('Product not marked as deleted');
        // Operations are independent of each other, run concurrently
        yield Promise.all([
            product_repository_1.ProductRepository.deleteProductById(req.id),
            redis_cache_1.RedisUtils.deleteCacheByKey(`${constants_1.CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
            redis_cache_1.RedisUtils.deleteCacheFromSet(constants_1.CONSTANTS.REDIS.PRODUCT_SET_KEY),
        ]);
        winston_1.logger.warn(`[deleteProductById] Account with ${req.userId} performed a delete action on product with id ${req.id}`);
        return 'Success';
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[deleteProductById] Service error deleting product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to delete product by id');
    }
});
ProductService.getProductById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get cache
        const productKey = `${constants_1.CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`; // Get unique key based on id
        const productCache = yield redis_cache_1.RedisUtils.getCacheByKey(productKey);
        if (productCache) {
            if (productCache) {
                const productCacheResponse = JSON.parse(productCache); // JSON.parse to converts a JavaScript Object Notation (JSON) string into an object
                productCacheResponse.metadata.isFromCache = true;
                return productCacheResponse;
            }
            ;
        }
        const product = yield product_repository_1.ProductRepository.findProductById(req.id);
        if (!product)
            throw failure_1.Failure.notFound('Product not found');
        const response = {
            data: product,
            metadata: {
                isFromCache: false
            }
        };
        yield redis_cache_1.RedisUtils.storeCacheWithExpiry(productKey, constants_1.CONSTANTS.REDIS.CACHE_EXPIRY, JSON.stringify(response) // JSON.stringify to converts a JavaScript value to a JavaScript Object Notation (JSON) string
        );
        return response;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[getProductById] Service error retrieving product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to retrieve product by id');
    }
});
ProductService.getProductsByFilter = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productKey = redis_cache_1.RedisUtils.generateHashedCacheKey(constants_1.CONSTANTS.REDIS.PRODUCT_KEY, req);
        const productsCache = yield redis_cache_1.RedisUtils.getCacheByKey(productKey);
        if (productsCache) {
            const productsCacheResponse = JSON.parse(productsCache);
            productsCacheResponse.metadata.isFromCache = true;
            return productsCacheResponse;
        }
        // Can assign sorts and filterFields more than 1
        const products = yield product_repository_1.ProductRepository.findProductsByFilter({
            selectFields: [
                product_model_1.PRODUCT_DB_FIELD.id,
                product_model_1.PRODUCT_DB_FIELD.name,
                product_model_1.PRODUCT_DB_FIELD.description,
                product_model_1.PRODUCT_DB_FIELD.price,
                product_model_1.PRODUCT_DB_FIELD.available,
                product_model_1.PRODUCT_DB_FIELD.createdAt,
                product_model_1.PRODUCT_DB_FIELD.updatedAt
            ],
            filterFields: [
                {
                    field: product_model_1.PRODUCT_DB_FIELD.deletedAt,
                    operator: 'equals',
                    value: null
                },
                {
                    field: product_model_1.PRODUCT_DB_FIELD.name,
                    operator: 'contains', // Case-sensitive
                    value: req.name
                }
            ],
            pagination: {
                page: req.page,
                pageSize: req.pageSize
            },
            sorts: [{
                    field: req.sort,
                    order: req.order
                }]
        });
        const pagination = (0, calculate_pagination_1.calculatePaginationMetadata)(products.count, req.page, req.pageSize);
        const response = {
            data: products.data,
            metadata: {
                totalPages: pagination.totalPages,
                currentPage: pagination.currentPage,
                nextPage: pagination.nextPage,
                previousPage: pagination.previousPage,
                isFromCache: false
            }
        };
        yield Promise.all([
            redis_cache_1.RedisUtils.storeCacheWithExpiry(productKey, constants_1.CONSTANTS.REDIS.CACHE_EXPIRY, JSON.stringify(response)),
            redis_cache_1.RedisUtils.addCacheToSet(constants_1.CONSTANTS.REDIS.PRODUCT_SET_KEY, productKey)
        ]);
        return response;
    }
    catch (error) {
        winston_1.logger.error(`[getProductsByFilter] Service error retrieving products by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to retrieve products by filter');
    }
});
