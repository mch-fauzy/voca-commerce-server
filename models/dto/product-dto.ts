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

interface MarkProductAsDeletedRequest {
    id: number;
    email: string;
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
}

export { CreateProductRequest, UpdateProductRequest, DeleteProductRequest, MarkProductAsDeletedRequest, ProductValidator };
