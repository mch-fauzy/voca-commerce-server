"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouterV1 = void 0;
const express_1 = require("express");
const product_controller_1 = require("../../controllers/product-controller");
const auth_middleware_1 = require("../../middlewares/auth-middleware");
const productRouterV1 = (0, express_1.Router)();
exports.productRouterV1 = productRouterV1;
productRouterV1.post('/products', auth_middleware_1.authenticateToken, auth_middleware_1.authorizeAdmin, product_controller_1.ProductController.create);
productRouterV1.get('/products/:id', auth_middleware_1.authenticateToken, auth_middleware_1.authorizeAdmin, product_controller_1.ProductController.getById);
productRouterV1.delete('/products/:id', auth_middleware_1.authenticateToken, auth_middleware_1.authorizeAdmin, product_controller_1.ProductController.deleteById);
productRouterV1.patch('/products/:id', auth_middleware_1.authenticateToken, auth_middleware_1.authorizeAdmin, product_controller_1.ProductController.updateById);
productRouterV1.patch('/products/:id/soft-delete', auth_middleware_1.authenticateToken, auth_middleware_1.authorizeAdmin, product_controller_1.ProductController.softDeleteById);
productRouterV1.patch('/products/:id/restore', auth_middleware_1.authenticateToken, auth_middleware_1.authorizeAdmin, product_controller_1.ProductController.restoreById);
// If query parameters to complex, use body to query, e.g /products/search
productRouterV1.get('/products', auth_middleware_1.authenticateToken, product_controller_1.ProductController.getListByFilter);
