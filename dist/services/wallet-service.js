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
const constants_1 = require("../utils/constants");
const failure_1 = require("../utils/failure");
const redis_cache_1 = require("../utils/redis-cache");
// Wallet must associated with userId
class WalletService {
}
exports.WalletService = WalletService;
_a = WalletService;
WalletService.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
        winston_1.logger.error(`[WalletService.create] Error creating wallet: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create wallet');
    }
});
WalletService.getBalanceByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const walletBalanceKey = `${constants_1.CONSTANTS.REDIS.WALLET_BALANCE_KEY}:${req.userId}`;
        const walletBalanceCache = yield redis_cache_1.RedisUtils.getCacheByKey(walletBalanceKey);
        if (walletBalanceCache) {
            const response = JSON.parse(walletBalanceCache);
            response.metadata.isFromCache = true;
            return response;
        }
        ;
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
            data: wallets[0],
            metadata: {
                isFromCache: false
            }
        };
        yield redis_cache_1.RedisUtils.storeCacheWithExpiry(walletBalanceKey, constants_1.CONSTANTS.REDIS.CACHE_EXPIRY, JSON.stringify(response));
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
