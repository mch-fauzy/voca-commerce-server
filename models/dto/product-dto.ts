import Joi from 'joi';

import { Metadata } from './metadata';

interface ProductRequestBody {
    name: string;
    description: string | null;
    price: number;
    available: boolean;
}

interface CreateProductRequest extends ProductRequestBody {
    email: string;
}

interface UpdateProductByIdRequest extends ProductRequestBody {
    id: number;
    email: string;
}

interface DeleteProductByIdRequest {
    id: number;
}

interface SoftDeleteProductByIdRequest extends DeleteProductByIdRequest {
    email: string;
}

interface GetProductByIdRequest {
    id: number;
}

interface GetProductByIdResponse {
    data: object;
    metadata: Pick<Metadata, 'isFromCache'>;
}

interface GetProductsByFilterRequest {
    page: number;
    pageSize: number;
    name: string;
    sort: string;
    order: string;
}

interface GetProductsByFilterResponse {
    data: object[];
    metadata: Metadata;
}

class ProductValidator {
    // Create product section
    private static createProductBodyValidator = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().allow(null),
        price: Joi.number().min(0).required(),
        available: Joi.boolean().required(),
    });

    static validateCreateProductBody = async (body: ProductRequestBody): Promise<ProductRequestBody> => {
        return await this.createProductBodyValidator.validateAsync(body);
    };

    // Update product section
    private static updateProductBodyValidator = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional().allow(null),
        price: Joi.number().min(0).optional(),
        available: Joi.boolean().optional(),
    }).or('name', 'description', 'price', 'available'); // At least one field must be present

    static validateUpdateProductBody = async (body: ProductRequestBody): Promise<ProductRequestBody> => {
        return await this.updateProductBodyValidator.validateAsync(body);
    };

    private static getProductsByFilterQueryValidator = Joi.object({
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).optional(),
        name: Joi.string().optional(),
        sort: Joi.string().optional().valid('id', 'createdAt', 'updatedAt', 'price'),
        order: Joi.string().optional().valid('asc', 'desc')
    });

    static validateGetProductsByFilterQuery = async (query: Partial<GetProductsByFilterRequest>): Promise<GetProductsByFilterRequest> => {
        return await this.getProductsByFilterQueryValidator.validateAsync(query);
    };
}

export {
    CreateProductRequest,
    UpdateProductByIdRequest,
    DeleteProductByIdRequest,
    SoftDeleteProductByIdRequest,
    GetProductByIdRequest,
    GetProductsByFilterRequest,
    GetProductByIdResponse,
    GetProductsByFilterResponse,
    ProductValidator
};
