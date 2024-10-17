import { ProductRepository } from '../repositories/product-repository';
import {
    CreateProductRequest,
    UpdateProductRequest,
    DeleteProductRequest,
    SoftDeleteProductRequest,
    GetProductByIdRequest,
    GetProductsByFilterRequest
} from '../models/dto/product-dto';
import { CustomError } from '../utils/custom-error';
import { CONSTANTS } from '../utils/constants';
import { PRODUCT_DB_FIELD } from '../models/product-model';
import { RedisUtils } from '../utils/redis-cache';
import { logger } from '../configs/winston';
// import { CreateProduct } from '../models/product-model';

class ProductService {
    static createProduct = async (req: CreateProductRequest) => {
        try {
            await ProductRepository.createProduct(
                {
                    name: req.name,
                    description: req.description,
                    price: req.price,
                    available: req.available,
                    createdBy: req.email,
                    updatedBy: req.email
                }
            );

            // Delete all cache related to set if new data created
            await RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY);

            return 'Success';
        } catch (error) {
            logger.error(`[createProduct] Service error creating product: ${error}`);
            throw CustomError.internalServer('Service failed to create product');
        }
    }

    static updateProductById = async (req: UpdateProductRequest) => {
        try {
            const productData = await ProductRepository.getProductById(req.id);
            if (!productData) throw CustomError.notFound(`Product with id ${req.id} is not found`);

            // Prevent updating if product is marked as deleted, unless it's being restored
            const isProductMarkedAsDeleted = Boolean(productData.deletedAt || productData.deletedBy);
            if (isProductMarkedAsDeleted) throw CustomError.forbidden(`Product with id ${req.id} is marked as deleted and cannot be updated.`);

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

            // Assign object explicitly to enforce strict type (Excess Property Checks), because excess property will updated in db
            await ProductRepository.updateProductById(req.id,
                {
                    name: req.name,
                    description: req.description,
                    price: req.price,
                    available: req.available,
                    updatedBy: req.email
                }
            );

            await RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`);
            await RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY);

            return 'Success';
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[updateProductById] Service error updating product by id: ${error}`);
            throw CustomError.internalServer('Service failed to update product by id');
        }
    }

    static softDeleteProductById = async (req: SoftDeleteProductRequest) => {
        try {
            const productData = await ProductRepository.getProductById(req.id);
            if (!productData) throw CustomError.notFound(`Product with id ${req.id} is not found`);

            const isProductMarkedAsDeleted = Boolean(productData.deletedAt || productData.deletedBy);
            if (isProductMarkedAsDeleted) throw CustomError.conflict(`Product with id ${req.id} is already marked as deleted.`);

            await ProductRepository.updateProductById(req.id,
                {
                    deletedAt: new Date(),
                    deletedBy: req.email
                }
            );

            await RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`);
            await RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY);

            return 'Success';
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[softDeleteProductById] Service error soft deleting product by id: ${error}`);
            throw CustomError.internalServer('Service failed to soft delete product by id');
        }
    }

    static restoreProductById = async (req: Pick<SoftDeleteProductRequest, 'id'>) => {
        try {
            const productData = await ProductRepository.getProductById(req.id);
            if (!productData) throw CustomError.notFound(`Product with id ${req.id} is not found`);

            // Prevent restore if product not marked as deleted
            const isProductMarkedAsDeleted = Boolean(productData.deletedAt || productData.deletedBy);
            if (!isProductMarkedAsDeleted) throw CustomError.conflict(`Product with id ${req.id} cannot be restored because it is not marked as deleted`);

            await ProductRepository.updateProductById(req.id,
                {
                    deletedAt: null,
                    deletedBy: null
                }
            );

            await RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`);
            await RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY);

            return 'Success';
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[restoreProductById] Service error restoring product by id: ${error}`);
            throw CustomError.internalServer('Service failed to restore product by id');
        }
    }

    static deleteProductById = async (req: DeleteProductRequest) => {
        try {
            const productData = await ProductRepository.getProductById(req.id);
            if (!productData) throw CustomError.notFound(`Product with id ${req.id} is not found`);

            // Additional security to reduce accident caused by deletion
            const isProductMarkedAsDeleted = Boolean(productData.deletedAt || productData.deletedBy);
            if (!isProductMarkedAsDeleted) throw CustomError.forbidden(`Product with id ${req.id} is not marked as deleted`);

            await ProductRepository.deleteProductById(req.id);

            await RedisUtils.deleteCacheByKey(`${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`);
            await RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY);

            return 'Success';
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[deleteProductById] Service error deleting product by id: ${error}`);
            throw CustomError.internalServer('Service failed to delete product by id');
        }
    }

    static getProductById = async (req: GetProductByIdRequest) => {
        try {
            // Get cache
            const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`; // Get unique key based on id
            const cacheData = await RedisUtils.getCacheByKey(productKey);
            if (cacheData) {
                return {
                    data: JSON.parse(cacheData), // JSON.parse to converts a JavaScript Object Notation (JSON) string into an object
                    metadata: {
                        isFromCache: true
                    }
                };
            }

            const productData = await ProductRepository.getProductById(req.id);
            if (!productData) throw CustomError.notFound(`Product with id ${req.id} is not found`);

            await RedisUtils.storeCacheWithExpiry(
                productKey,
                CONSTANTS.REDIS.CACHE_EXPIRY,
                JSON.stringify(productData) // JSON.stringify to converts a JavaScript value to a JavaScript Object Notation (JSON) string
            );

            return {
                data: productData,
                metadata: {
                    isFromCache: false
                }
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[getProductById] Service error retrieving product by id: ${error}`);
            throw CustomError.internalServer('Service failed to retrieve product by id');
        }
    }

    static getProductsByFilter = async (req: GetProductsByFilterRequest) => {
        try {
            const productKey = RedisUtils.generateHashedCacheKey(CONSTANTS.REDIS.PRODUCT_KEY, req);
            const cacheData = await RedisUtils.getCacheByKey(productKey);
            if (cacheData) {
                return {
                    data: JSON.parse(cacheData),
                    metadata: {
                        isFromCache: true
                    }
                };
            }

            // Can assign sorts and filterFields more than 1
            const productsData = await ProductRepository.getProductsByFilter({
                selectFields: [
                    PRODUCT_DB_FIELD.id,
                    PRODUCT_DB_FIELD.name,
                    PRODUCT_DB_FIELD.description,
                    PRODUCT_DB_FIELD.price,
                    PRODUCT_DB_FIELD.available,
                    PRODUCT_DB_FIELD.createdAt,
                    PRODUCT_DB_FIELD.updatedAt
                ],
                filterFields: [
                    {
                        field: PRODUCT_DB_FIELD.deletedAt,
                        operator: 'equals',
                        value: null
                    },
                    {
                        field: PRODUCT_DB_FIELD.name,
                        operator: 'contains', // Case-sensitive
                        value: req.name
                    },
                ],
                pagination: {
                    page: req.page,
                    pageSize: req.pageSize
                },
                sorts: [
                    {
                        field: req.sort,
                        order: req.order
                    }
                ]
            });

            await RedisUtils.storeCacheWithExpiry(
                productKey,
                CONSTANTS.REDIS.CACHE_EXPIRY,
                JSON.stringify(productsData)
            );
            await RedisUtils.addCacheToSet(CONSTANTS.REDIS.PRODUCT_SET_KEY, productKey);

            return {
                data: productsData,
                metadata: {
                    isFromCache: false
                }
            };
        } catch (error) {
            logger.error(`[getProductsByFilter] Service error retrieving products by filter: ${error}`);
            throw CustomError.internalServer('Service failed to retrieve products by filter');
        }
    }
}

export { ProductService };
