import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { authRouterV1 } from './v1/auth-route';
import swaggerDocument from '../swagger.json'
import { CONFIG } from '../configs/config';
import { productRouterV1 } from './v1/product-route';

const router = Router();
const SWAGGER_CSS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const routes = [
    {
        path: '/v1',
        route: authRouterV1,
    },
    {
        path: '/v1',
        route: productRouterV1,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

// API docs
const swaggerRoutes = [
    {
        path: '/',
        route: swaggerUi.serve,
        docs: swaggerUi.setup(swaggerDocument, {
            customCss:
                '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
            customCssUrl: SWAGGER_CSS_URL
        }),
    },
];

if (CONFIG.APP.DOCS === "enabled") {
    swaggerRoutes.forEach((route) => {
        router.use(route.path, route.route, route.docs);
    });
}

export { router };
