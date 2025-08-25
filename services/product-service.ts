import { ProductRepository } from '../repositories/product-repository';
import {
    ProductCreateRequest,
    ProductUpdateByIdRequest,
    ProductDeleteByIdRequest,
    ProductSoftDeleteByIdRequest,
    ProductGetByIdRequest,
    ProductGetListByFilterRequest,
    ProductResponse,
    ProductListResponse
} from '../models/dto/product-dto';
import { Failure } from '../utils/failure';
import { CONSTANTS } from '../utils/constants';
import {
    PRODUCT_DB_FIELD,
    ProductPrimaryId
} from '../models/product-model';
import { RedisUtils } from '../utils/redis-cache';
import { logger } from '../configs/winston';
import { calculatePaginationMetadata } from '../utils/calculate-pagination';
import { Filter } from '../models/filter';
// import { CreateProduct } from '../models/product-model';

class ProductService {
    static create = async (req: ProductCreateRequest) => {
        try {
            await Promise.all([
                ProductRepository.create({
                    name: req.name,
                    description: req.description,
                    price: req.price,
                    available: req.available,
                    createdBy: req.email,
                    updatedBy: req.email
                }),

                // Delete all cache related to set if new data created
                RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY)
            ]);

            return 'Success';
        } catch (error) {
            logger.error(`[ProductService.create] Error creating product: ${error}`);
            throw Failure.internalServer('Failed to create product');
        }
    };

    static updateById = async (req: ProductUpdateByIdRequest) => {
        try {
            const primaryId: ProductPrimaryId = { id: req.id };
            const product = await ProductRepository.findById(primaryId, {
                selectFields: [
                    PRODUCT_DB_FIELD.deletedAt,
                    PRODUCT_DB_FIELD.deletedBy
                ]
            });

            // Prevent updating if product is marked as deleted, unless it's being restored
            const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
            if (isProductMarkedAsDeleted) throw Failure.forbidden('Product marked as deleted and cannot be updated');

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
    
            await ProductRepository.updateById(primaryId, request);
            */

            await Promise.all([
                // Assign object explicitly to enforce strict type (Excess Property Checks), because excess property will updated in db
                ProductRepository.updateById(primaryId, {
                    name: req.name,
                    description: req.description,
                    price: req.price,
                    available: req.available,
                    updatedBy: req.email
                }),
                RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
                RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY),
            ]);

            return 'Success';
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductService.updateById] Error updating product by id: ${error}`);
            throw Failure.internalServer('Failed to update product by id');
        }
    };

    static softDeleteById = async (req: ProductSoftDeleteByIdRequest) => {
        try {
            const primaryId: ProductPrimaryId = { id: req.id };
            const product = await ProductRepository.findById(primaryId, {
                selectFields: [
                    PRODUCT_DB_FIELD.deletedAt,
                    PRODUCT_DB_FIELD.deletedBy
                ]
            });

            const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
            if (isProductMarkedAsDeleted) throw Failure.conflict('Product already marked as deleted');

            await Promise.all([
                ProductRepository.updateById(primaryId, {
                    deletedAt: new Date(),
                    deletedBy: req.email
                }),
                RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
                RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY),
            ]);

            return 'Success';
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductService.softDeleteById] Error soft deleting product by id: ${error}`);
            throw Failure.internalServer('Failed to soft delete product by id');
        }
    };

    static restoreById = async (req: Pick<ProductSoftDeleteByIdRequest, 'id'>) => {
        try {
            const primaryId: ProductPrimaryId = { id: req.id };
            const product = await ProductRepository.findById(primaryId, {
                selectFields: [
                    PRODUCT_DB_FIELD.deletedAt,
                    PRODUCT_DB_FIELD.deletedBy
                ]
            });

            // Prevent restore if product not marked as deleted
            const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
            if (!isProductMarkedAsDeleted) throw Failure.conflict('Product not marked as deleted and cannot be restored');

            await Promise.all([
                ProductRepository.updateById(primaryId, {
                    deletedAt: null,
                    deletedBy: null
                }),
                RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
                RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY)
            ]);

            return 'Success';
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductService.restoreById] Error restoring product by id: ${error}`);
            throw Failure.internalServer('Failed to restore product by id');
        }
    };

    static deleteById = async (req: ProductDeleteByIdRequest) => {
        try {
            const primaryId: ProductPrimaryId = { id: req.id };
            const product = await ProductRepository.findById(primaryId, {
                selectFields: [
                    PRODUCT_DB_FIELD.deletedAt,
                    PRODUCT_DB_FIELD.deletedBy
                ]
            });

            const isProductMarkedAsDeleted = Boolean(product.deletedAt || product.deletedBy);
            if (!isProductMarkedAsDeleted) throw Failure.forbidden('Product not marked as deleted');

            // Operations are independent of each other, run concurrently
            await Promise.all([
                ProductRepository.deleteById(primaryId),
                RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`),
                RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY),
            ]);

            logger.warn(`[ProductService.deleteById] User with id ${req.userId} performed a delete action on product with id ${req.id}`)
            return 'Success';
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductService.deleteById] Error deleting product by id: ${error}`);
            throw Failure.internalServer('Failed to delete product by id');
        }
    };

    static getById = async (req: ProductGetByIdRequest): Promise<ProductResponse> => {
        try {
            // Get cache
            const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`; // Get unique key based on id
            const productCache = await RedisUtils.getCacheByKey(productKey);
            if (productCache) {
                const response: ProductResponse = JSON.parse(productCache); // JSON.parse to converts a JavaScript Object Notation (JSON) string into an object
                response.metadata.isFromCache = true;
                return response;
            };

            const primaryId: ProductPrimaryId = { id: req.id };
            const product = await ProductRepository.findById(primaryId);

            const response: ProductResponse = {
                data: product,
                metadata: {
                    isFromCache: false
                }
            };

            await RedisUtils.storeCacheWithExpiry(
                productKey,
                CONSTANTS.REDIS.CACHE_EXPIRY,
                JSON.stringify(response) // JSON.stringify to converts a JavaScript value to a JavaScript Object Notation (JSON) string
            );

            return response;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductService.getById] Error retrieving product by id: ${error}`);
            throw Failure.internalServer('Failed to retrieve product by id');
        }
    };

    static getListByFilter = async (req: ProductGetListByFilterRequest): Promise<ProductListResponse> => {
        try {
            const productKey = RedisUtils.generateHashedCacheKey(CONSTANTS.REDIS.PRODUCT_KEY, req);
            const productCache = await RedisUtils.getCacheByKey(productKey);
            if (productCache) {
                const response: ProductListResponse = JSON.parse(productCache);
                response.metadata.isFromCache = true;
                return response;
            }

            // Can assign sorts and filterFields more than 1
            const filter: Filter = {
                selectFields: [
                    PRODUCT_DB_FIELD.id,
                    PRODUCT_DB_FIELD.name,
                    PRODUCT_DB_FIELD.description,
                    PRODUCT_DB_FIELD.price,
                    PRODUCT_DB_FIELD.available,
                    PRODUCT_DB_FIELD.createdAt,
                    PRODUCT_DB_FIELD.updatedAt
                ],
                filterFields: [{
                    field: PRODUCT_DB_FIELD.deletedAt,
                    operator: 'equals',
                    value: null,
                }],
                pagination: {
                    page: req.page,
                    pageSize: req.pageSize
                },
            }

            if (req.name !== undefined) {
                filter.filterFields = filter.filterFields ?? []; // Ensure `filter.filterFields` is initialized
                filter.filterFields.push({
                    field: PRODUCT_DB_FIELD.name,
                    operator: 'contains',
                    value: req.name,
                });
            }

            if (req.sort !== undefined) {
                filter.sorts = filter.sorts ?? []; // Ensure `filter.sorts` is initialized
                filter.sorts.push({
                    field: req.sort,
                    order: req.order
                });
            }

            const [products, totalProducts] = await ProductRepository.findManyAndCountByFilter(filter);

            const pagination = calculatePaginationMetadata(totalProducts, req.page, req.pageSize);
            const response: ProductListResponse = {
                data: products,
                metadata: {
                    totalPages: pagination.totalPages,
                    currentPage: pagination.currentPage,
                    nextPage: pagination.nextPage,
                    previousPage: pagination.previousPage,
                    isFromCache: false
                }
            };

            await Promise.all([
                RedisUtils.storeCacheWithExpiry(
                    productKey,
                    CONSTANTS.REDIS.CACHE_EXPIRY,
                    JSON.stringify(response)
                ),
                RedisUtils.addCacheToSet(CONSTANTS.REDIS.PRODUCT_SET_KEY, productKey)
            ]);

            return response;
        } catch (error) {
            logger.error(`[ProductService.getByFilter] Error retrieving products by filter: ${error}`);
            throw Failure.internalServer('Failed to retrieve products by filter');
        }
    };
}

export { ProductService };
