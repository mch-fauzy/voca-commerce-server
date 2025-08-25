"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_route_1 = require("./v1/auth-route");
const swagger_json_1 = __importDefault(require("../swagger.json"));
const config_1 = require("../configs/config");
const product_route_1 = require("./v1/product-route");
const router = (0, express_1.Router)();
exports.router = router;
const SWAGGER_CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const routes = [
    {
        path: '/v1',
        route: auth_route_1.authRouterV1,
    },
    {
        path: '/v1',
        route: product_route_1.productRouterV1,
    },
];
routes.forEach((route) => {
    router.use(route.path, route.route);
});
// API docs
const swaggerRoutes = [
    {
        path: '/',
        route: swagger_ui_express_1.default.serve,
        docs: swagger_ui_express_1.default.setup(swagger_json_1.default, {
            customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
            customCssUrl: SWAGGER_CSS_URL
        }),
    },
];
if (config_1.CONFIG.APP.DOCS === "enabled") {
    swaggerRoutes.forEach((route) => {
        router.use(route.path, route.route, route.docs);
    });
}
