import Joi from 'joi';

interface ProductRequestBody {
    name: string;
    description: string | null;
    price: number;
    available: boolean;
}

interface CreateProductRequest extends ProductRequestBody {
    email: string;
}

interface UpdateProductRequest extends ProductRequestBody {
    id: number;
    email: string;
}

interface DeleteProductRequest {
    id: number;
}

interface SoftDeleteProductRequest extends DeleteProductRequest {
    email: string;
}

interface GetProductByIdRequest {
    id: number;
}

interface GetProductsByFilterRequest {
    page: number;
    pageSize: number;
    name: string;
    sort: string;
    order: string;
}

class ProductValidator {
    // Create product section
    private static createProductBodyValidate = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().allow(null),
        price: Joi.number().min(0).required(),
        available: Joi.boolean().required(),
    })

    static validateCreateProductBody = async (body: ProductRequestBody): Promise<ProductRequestBody> => {
        return await this.createProductBodyValidate.validateAsync(body);
    }

    // Update product section
    private static updateProductBodyValidate = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional().allow(null),
        price: Joi.number().min(0).optional(),
        available: Joi.boolean().optional(),
    }).or('name', 'description', 'price', 'available') // At least one field must be present

    static validateUpdateProductBody = async (body: ProductRequestBody): Promise<ProductRequestBody> => {
        return await this.updateProductBodyValidate.validateAsync(body);
    }

    private static getProductsByFilterQueryValidate = Joi.object({
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).optional(),
        name: Joi.string().optional(),
        sort: Joi.string().optional().valid('id', 'createdAt', 'updatedAt', 'price'),
        order: Joi.string().optional().valid('asc', 'desc')
    })

    static validateGetProductsByFilterQuery = async (query: Partial<GetProductsByFilterRequest>): Promise<GetProductsByFilterRequest> => {
        return await this.getProductsByFilterQueryValidate.validateAsync(query);
    }
}

export {
    CreateProductRequest,
    UpdateProductRequest,
    DeleteProductRequest,
    SoftDeleteProductRequest,
    GetProductByIdRequest,
    GetProductsByFilterRequest,
    ProductValidator
};
