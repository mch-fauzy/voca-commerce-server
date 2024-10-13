import { ProductRepository } from '../repositories/product-repository';
import { CreateProductRequest, UpdateProductRequest, DeleteProductRequest, MarkProductAsDeletedRequest, GetProductByIdRequest, GetProductsByFilterRequest } from '../models/dto/product-dto';
import { CustomError } from '../utils/custom-error';
import { CONSTANTS } from '../utils/constants';
import { PRODUCT_DB_FIELD } from '../models/product-model';
import { RedisUtils } from '../utils/redis-cache';
// import { CreateProduct } from '../models/product-model';

class ProductService {
    static createProduct = async (req: CreateProductRequest) => {
        // Assign object explicitly to enforce strict type (Excess Property Checks)
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

        /*  Used for operations related for complex key like getAllProducts, getProductsByFilter */
        // Delete all cache related to set if new data created
        await RedisUtils.deleteCacheFromList(CONSTANTS.REDIS.PRODUCT_FILTER_LIST_KEY);

        return 'Success';
    }

    static updateProductById = async (req: UpdateProductRequest) => {
        const data = await ProductRepository.getProductById(req.id);
        if (!data || data.deletedAt || data.deletedBy) throw CustomError.notFound('Product not found');

        // Below will not trigger type error because Excess Property Checks not triggered when CreateProduct object assigned to a variable
        /*
        const request: CreateProduct = {
            name: req.name,
            description: req.description,
            price: req.price,
            available: req.available,
            createdBy: req.email, // extra property not desired for update
            updatedBy: req.email
        }

        await ProductRepository.updateProductById(req.id, request);
        */

        await ProductRepository.updateProductById(req.id,
            {
                name: req.name,
                description: req.description,
                price: req.price,
                available: req.available,
                updatedBy: req.email
            }
        );

        // delete the cache
        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`;
        await RedisUtils.deleteCache(productKey);
        await RedisUtils.deleteCacheFromList(CONSTANTS.REDIS.PRODUCT_FILTER_LIST_KEY)

        return 'Success';
    }

    static deleteProductById = async (req: DeleteProductRequest) => {
        const isExist = await ProductRepository.isProductExistById(req.id);
        if (!isExist) throw CustomError.notFound('Product not found');

        await ProductRepository.deleteProductById(req.id);

        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`;
        await RedisUtils.deleteCache(productKey);
        await RedisUtils.deleteCacheFromList(CONSTANTS.REDIS.PRODUCT_FILTER_LIST_KEY)

        return 'Success';
    }

    static markProductAsDeletedById = async (req: MarkProductAsDeletedRequest) => {
        const data = await ProductRepository.getProductById(req.id);
        if (!data || data.deletedAt || data.deletedBy) throw CustomError.notFound('Product not found');

        await ProductRepository.updateProductById(req.id,
            {
                deletedAt: new Date(),
                deletedBy: req.email
            }
        );

        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`;
        await RedisUtils.deleteCache(productKey);
        await RedisUtils.deleteCacheFromList(CONSTANTS.REDIS.PRODUCT_FILTER_LIST_KEY)

        return 'Success';
    }

    static getProductById = async (req: GetProductByIdRequest) => {
        // Get cache
        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}:${req.id}`; // Get unique key based on id
        const cacheData = await RedisUtils.getCache(productKey);
        if (cacheData) {
            return {
                data: JSON.parse(cacheData), // JSON.parse to converts a JavaScript Object Notation (JSON) string into an object
                metadata: {
                    isFromCache: true
                }
            };
        }

        const data = await ProductRepository.getProductById(req.id);
        if (!data || data.deletedAt || data.deletedBy) throw CustomError.notFound('Product not found');

        // Set cache
        await RedisUtils.setCache(
            productKey,
            CONSTANTS.REDIS.CACHE_EXPIRY,
            JSON.stringify(data) // JSON.stringify to converts a JavaScript value to a JavaScript Object Notation (JSON) string
        );

        return {
            data,
            metadata: {
                isFromCache: false
            }
        };
    }

    static getProductsByFilter = async (req: GetProductsByFilterRequest) => {
        const productKey = RedisUtils.generateHashedKey(CONSTANTS.REDIS.PRODUCT_KEY, req);
        const cacheData = await RedisUtils.getCache(productKey);
        if (cacheData) {
            return {
                data: JSON.parse(cacheData),
                metadata: {
                    isFromCache: true
                }
            };
        }

        // Can assign sorts and filterFields more than 1
        const data = await ProductRepository.getProductsByFilter({
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
        if (!data) throw CustomError.notFound('Product not found');

        await RedisUtils.setCache(
            productKey,
            CONSTANTS.REDIS.CACHE_EXPIRY,
            JSON.stringify(data)
        );
        /*  Used for operations related for complex key like getAllProducts, getProductsByFilter */
        await RedisUtils.addCacheToList(CONSTANTS.REDIS.PRODUCT_FILTER_LIST_KEY, productKey);

        return {
            data,
            metadata: {
                isFromCache: false
            }
        };
    }
}

export { ProductService };
