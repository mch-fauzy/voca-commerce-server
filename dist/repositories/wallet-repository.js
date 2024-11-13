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
        yield prisma_client_1.prisma.voca_wallet.create({ data: data });
        return;
    }
    catch (error) {
        winston_1.logger.error(`[createWallet] Repository error creating wallet: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to create wallet');
    }
});
WalletRepository.updateWalletById = (primaryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isWalletExistById = yield _a.isWalletExistById(primaryId);
        if (!isWalletExistById)
            throw custom_error_1.CustomError.notFound(`Wallet not found`);
        yield prisma_client_1.prisma.voca_wallet.update({
            where: { id: primaryId.id },
            data: data
        });
        return;
    }
    catch (error) {
        if (error instanceof custom_error_1.CustomError)
            throw error;
        winston_1.logger.error(`[updateWalletById] Repository error updating wallet by id: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to update wallet by id');
    }
});
WalletRepository.getWalletsByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific field (output: create a single object from array of array)
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]) // array of array
            )
            : undefined;
        // Handle filter field (output: create a single object from array of array)
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]) // array of array
            )
            : undefined;
        // Handle pagination
        const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
        const take = pagination ? pagination.pageSize : undefined;
        // Handle sort (output: array of object)
        const orderBy = sorts === null || sorts === void 0 ? void 0 : sorts.filter(sort => sort.field).map(({ field, order }) => ({ [field]: order }));
        const [wallets, totalWallets] = yield prisma_client_1.prisma.$transaction([
            prisma_client_1.prisma.voca_wallet.findMany({
                select,
                where,
                skip,
                take,
                orderBy
            }),
            prisma_client_1.prisma.voca_wallet.count({
                where
            })
        ]);
        return [wallets, totalWallets];
    }
    catch (error) {
        winston_1.logger.error(`[getWalletsByFilter] Repository error retrieving wallets by filter: ${error}`);
        throw custom_error_1.CustomError.internalServer('Failed to retrieve wallets by filter');
    }
});
WalletRepository.isWalletExistById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma_client_1.prisma.voca_wallet.findUnique({
            where: { id: primaryId.id },
            select: { id: true }
        });
        return product ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[isWalletExistById] Repository error checking wallet by id');
        throw custom_error_1.CustomError.internalServer('Failed to check wallet by id');
    }
});
