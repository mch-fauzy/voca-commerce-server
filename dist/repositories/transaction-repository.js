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
const failure_1 = require("../utils/failure");
class TransactionRepository {
}
exports.TransactionRepository = TransactionRepository;
_a = TransactionRepository;
TransactionRepository.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.voca_transaction.create({ data: data });
    }
    catch (error) {
        winston_1.logger.error(`[TransactionRepository.create] Error creating transaction: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create transaction');
    }
});
TransactionRepository.updateById = (primaryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const isTransactionAvailable = await this.existsById(primaryId);
        // if (!isTransactionAvailable) throw Failure.notFound(`Transaction not found`);
        yield prisma_client_1.prisma.voca_transaction.update({
            where: { id: primaryId.id },
            data: data
        });
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionRepository.updateById] Error updating transaction by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update transaction by id');
    }
});
TransactionRepository.existsById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        winston_1.logger.error(`[TransactionRepository.existsById] Error determining transaction by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to determine transaction by id');
    }
});
