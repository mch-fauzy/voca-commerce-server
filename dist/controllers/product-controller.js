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
const response_1 = require("../utils/response");
class ProductController {
}
exports.ProductController = ProductController;
_a = ProductController;
ProductController.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            available: req.body.available,
            userId: String(req.headers[constants_1.CONSTANTS.HEADERS.USERID])
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateCreate(request);
        const response = yield product_service_1.ProductService.create(validatedRequest);
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, response);
    }
    catch (error) {
        next(error);
    }
});
ProductController.updateById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            available: req.body.available,
            id: Number(req.params.id),
            userId: String(req.headers[constants_1.CONSTANTS.HEADERS.USERID])
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateUpdateById(request);
        const response = yield product_service_1.ProductService.updateById(validatedRequest);
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, response);
    }
    catch (error) {
        next(error);
    }
});
ProductController.deleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            id: Number(req.params.id),
            userId: String(req.headers[constants_1.CONSTANTS.HEADERS.USERID])
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateDeleteById(request);
        const response = yield product_service_1.ProductService.deleteById(validatedRequest);
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, response);
    }
    catch (error) {
        next(error);
    }
});
ProductController.softDeleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            id: Number(req.params.id),
            userId: String(req.headers[constants_1.CONSTANTS.HEADERS.USERID])
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateSoftDeleteById(request);
        const response = yield product_service_1.ProductService.softDeleteById(validatedRequest);
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, response);
    }
    catch (error) {
        next(error);
    }
});
ProductController.restoreById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            id: Number(req.params.id)
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateRestoreById(request);
        const response = yield product_service_1.ProductService.restoreById(validatedRequest);
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.OK, response);
    }
    catch (error) {
        next(error);
    }
});
ProductController.getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            id: Number(req.params.id)
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateGetById(request);
        const response = yield product_service_1.ProductService.getById(validatedRequest);
        (0, response_1.responseWithMetadata)(res, http_status_codes_1.StatusCodes.OK, response.data, response.metadata);
    }
    catch (error) {
        next(error);
    }
});
ProductController.getListByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            page: req.query.page ? Number(req.query.page) : constants_1.CONSTANTS.QUERY.DEFAULT_PAGE,
            pageSize: req.query.page_size ? Number(req.query.page_size) : constants_1.CONSTANTS.QUERY.DEFAULT_PAGESIZE,
            sort: req.query.sort ? String(req.query.sort) : undefined,
            order: req.query.order ? String(req.query.order) : constants_1.CONSTANTS.QUERY.DEFAULT_ORDER,
            name: req.query.name ? String(req.query.name) : undefined
        };
        const validatedRequest = yield product_dto_1.ProductValidator.validateGetListByFilter(request);
        const response = yield product_service_1.ProductService.getListByFilter(validatedRequest);
        (0, response_1.responseWithMetadata)(res, http_status_codes_1.StatusCodes.OK, response.data, response.metadata);
    }
    catch (error) {
        next(error);
    }
});
