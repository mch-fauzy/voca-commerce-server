import { Router } from 'express';

import { ProductController } from '../../controllers/product-controller';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth-middleware';

const productRouterV1 = Router();

productRouterV1.post('/products', authenticateToken, authorizeAdmin, ProductController.createProduct);
productRouterV1.get('/products/:id', authenticateToken, authorizeAdmin, ProductController.getProductById);
productRouterV1.delete('/products/:id', authenticateToken, authorizeAdmin, ProductController.deleteProductById);
productRouterV1.patch('/products/:id', authenticateToken, authorizeAdmin, ProductController.updateProductById);
productRouterV1.patch('/products/:id/soft-delete', authenticateToken, authorizeAdmin, ProductController.softDeleteProductById);
productRouterV1.patch('/products/:id/restore', authenticateToken, authorizeAdmin, ProductController.restoreProductById);

productRouterV1.get('/products', authenticateToken, ProductController.getProductsByFilter);

export { productRouterV1 };
