import { prisma } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import {
    Product,
    ProductPrimaryId,
    CreateProduct,
    SoftDeleteProduct,
    UpdateProduct
} from '../models/product-model';
import { Failure } from '../utils/failure';

class ProductRepository {
    static create = async (data: CreateProduct) => {
        try {
            await prisma.voca_product.create({ data: data });
        } catch (error) {
            logger.error(`[ProductRepository.create] Error creating product: ${error}`);
            throw Failure.internalServer('Failed to create product');
        }
    };

    static updateById = async (primaryId: ProductPrimaryId, data: UpdateProduct | SoftDeleteProduct) => {
        try {
            const isProductAvailable = await this.existsById(primaryId);
            if (!isProductAvailable) throw Failure.notFound(`Product not found`);

            await prisma.voca_product.update({
                where: { id: primaryId.id },
                data: data
            });
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductRepository.updateById] Error updating product by id: ${error}`);
            throw Failure.internalServer('Failed to update product by id');
        }
    };

    static deleteById = async (primaryId: ProductPrimaryId) => {
        try {
            const isProductAvailable = await this.existsById(primaryId);
            if (!isProductAvailable) throw Failure.notFound(`Product not found`);

            await prisma.voca_product.delete({ where: { id: primaryId.id } });
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductRepository.deleteById] Error deleting product by id: ${error}`);
            throw Failure.internalServer('Failed to delete product by id');
        }
    };

    static findById = async (primaryId: ProductPrimaryId, fields?: Pick<Filter, 'selectFields'>): Promise<Product> => {
        try {
            const { selectFields } = fields ?? {};

            // Handle select specific field (output: create a single object from array of array)
            const select = selectFields
                ? Object.fromEntries(
                    selectFields.map((field) => [field, true]) // array of array
                )
                : undefined;

            const product = await prisma.voca_product.findUnique({
                where: { id: primaryId.id },
                select
            });
            if (!product) throw Failure.notFound(`Product not found`);

            return product;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[ProductRepository.findById] Error finding product by id: ${error}`);
            throw Failure.internalServer('Failed to find product by id');
        }
    };

    static findManyAndCountByFilter = async (filter: Filter): Promise<[Product[], number]> => {
        try {
            const { selectFields, filterFields, pagination, sorts } = filter;

            const select = selectFields
                ? Object.fromEntries(
                    selectFields.map((field) => [field, true])
                )
                : undefined;

            // Handle filter field (output: create a single object from array of array)
            const where = filterFields
                ? Object.fromEntries(
                    filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]) // array of array
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

            return [products, totalProducts];
        } catch (error) {
            logger.error(`[ProductRepository.findManyAndCountByFilter] Error finding and counting products by filter: ${error}`);
            throw Failure.internalServer('Failed to find and count products by filter');
        }
    };

    // Exists is a verb, if you want to use "is", please use isAvailable or isPresent
    static existsById = async (primaryId: ProductPrimaryId) => {
        try {
            const product = await prisma.voca_product.findUnique({
                where: { id: primaryId.id },
                select: { id: true }
            });

            return product ? true : false;
        } catch (error) {
            logger.error('[ProductRepository.existsById] Error determining product by id');
            throw Failure.internalServer('Failed to determine product by id');
        }
    };
}

export { ProductRepository };
