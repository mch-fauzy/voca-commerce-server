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
exports.ProductController = void 0;
const http_status_codes_1 = require("http-status-codes");
const product_dto_1 = require("../models/dto/product-dto");
const product_service_1 = require("../services/product-service");
const constants_1 = require("../utils/constants");
const http_response_1 = require("../utils/http-response");
class ProductController {
}
exports.ProductController = ProductController;
_a = ProductController;
ProductController.createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = String(req.headers[constants_1.CONSTANTS.HEADERS.EMAIL]);
        const body = yield product_dto_1.ProductValidator.validateCreateProductBody(req.body);
        // Assign object explicitly to enforce strict type (Excess Property Checks)
        const message = yield product_service_1.ProductService.createProduct({
            email,
            name: body.name,
            description: body.description,
            price: body.price,
            available: body.available,
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, message);
    }
    catch (error) {
        next(error);
    }
});
ProductController.updateProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const email = String(req.headers[constants_1.CONSTANTS.HEADERS.EMAIL]);
        const body = yield product_dto_1.ProductValidator.validateUpdateProductBody(req.body);
        const message = yield product_service_1.ProductService.updateProductById({
            id: Number(id),
            email,
            name: body.name,
            description: body.description,
            price: body.price,
            available: body.available
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, message);
    }
    catch (error) {
        next(error);
    }
});
ProductController.deleteProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield product_service_1.ProductService.deleteProductById({
            id: Number(id)
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, message);
    }
    catch (error) {
        next(error);
    }
});
ProductController.softDeleteProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const email = String(req.headers[constants_1.CONSTANTS.HEADERS.EMAIL]);
        const message = yield product_service_1.ProductService.softDeleteProductById({
            id: Number(id),
            email,
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, message);
    }
    catch (error) {
        next(error);
    }
});
ProductController.restoreProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield product_service_1.ProductService.restoreProductById({
            id: Number(id)
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, message);
    }
    catch (error) {
        next(error);
    }
});
ProductController.getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield product_service_1.ProductService.getProductById({
            id: Number(id)
        });
        (0, http_response_1.responseWithMetadata)(res, http_status_codes_1.StatusCodes.OK, result.data, result.metadata);
    }
    catch (error) {
        next(error);
    }
});
ProductController.getProductsByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
        const query = yield product_dto_1.ProductValidator.validateGetProductsByFilterQuery(req.query);
        const result = yield product_service_1.ProductService.getProductsByFilter({
            name: query.name,
            sort: query.sort,
            order: (_b = query.order) !== null && _b !== void 0 ? _b : 'desc',
            page: (_c = query.page) !== null && _c !== void 0 ? _c : constants_1.CONSTANTS.PAGINATION.DEFAULT_PAGE, // if null or undefined then use default value
            pageSize: (_d = query.pageSize) !== null && _d !== void 0 ? _d : constants_1.CONSTANTS.PAGINATION.DEFAULT_PAGESIZE
        });
        (0, http_response_1.responseWithMetadata)(res, http_status_codes_1.StatusCodes.OK, result.data, result.metadata);
    }
    catch (error) {
        next(error);
    }
});
