"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const failure_1 = require("../utils/failure");
class ProductRepository {
}
exports.ProductRepository = ProductRepository;
_a = ProductRepository;
ProductRepository.insertProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.voca_product.create({ data: data });
    }
    catch (error) {
        winston_1.logger.error(`[insertProduct] Repository error creating product: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create product');
    }
});
ProductRepository.updateProductById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.voca_product.update({
            where: { id: id },
            data: data
        });
    }
    catch (error) {
        winston_1.logger.error(`[updateProductById] Repository error updating product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update product by id');
    }
});
ProductRepository.deleteProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.voca_product.delete({ where: { id: id } });
    }
    catch (error) {
        winston_1.logger.error(`[deleteProductById] Repository error deleting product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to delete product by id');
    }
});
ProductRepository.findProductById = (id, fields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields } = fields !== null && fields !== void 0 ? fields : {};
        const isProductExistById = yield _a.isProductExistById(id);
        if (!isProductExistById)
            throw failure_1.Failure.notFound(`Product not found`);
        // Handle select specific field (output: create a single object from array of array)
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]) // array of array
            )
            : undefined;
        const product = yield prisma_client_1.prisma.voca_product.findUnique({
            where: { id: id },
            select
        });
        return product;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[getProductById] Repository error retrieving product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to retrieve product by id');
    }
});
ProductRepository.findProductsByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific field (output: create a single object from array of array)
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]) // array of array
            )
            : undefined;
        // Handle filter field (output: create a single object from array of array)
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]) // array of array
            )
            : undefined;
        // Handle pagination
        const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
        const take = pagination ? pagination.pageSize : undefined;
        // Handle sort (output: array of object)
        const orderBy = sorts === null || sorts === void 0 ? void 0 : sorts.filter(sort => sort.field).map(({ field, order }) => ({ [field]: order }));
        const [products, totalProducts] = yield prisma_client_1.prisma.$transaction([
            prisma_client_1.prisma.voca_product.findMany({
                select,
                where,
                skip,
                take,
                orderBy
            }),
            prisma_client_1.prisma.voca_product.count({
                where
            })
        ]);
        return {
            data: products,
            count: totalProducts
        };
    }
    catch (error) {
        winston_1.logger.error(`[getProductsByFilter] Repository error retrieving products by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to retrieve products by filter');
    }
});
// Exists is a verb, if you want to use "is", please use isAvailable or isPresent
ProductRepository.isProductExistById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma_client_1.prisma.voca_product.findUnique({
            where: { id: id },
            select: { id: true }
        });
        return product ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[isProductExistById] Repository error checking product by id');
        throw failure_1.Failure.internalServer('Failed to check product by id');
    }
});
