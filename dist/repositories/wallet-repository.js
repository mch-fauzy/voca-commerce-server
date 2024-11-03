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
exports.WalletRepository = void 0;
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const custom_error_1 = require("../utils/custom-error");
class WalletRepository {
}
exports.WalletRepository = WalletRepository;
_a = WalletRepository;
WalletRepository.createWallet = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdWallet = yield prisma_client_1.prisma.voca_wallet.create({ data: data });
        return createdWallet;
    }
    catch (error) {
        winston_1.logger.error(`[createWallet] Repository error creating wallet: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create wallet');
    }
});
WalletRepository.updateWalletById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedWallet = yield prisma_client_1.prisma.voca_wallet.update({
            where: { id: id },
            data: data
        });
        return updatedWallet;
    }
    catch (error) {
        winston_1.logger.error(`[updateWalletById] Repository error updating wallet by id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to update wallet by id');
    }
});
WalletRepository.getWalletByUserId = (userId, fields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields } = fields !== null && fields !== void 0 ? fields : {};
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => {
                return [field, true];
            }))
            : undefined;
        const wallet = yield prisma_client_1.prisma.voca_wallet.findUnique({
            where: { userId: userId },
            select
        });
        return wallet;
    }
    catch (error) {
        winston_1.logger.error(`[getWalletByUserId] Repository error retrieving wallet by user id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to retrieving wallet by user id');
    }
});
WalletRepository.isWalletExistByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield prisma_client_1.prisma.voca_wallet.findUnique({
            where: { userId: userId },
            select: { userId: true }
        });
        return wallet ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[isWalletExistByUserId] Repository error checking wallet by user id');
        throw custom_error_1.CustomError.internalServer('Failed to check wallet by user id');
    }
});
