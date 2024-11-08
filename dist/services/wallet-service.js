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
const user_repository_1 = require("../repositories/user-repository");
const wallet_repository_1 = require("../repositories/wallet-repository");
const custom_error_1 = require("../utils/custom-error");
// Wallet must associated with userId
class WalletService {
}
exports.WalletService = WalletService;
_a = WalletService;
WalletService.createWalletByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_repository_1.UserRepository.isUserExistById(req.userId);
        if (!isUserExist)
            throw custom_error_1.CustomError.notFound(`User not found`);
        const wallets = yield wallet_repository_1.WalletRepository.getWalletsByFilter({
            selectFields: [
                wallet_model_1.WALLET_DB_FIELD.userId
            ],
            filterFields: [{
                    field: wallet_model_1.WALLET_DB_FIELD.userId,
                    operator: 'equals',
                    value: req.userId
                }]
        });
        if (wallets.count !== 0)
            throw custom_error_1.CustomError.conflict('User already has an existing wallet');
        yield wallet_repository_1.WalletRepository.createWallet({
            userId: req.userId,
            createdBy: req.email,
            updatedBy: req.email
        });
        return 'Success';
    }
    catch (error) {
        if (error instanceof custom_error_1.CustomError)
            throw error;
        winston_1.logger.error(`[createWallet] Service error creating wallet: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create wallet');
    }
});
WalletService.getBalanceFromWalletByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_repository_1.UserRepository.isUserExistById(req.userId);
        if (!isUserExist)
            throw custom_error_1.CustomError.notFound(`User not found`);
        const wallets = yield wallet_repository_1.WalletRepository.getWalletsByFilter({
            selectFields: [
                wallet_model_1.WALLET_DB_FIELD.balance
            ],
            filterFields: [{
                    field: wallet_model_1.WALLET_DB_FIELD.userId,
                    operator: 'equals',
                    value: req.userId
                }]
        });
        if (wallets.count === 0)
            throw custom_error_1.CustomError.notFound('User does not have a wallet');
        const response = {
            data: wallets.data[0],
            metadata: {
                isFromCache: false
            }
        };
        return response;
    }
    catch (error) {
        if (error instanceof custom_error_1.CustomError)
            throw error;
        winston_1.logger.error(`[getBalanceFromWalletByUserId] Service error getting balance from wallet by user id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to get balance from wallet by user id');
    }
});
WalletService.depositToWalletByUserId = () => __awaiter(void 0, void 0, void 0, function* () {
});
WalletService.confirmDepositToWallet = () => __awaiter(void 0, void 0, void 0, function* () {
});
WalletService.withdrawFromWalletByUserId = () => __awaiter(void 0, void 0, void 0, function* () {
});
