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
ProductRepository.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.voca_product.create({ data: data });
    }
    catch (error) {
        winston_1.logger.error(`[ProductRepository.create] Error creating product: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create product');
    }
});
ProductRepository.updateById = (primaryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isProductAvailable = yield _a.existById(primaryId);
        if (!isProductAvailable)
            throw failure_1.Failure.notFound(`Product not found`);
        yield prisma_client_1.prisma.voca_product.update({
            where: { id: primaryId.id },
            data: data
        });
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[ProductRepository.updateById] Error updating product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update product by id');
    }
});
ProductRepository.deleteById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isProductAvailable = yield _a.existById(primaryId);
        if (!isProductAvailable)
            throw failure_1.Failure.notFound(`Product not found`);
        yield prisma_client_1.prisma.voca_product.delete({ where: { id: primaryId.id } });
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[ProductRepository.deleteById] Error deleting product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to delete product by id');
    }
});
ProductRepository.findById = (primaryId, fields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields } = fields !== null && fields !== void 0 ? fields : {};
        // Handle select specific field (output: create a single object from array of array)
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]) // array of array
            )
            : undefined;
        const product = yield prisma_client_1.prisma.voca_product.findUnique({
            where: { id: primaryId.id },
            select
        });
        if (!product)
            throw failure_1.Failure.notFound(`Product not found`);
        return product;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[ProductRepository.findById] Error finding product by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to find product by id');
    }
});
ProductRepository.findManyAndCountByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]))
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
        return [products, totalProducts];
    }
    catch (error) {
        winston_1.logger.error(`[ProductRepository.findManyAndCountByFilter] Error finding and counting products by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to find and count products by filter');
    }
});
// Exists is a verb, if you want to use "is", please use isAvailable or isPresent
ProductRepository.existById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma_client_1.prisma.voca_product.findUnique({
            where: { id: primaryId.id },
            select: { id: true }
        });
        return product ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[ProductRepository.existById] Error determining product by id');
        throw failure_1.Failure.internalServer('Failed to determine product by id');
    }
});
