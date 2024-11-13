"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = exports.TRANSACTION_DB_FIELD = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "TransactionType", { enumerable: true, get: function () { return client_1.voca_transaction_type; } });
Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function () { return client_1.voca_transaction_status; } });
const TRANSACTION_DB_FIELD = {
    id: 'id',
    walletId: 'walletId',
    type: 'type',
    amount: 'amount',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
};
exports.TRANSACTION_DB_FIELD = TRANSACTION_DB_FIELD;
