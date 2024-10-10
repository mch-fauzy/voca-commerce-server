import { Router } from 'express';

import { ProductController } from '../../controllers/product-controller';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth-middleware';

const productRouterV1 = Router();

productRouterV1.post('/products', authenticateToken, authorizeAdmin, ProductController.createProduct);
productRouterV1.patch('/products/:id', authenticateToken, authorizeAdmin, ProductController.updateProductById);
productRouterV1.delete('/products/:id', authenticateToken, authorizeAdmin, ProductController.deleteProductById);
productRouterV1.patch('/products/:id/deleted', authenticateToken, authorizeAdmin, ProductController.markProductAsDeletedById);

export { productRouterV1 };
