import { prisma } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import { CreateProduct, UpdateProductAsDeleted, UpdateProduct } from '../models/product-model';
import { CustomError } from '../utils/custom-error';

class ProductRepository {
    static createProduct = async (data: CreateProduct) => {
        try {
            const result = await prisma.voca_product.create({ data: data });

            return result;
        } catch (error) {
            logger.error(`[createProduct] Error creating product: ${error}`);
            throw CustomError.internalServer('Failed to create product');
        }
    }

    static getProductById = async (id: number) => {
        try {
            const result = await prisma.voca_product.findUnique({ where: { id: id } });

            return result;
        } catch (error) {
            logger.error(`[getProductById] Error retrieving product by id: ${error}`);
            throw CustomError.internalServer('Failed to retrieve product by id');
        }
    }

    static getFilteredProducts = async (filter: Filter) => {
        try {
            const { filterFields, pagination, sorts } = filter;
            // const where: any = { data };
            // filterFields.forEach(({ field, operator, value }) => {
            //     where[field] = {
            //         [operator]: value
            //     };
            // });

            const where: { [key: string]: { [key: string]: string | number | boolean | null } } = {};
            filterFields.forEach(({ field, operator, value }) => {
                where[field] = {
                    [operator]: value
                };
            });

            // Handle pagination
            const skip = (pagination.page - 1) * pagination.pageSize;
            const take = pagination.pageSize;

            const orderBy = sorts.map(({ field, order }) => ({ [field]: order }));

            const result = await prisma.voca_product.findMany({
                where,
                skip,
                take,
                orderBy
            })

            return result;
        } catch (error) {
            logger.error(`[getProductsByFilter] Error retrieving filtered product(s): ${error}`);
            throw CustomError.internalServer('Failed to retrieve filtered product(s)');
        }
    }

    static getAllProducts = async () => {
        try {
            const result = await prisma.voca_product.findMany();

            return result;
        } catch (error) {
            logger.error(`[getAllProducts] Error retrieving products ${error}`);
            throw CustomError.internalServer('Failed to retrieve products');
        }
    }

    static isProductExistById = async (id: number) => {
        try {
            const result = await prisma.voca_product.findUnique({
                where: { id: id },
                select: { id: true }
            });

            return result ? true : false;
        } catch (error) {
            logger.error('[isProductExistById] Error checking product by id');
            throw CustomError.internalServer('Failed to check product by id');
        }
    }

    static updateProductById = async (id: number, data: UpdateProduct | UpdateProductAsDeleted) => {
        try {
            const result = await prisma.voca_product.update({
                where: { id: id },
                data: data
            });

            return result
        } catch (error) {
            logger.error(`[updateProductById] Error updating product by id: ${error}`);
            throw CustomError.internalServer('Failed to update product by id');
        }
    }

    static deleteProductById = async (id: number) => {
        try {
            const result = await prisma.voca_product.delete({ where: { id: id } });

            return result
        } catch (error) {
            logger.error(`[deleteProductById] Error deleting product by id: ${error}`);
            throw CustomError.internalServer('Failed to delete product by id');
        }
    }
}

export { ProductRepository };
