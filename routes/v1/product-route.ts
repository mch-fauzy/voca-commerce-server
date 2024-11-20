import { Router } from 'express';

import { ProductController } from '../../controllers/product-controller';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth-middleware';

const productRouterV1 = Router();

productRouterV1.post('/products', authenticateToken, authorizeAdmin, ProductController.create);
productRouterV1.get('/products/:id', authenticateToken, authorizeAdmin, ProductController.getById);
productRouterV1.delete('/products/:id', authenticateToken, authorizeAdmin, ProductController.deleteById);
productRouterV1.patch('/products/:id', authenticateToken, authorizeAdmin, ProductController.updateById);
productRouterV1.patch('/products/:id/soft-delete', authenticateToken, authorizeAdmin, ProductController.softDeleteById);
productRouterV1.patch('/products/:id/restore', authenticateToken, authorizeAdmin, ProductController.restoreById);

// If query parameters to complex, use body to query, e.g /products/search
productRouterV1.get('/products', authenticateToken, ProductController.getListByFilter);

export { productRouterV1 };
