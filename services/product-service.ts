import { ProductRepository } from '../repositories/product-repository';
import { CreateProductRequest, UpdateProductRequest, DeleteProductRequest, MarkProductAsDeletedRequest } from '../models/dto/product-dto';
import { CustomError } from '../utils/custom-error';
import { PRODUCT_DB_FIELD } from '../models/product-model';
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

        return 'Success';
    }

    static deleteProductById = async (req: DeleteProductRequest) => {
        const isExist = await ProductRepository.isProductExistById(req.id);
        if (!isExist) throw CustomError.notFound('Product not found');

        await ProductRepository.deleteProductById(req.id);

        return 'Success';
    }

    static markProductAsDeletedById = async (req: MarkProductAsDeletedRequest) => {
        const data = await ProductRepository.getProductById(req.id);
        if (!data || data.deletedAt || data.deletedBy) throw CustomError.notFound('Product not found');

        await ProductRepository.updateProductById(req.id, {
            deletedAt: new Date(),
            deletedBy: req.email
        })

        // await ProductRepository.getFilteredProducts({
        //     filterFields: [
        //         {
        //             field: PRODUCT_DB_FIELD.deletedAt,
        //             operator: 'equals',
        //             value: null
        //         }
        //     ],
        //     pagination: {
        //         page: 1,
        //         pageSize: 10
        //     },
        //     sorts: [
        //         {
        //             field: PRODUCT_DB_FIELD.id,
        //             order: 'asc'
        //         }
        //     ]
        // })

        return 'Success';
    }
}

export { ProductService };
