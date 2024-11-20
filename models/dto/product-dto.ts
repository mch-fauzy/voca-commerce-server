import Joi from 'joi';

import {
    CacheMetadata,
    Metadata
} from './metadata';
import { Product } from '../product-model';

interface ProductRequestBody {
    name: string;
    description: string | null;
    price: number;
    available: boolean;
}

interface ProductCreateRequest extends ProductRequestBody {
    email: string;
}

interface ProductUpdateByIdRequest extends ProductRequestBody {
    id: number;
    email: string;
}

interface ProductDeleteByIdRequest {
    id: number;
    userId: string;
}

interface ProductSoftDeleteByIdRequest {
    id: number;
    email: string;
}

interface ProductGetByIdRequest {
    id: number;
}

interface ProductGetListByFilterRequest {
    page: number;
    pageSize: number;
    sort?: string;
    order: string;
    name?: string;
}

interface ProductResponse {
    data: Product;
    metadata: CacheMetadata;
}

interface ProductListResponse {
    data: Pick<Product, 'id' | 'name' | 'description' | 'price' | 'createdAt' | 'updatedAt'>[];
    metadata: Metadata;
}

class ProductValidator {
    // Create product section
    private static createRequestValidator = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null).optional(),
        price: Joi.number().min(0).required(),
        available: Joi.boolean().required(),
        email: Joi.string().email().required()
    });

    static validateCreate = async (req: ProductCreateRequest): Promise<ProductCreateRequest> => {
        return await this.createRequestValidator.validateAsync(req);
    };

    // Update product by id section
    private static updateByIdRequestValidator = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().allow(null).optional(),
        price: Joi.number().min(0).optional(),
        available: Joi.boolean().optional(),
        id: Joi.number().required(),
        email: Joi.string().email().required()
    }).or('name', 'description', 'price', 'available'); // At least one field from following must be present

    static validateUpdateById = async (req: ProductUpdateByIdRequest): Promise<ProductUpdateByIdRequest> => {
        return await this.updateByIdRequestValidator.validateAsync(req);
    };

    // Delete product by id section
    private static deleteByIdRequestValidator = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null).optional(),
        price: Joi.number().min(0).required(),
        available: Joi.boolean().required(),
        email: Joi.string().email().required()
    });

    static validateDeleteById = async (req: ProductDeleteByIdRequest): Promise<ProductDeleteByIdRequest> => {
        return await this.deleteByIdRequestValidator.validateAsync(req);
    };

    // Soft delete product by id section
    private static softDeleteByIdRequestValidator = Joi.object({
        id: Joi.number().required(),
        email: Joi.string().email().required()
    });

    static validateSoftDeleteById = async (req: ProductSoftDeleteByIdRequest): Promise<ProductSoftDeleteByIdRequest> => {
        return await this.softDeleteByIdRequestValidator.validateAsync(req);
    };

    // Restore product by id section
    private static restoreByIdRequestValidator = Joi.object({
        id: Joi.number().required()
    });

    static validateRestoreById = async (req: Pick<ProductSoftDeleteByIdRequest, 'id'>): Promise<Pick<ProductSoftDeleteByIdRequest, 'id'>> => {
        return await this.restoreByIdRequestValidator.validateAsync(req);
    };

    // Get product by id section
    private static getByIdRequestValidator = Joi.object({
        id: Joi.number().required()
    });

    static validateGetById = async (req: ProductGetByIdRequest): Promise<ProductGetByIdRequest> => {
        return await this.getByIdRequestValidator.validateAsync(req);
    };

    // Get product by filter section
    private static getListByFilterRequestValidator = Joi.object({
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).optional(),
        sort: Joi.string().valid('id', 'createdAt', 'updatedAt', 'price').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        name: Joi.string().optional()
    });

    static validateGetListByFilter = async (req: ProductGetListByFilterRequest): Promise<ProductGetListByFilterRequest> => {
        return await this.getListByFilterRequestValidator.validateAsync(req);
    };
}

export {
    ProductCreateRequest,
    ProductUpdateByIdRequest,
    ProductDeleteByIdRequest,
    ProductSoftDeleteByIdRequest,
    ProductGetByIdRequest,
    ProductResponse,
    ProductGetListByFilterRequest,
    ProductListResponse,
    ProductValidator
};
