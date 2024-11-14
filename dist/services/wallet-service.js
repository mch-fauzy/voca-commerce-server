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
exports.WalletService = void 0;
const winston_1 = require("../configs/winston");
const wallet_model_1 = require("../models/wallet-model");
const wallet_repository_1 = require("../repositories/wallet-repository");
const failure_1 = require("../utils/failure");
// Wallet must associated with userId
class WalletService {
}
exports.WalletService = WalletService;
_a = WalletService;
WalletService.createByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalWallets = yield wallet_repository_1.WalletRepository.countByFilter({
            filterFields: [{
                    field: wallet_model_1.WALLET_DB_FIELD.userId,
                    operator: 'equals',
                    value: req.userId
                }]
        });
        if (totalWallets !== 0)
            throw failure_1.Failure.conflict('User already has a wallet');
        yield wallet_repository_1.WalletRepository.create({
            userId: req.userId,
            createdBy: req.email,
            updatedBy: req.email
        });
        return 'Success';
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[WalletService.createByUserId] Error creating wallet by user id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create wallet by user id');
    }
});
WalletService.getBalanceByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [wallets, totalWallets] = yield wallet_repository_1.WalletRepository.findManyAndCountByFilter({
            selectFields: [
                wallet_model_1.WALLET_DB_FIELD.balance
            ],
            filterFields: [{
                    field: wallet_model_1.WALLET_DB_FIELD.userId,
                    operator: 'equals',
                    value: req.userId
                }]
        });
        if (totalWallets === 0)
            throw failure_1.Failure.notFound('User does not have a wallet');
        const response = {
            balance: wallets[0].balance
        };
        return response;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[WalletService.getBalanceByUserId] Error retrieving wallet balance by user id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to retrieve wallet balance by user id');
    }
});
WalletService.depositBalanceByUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[WalletService.depositBalanceByUserId] Error depositing balance into wallet by user id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to deposit balance into wallet by user id');
    }
});
WalletService.withdrawBalanceByUserId = () => __awaiter(void 0, void 0, void 0, function* () {
});
