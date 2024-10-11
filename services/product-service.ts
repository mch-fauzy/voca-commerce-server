import { ProductRepository } from '../repositories/product-repository';
import { CreateProductRequest, UpdateProductRequest, DeleteProductRequest, MarkProductAsDeletedRequest, GetProductByIdRequest } from '../models/dto/product-dto';
import { CustomError } from '../utils/custom-error';
import { CONSTANTS } from '../utils/constants';
import { redis } from '../configs/redis';
// import { CreateProduct } from '../models/product-model';

class ProductService {
    static createProduct = async (req: CreateProductRequest) => {
        // Assign object explicitly to enforce strict type (Excess Property Checks)
        await ProductRepository.createProduct({
            name: req.name,
            description: req.description,
            price: req.price,
            available: req.available,
            createdBy: req.email,
            updatedBy: req.email
        });

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

        await ProductRepository.updateProductById(req.id, {
            name: req.name,
            description: req.description,
            price: req.price,
            available: req.available,
            updatedBy: req.email
        });

        // Invalidate the cache
        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}${req.id}`;
        await redis.del(productKey);

        return 'Success';
    }

    static deleteProductById = async (req: DeleteProductRequest) => {
        const isExist = await ProductRepository.isProductExistById(req.id);
        if (!isExist) throw CustomError.notFound('Product not found');

        await ProductRepository.deleteProductById(req.id);

        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}${req.id}`;
        await redis.del(productKey);

        return 'Success';
    }

    static markProductAsDeletedById = async (req: MarkProductAsDeletedRequest) => {
        const data = await ProductRepository.getProductById(req.id);
        if (!data || data.deletedAt || data.deletedBy) throw CustomError.notFound('Product not found');

        await ProductRepository.updateProductById(req.id, {
            deletedAt: new Date(),
            deletedBy: req.email
        })

        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}${req.id}`;
        await redis.del(productKey);

        return 'Success';
    }

    static getProductById = async (req: GetProductByIdRequest) => {
        // Get cache
        const productKey = `${CONSTANTS.REDIS.PRODUCT_KEY}${req.id}`; // Get unique key based on id
        const cacheData = await redis.get(productKey);
        if (cacheData) {
            return JSON.parse(cacheData); // JSON.parse to converts a JavaScript Object Notation (JSON) string into an object
        }

        const data = await ProductRepository.getProductById(req.id);
        if (!data || data.deletedAt || data.deletedBy) throw CustomError.notFound('Product not found');

        // Set cache
        await redis.setex(
            productKey,
            CONSTANTS.REDIS.CACHE_EXPIRY,
            JSON.stringify(data)
        ) // JSON.stringify to converts a JavaScript value to a JavaScript Object Notation (JSON) string

        return data;
    }
}

export { ProductService };
