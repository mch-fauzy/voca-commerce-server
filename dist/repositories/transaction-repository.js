"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const custom_error_1 = require("../utils/custom-error");
class TransactionRepository {
}
exports.TransactionRepository = TransactionRepository;
_a = TransactionRepository;
TransactionRepository.createTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdTransaction = yield prisma_client_1.prisma.voca_transaction.create({ data: data });
        return createdTransaction;
    }
    catch (error) {
        winston_1.logger.error(`[createTransaction] Repository error creating transaction: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create transaction');
    }
});
