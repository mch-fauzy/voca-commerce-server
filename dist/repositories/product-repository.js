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
const custom_error_1 = require("../utils/custom-error");
class ProductRepository {
}
exports.ProductRepository = ProductRepository;
_a = ProductRepository;
ProductRepository.createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdData = yield prisma_client_1.prisma.voca_product.create({ data: data });
        return createdData;
    }
    catch (error) {
        winston_1.logger.error(`[createProduct] Error creating product: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create product');
    }
});
ProductRepository.getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = yield prisma_client_1.prisma.voca_product.findUnique({ where: { id: id } });
        return productData;
    }
    catch (error) {
        winston_1.logger.error(`[getProductById] Error retrieving product by id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to retrieve product by id');
    }
});
ProductRepository.getProductsByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific field
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => {
                return [field, true];
            }))
            : undefined;
        // Handle filter field (output: create a single object from list)
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => {
                return [field, { [operator]: value }];
            }))
            : undefined;
        // Handle pagination
        const skip = (pagination.page - 1) * pagination.pageSize;
        const take = pagination.pageSize;
        // Handle sort (output: list of object)
        const orderBy = sorts
            ? sorts.map(({ field, order }) => {
                if (!field)
                    return {};
                return {
                    [field]: order
                };
            })
            : undefined;
        const productsData = yield prisma_client_1.prisma.voca_product.findMany({
            select,
            where,
            skip,
            take,
            orderBy
        });
        return productsData;
    }
    catch (error) {
        winston_1.logger.error(`[getProductsByFilter] Error retrieving products by filter: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to retrieve products by filter');
    }
});
ProductRepository.isProductExistById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = yield prisma_client_1.prisma.voca_product.findUnique({
            where: { id: id },
            select: { id: true }
        });
        return productData ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[isProductExistById] Error checking product by id');
        throw custom_error_1.CustomError.internalServer('Failed to check product by id');
    }
});
ProductRepository.updateProductById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedData = yield prisma_client_1.prisma.voca_product.update({
            where: { id: id },
            data: data
        });
        return updatedData;
    }
    catch (error) {
        winston_1.logger.error(`[updateProductById] Error updating product by id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to update product by id');
    }
});
ProductRepository.deleteProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedData = yield prisma_client_1.prisma.voca_product.delete({ where: { id: id } });
        return deletedData;
    }
    catch (error) {
        winston_1.logger.error(`[deleteProductById] Error deleting product by id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to delete product by id');
    }
});
