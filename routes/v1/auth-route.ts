import { Router } from 'express';

import { AuthController } from '../../controllers/auth-controller';

const authRouterV1 = Router();

authRouterV1.post('/login', AuthController.login);
authRouterV1.post('/register', AuthController.registerUser);
authRouterV1.post('/admin/register', AuthController.registerAdmin);

export { authRouterV1 };
