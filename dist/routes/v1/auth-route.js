"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouterV1 = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth-controller");
const authRouterV1 = (0, express_1.Router)();
exports.authRouterV1 = authRouterV1;
authRouterV1.post('/login', auth_controller_1.AuthController.login);
authRouterV1.post('/register', auth_controller_1.AuthController.registerUser);
authRouterV1.post('/admin/register', auth_controller_1.AuthController.registerAdmin);
