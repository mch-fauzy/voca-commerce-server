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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class ProductValidator {
}
exports.ProductValidator = ProductValidator;
_a = ProductValidator;
// Create product section
ProductValidator.createRequestValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null).optional(),
    price: joi_1.default.number().min(0).required(),
    available: joi_1.default.boolean().required(),
    userId: joi_1.default.string().required()
});
ProductValidator.validateCreate = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.createRequestValidator.validateAsync(req);
});
// Update product by id section
ProductValidator.updateByIdRequestValidator = joi_1.default.object({
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().allow(null).optional(),
    price: joi_1.default.number().min(0).optional(),
    available: joi_1.default.boolean().optional(),
    id: joi_1.default.number().required(),
    userId: joi_1.default.string().required()
}).or('name', 'description', 'price', 'available'); // At least one field from following must be present
ProductValidator.validateUpdateById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.updateByIdRequestValidator.validateAsync(req);
});
// Delete product by id section
ProductValidator.deleteByIdRequestValidator = joi_1.default.object({
    id: joi_1.default.number().required(),
    userId: joi_1.default.string().required()
});
ProductValidator.validateDeleteById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.deleteByIdRequestValidator.validateAsync(req);
});
// Soft delete product by id section
ProductValidator.softDeleteByIdRequestValidator = joi_1.default.object({
    id: joi_1.default.number().required(),
    userId: joi_1.default.string().required()
});
ProductValidator.validateSoftDeleteById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.softDeleteByIdRequestValidator.validateAsync(req);
});
// Restore product by id section
ProductValidator.restoreByIdRequestValidator = joi_1.default.object({
    id: joi_1.default.number().required()
});
ProductValidator.validateRestoreById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.restoreByIdRequestValidator.validateAsync(req);
});
// Get product by id section
ProductValidator.getByIdRequestValidator = joi_1.default.object({
    id: joi_1.default.number().required()
});
ProductValidator.validateGetById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.getByIdRequestValidator.validateAsync(req);
});
// Get product by filter section
ProductValidator.getListByFilterRequestValidator = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    pageSize: joi_1.default.number().min(1).optional(),
    sort: joi_1.default.string().valid('id', 'createdAt', 'updatedAt', 'price').optional(),
    order: joi_1.default.string().valid('asc', 'desc').optional(),
    name: joi_1.default.string().optional()
});
ProductValidator.validateGetListByFilter = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.getListByFilterRequestValidator.validateAsync(req);
});
