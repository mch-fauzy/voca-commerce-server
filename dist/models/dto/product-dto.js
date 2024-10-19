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
ProductValidator.createProductBodyValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional().allow(null),
    price: joi_1.default.number().min(0).required(),
    available: joi_1.default.boolean().required(),
});
ProductValidator.validateCreateProductBody = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.createProductBodyValidator.validateAsync(body);
});
// Update product section
ProductValidator.updateProductBodyValidator = joi_1.default.object({
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().optional().allow(null),
    price: joi_1.default.number().min(0).optional(),
    available: joi_1.default.boolean().optional(),
}).or('name', 'description', 'price', 'available'); // At least one field must be present
ProductValidator.validateUpdateProductBody = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.updateProductBodyValidator.validateAsync(body);
});
ProductValidator.getProductsByFilterQueryValidator = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    pageSize: joi_1.default.number().min(1).optional(),
    name: joi_1.default.string().optional(),
    sort: joi_1.default.string().optional().valid('id', 'createdAt', 'updatedAt', 'price'),
    order: joi_1.default.string().optional().valid('asc', 'desc')
});
ProductValidator.validateGetProductsByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.getProductsByFilterQueryValidator.validateAsync(query);
});
