import { prisma } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import {
    CreateProduct,
    SoftDeleteProduct,
    UpdateProduct
} from '../models/product-model';
import { CustomError } from '../utils/custom-error';

class ProductRepository {
    static createProduct = async (data: CreateProduct) => {
        try {
            const createdProduct = await prisma.voca_product.create({ data: data });

            return createdProduct;
        } catch (error) {
            logger.error(`[createProduct] Repository error creating product: ${error}`);
            throw CustomError.internalServer('Failed to create product');
        }
    }

    static updateProductById = async (id: number, data: UpdateProduct | SoftDeleteProduct) => {
        try {
            const updatedProduct = await prisma.voca_product.update({
                where: { id: id },
                data: data
            });

            return updatedProduct;
        } catch (error) {
            logger.error(`[updateProductById] Repository error updating product by id: ${error}`);
            throw CustomError.internalServer('Failed to update product by id');
        }
    }

    static deleteProductById = async (id: number) => {
        try {
            const deletedProduct = await prisma.voca_product.delete({ where: { id: id } });

            return deletedProduct;
        } catch (error) {
            logger.error(`[deleteProductById] Repository error deleting product by id: ${error}`);
            throw CustomError.internalServer('Failed to delete product by id');
        }
    }

    static getProductById = async (id: number, fields?: Pick<Filter, 'selectFields'>) => {
        try {
            const { selectFields } = fields ?? {};

            // Handle select specific field
            const select = selectFields
                ? Object.fromEntries(
                    selectFields.map((field) => [field, true])
                )
                : undefined;

            const product = await prisma.voca_product.findUnique({
                where: { id: id },
                select
            });

            return product;
        } catch (error) {
            logger.error(`[getProductById] Repository error retrieving product by id: ${error}`);
            throw CustomError.internalServer('Failed to retrieve product by id');
        }
    }

    static getProductsByFilter = async (filter: Filter) => {
        try {
            const { selectFields, filterFields, pagination, sorts } = filter;

            // Handle select specific field
            const select = selectFields
                ? Object.fromEntries(
                    selectFields.map((field) => [field, true])
                )
                : undefined;

            // Handle filter field (output: create a single object from array)
            const where = filterFields
                ? Object.fromEntries(
                    filterFields.map(({ field, operator, value }) => [field, { [operator]: value }])
                )
                : undefined;

            // Handle pagination
            const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
            const take = pagination ? pagination.pageSize : undefined;

            // Handle sort (output: array of object)
            const orderBy = sorts?.filter(sort => sort.field) // filter out undefined or empty fields
                .map(({ field, order }) => ({ [field]: order }))

            const [products, totalProducts] = await prisma.$transaction([
                prisma.voca_product.findMany({
                    select,
                    where,
                    skip,
                    take,
                    orderBy
                }),
                prisma.voca_product.count({
                    where
                })
            ]);

            return {
                data: products,
                count: totalProducts
            };
        } catch (error) {
            logger.error(`[getProductsByFilter] Repository error retrieving products by filter: ${error}`);
            throw CustomError.internalServer('Failed to retrieve products by filter');
        }
    }

    static isProductExistById = async (id: number) => {
        try {
            const product = await prisma.voca_product.findUnique({
                where: { id: id },
                select: { id: true }
            });

            return product ? true : false;
        } catch (error) {
            logger.error('[isProductExistById] Repository error checking product by id');
            throw CustomError.internalServer('Failed to check product by id');
        }
    }
}

export { ProductRepository };
