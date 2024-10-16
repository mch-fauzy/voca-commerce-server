import { ProductRepository } from '../repositories/product-repository';
import {
    CreateProductRequest,
    UpdateProductRequest,
    DeleteProductRequest,
    MarkProductAsDeletedRequest,
    GetProductByIdRequest,
    GetProductsByFilterRequest
} from '../models/dto/product-dto';
import { CustomError } from '../utils/custom-error';
import { CONSTANTS } from '../utils/constants';
import {
    PRODUCT_DB_FIELD
} from '../models/product-model';
import { RedisUtils } from '../utils/redis-cache';
// import { CreateProduct } from '../models/product-model';

class ProductService {
    private static clearProductCacheByIdAndSet = async (id: number) => {
        const key = `${CONSTANTS.REDIS.PRODUCT_KEY}:${id}`;
        return await Promise.all([
            RedisUtils.deleteCacheByKey(key),
            RedisUtils.deleteCacheFromSet(CONSTANTS.REDIS.PRODUCT_SET_KEY)
        ]);
    }

    private static assertProductExistById = async (id: number) => {
        const productData = await ProductRepository.getProductById(id);
        if (!productData || productData.deletedAt || productData.deletedBy) throw CustomError.notFound(`Product not found with Id: ${id}`);
    }

    static createProduct = async (req: CreateProductRequest) => {
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
    }

    static updateProductById = async (req: UpdateProductRequest) => {
        await this.assertProductExistById(req.id);

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
        await this.clearProductCacheByIdAndSet(req.id)

        return 'Success';
    }

    static deleteProductById = async (req: DeleteProductRequest) => {
        await this.assertProductExistById(req.id);
        await ProductRepository.deleteProductById(req.id);
        await this.clearProductCacheByIdAndSet(req.id)

        return 'Success';
    }

    static markProductAsDeletedById = async (req: MarkProductAsDeletedRequest) => {
        await this.assertProductExistById(req.id)
        await ProductRepository.updateProductById(req.id,
            {
                deletedAt: new Date(),
                deletedBy: req.email
            }
        );
        await this.clearProductCacheByIdAndSet(req.id)

        return 'Success';
    }

    static getProductById = async (req: GetProductByIdRequest) => {
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

        const data = await ProductRepository.getProductById(req.id);
        if (!data) throw CustomError.notFound(`Product not found with Id: ${req.id}`);

        await RedisUtils.storeCacheWithExpiry(
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
        const data = await ProductRepository.getProductsByFilter({
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
            JSON.stringify(data)
        );
        await RedisUtils.addCacheToSet(CONSTANTS.REDIS.PRODUCT_SET_KEY, productKey);

        return {
            data,
            metadata: {
                isFromCache: false
            }
        };
    }
}

export { ProductService };
