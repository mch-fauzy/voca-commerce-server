"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.USER_DB_FIELD = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return client_1.voca_role; } });
const USER_DB_FIELD = {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
};
exports.USER_DB_FIELD = USER_DB_FIELD;
